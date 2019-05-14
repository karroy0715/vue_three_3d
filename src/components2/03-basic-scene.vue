<template>
    <div>
        <div id = "Stats-output" ></div>
        <div id = "WebGL-output" ></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {Stats} from './loaders/stats.js'
import {OrbitControls} from './loaders/OrbitControls'

export default {
    name:"book03",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
            sphere:null,
            stats:null,
            controls:null,
            plane:null, 
            planeGeometery:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xEEEEEE);

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(-30,40,30);
            this.camera.lookAt(this.scene.position);

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

            this.planeGeometery = new THREE.PlaneGeometry(60,40,1,1);
            let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
            this.plane = new THREE.Mesh(this.planeGeometery,planeMaterial);
            this.plane.receiveShadow = true;
            this.plane.position.set(0,0,0);
            this.plane.rotation.x = -0.5*Math.PI;
            this.scene.add(this.plane);

            let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40,60,-10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            let self = this;
            this.controls = new function(){
                this.rotationSpeed = 0.02;
                this.numberOfObjects = self.scene.children.length;

                this.addCube = function(){
                    let cubeSize = Math.ceil((Math.random()*3));
                    let cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
                    let cubeMaterial = new THREE.MeshLambertMaterial({color:Math.random() * 0xffffff});
                    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
                    cube.castShadow = true;
                    cube.name = "cube-" + self.scene.children.length;
                    cube.position.set(
                        -30+Math.round((Math.random()* self.planeGeometery.parameters.width)),
                        Math.round((Math.random()*5)),
                        -20+Math.round(Math.random()* self.planeGeometery.parameters.height)
                    );
                    self.scene.add(cube);
                    this.numberOfObjects = self.scene.children.length;
                };

                this.removeCube = function(){
                    let allChildren = self.scene.children;
                    let lastObject = allChildren[allChildren.length-1];
                    if(lastObject instanceof THREE.Mesh){
                        self.scene.remove(lastObject);
                        this.numberOfObjects = self.scene.children.length;
                    }
                };

                this.outputObjects = function(){
                    console.log(self.scene.children);
                };
            };

            let gui = new dat.GUI(); //控制器
            gui.add(this.controls,'rotationSpeed',0,0.5);
            gui.add(this.controls,"addCube");
            gui.add(this.controls,"removeCube");
            gui.add(this.controls,"outputObjects");
            gui.add(this.controls,"numberOfObjects").listen();

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);
          
        },
        animate(){
            let self = this;
            this.scene.traverse(function(e){               
                if(e instanceof THREE.Mesh && e != self.plane){
                    e.rotation.x += self.controls.rotationSpeed;
                    e.rotation.y += self.controls.rotationSpeed;
                    e.rotation.z += self.controls.rotationSpeed;
                }
            });
            this.stats.update();  

            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera); 
        }
    },
    mounted(){
        this.init();
        this.animate();
    }    
}
</script>

<style>
    body{
        margin: 0;
        overflow:hidden;
    }
</style>

