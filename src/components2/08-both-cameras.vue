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
    name:"book08",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            sphere:null,
            stats:null,
            controls:null,
            plane:null, 
            planeGeometry:null,
            lookAtMesh:null,
            step:0,
        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xEEEEEE);
            // this.scene.fog = new THREE.Fog(0xffffff,0.015,100); //雾化

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(120,60,180);

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

            this.planeGeometry = new THREE.PlaneGeometry(180,180);
            let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
            this.plane = new THREE.Mesh(this.planeGeometry,planeMaterial);
            this.plane.receiveShadow = true;
            this.plane.position.set(0,0,0);
            this.plane.rotation.x = -0.5*Math.PI;
            this.scene.add(this.plane);

            let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
            directionalLight.position.set(-20, 40, 60);
            this.scene.add(directionalLight);

            let cubeGeometry = new THREE.BoxGeometry(4,4,4);
            for(let j = 0; j < ( this.planeGeometry.parameters.height /5); j++){
                for(let i = 0; i < (this.planeGeometry.parameters.width /5); i++){
                    let cubeMaterial = new THREE.MeshLambertMaterial({color:Math.random() * 0xffffff});
                    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

                    cube.position.z = -((this.planeGeometry.parameters.height)/2) +2 +(j*5);
                    cube.position.x = -((this.planeGeometry.parameters.width)/2) +2 +(i*5);
                    cube.position.y = 2;

                    this.scene.add(cube);
                }
            }

            let lookAtGeom = new THREE.SphereGeometry(4);
            let lookAtMate = new THREE.MeshLambertMaterial({color: 0xff0000});
            this.lookAtMesh = new THREE.Mesh(lookAtGeom, lookAtMate);
            this.scene.add(this.lookAtMesh); 

            let self = this;
            this.controls = new function(){
                this.perspective = "Perspective";
                this.switchCamera = function(){
                    if(self.camera instanceof THREE.PerspectiveCamera){
                        self.camera = new THREE.OrthographicCamera(
                            window.innerWidth/-16,window.innerHeight/16,
                            window.innerWidth/16,window.innerHeight/-16, -200, 500
                        );
                        self.camera.position.set(120,60,180);
                        self.camera.lookAt(self.scene.position);
                        this.perspective = "Orthographic";
                    }
                    else{
                        self.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
                        self.camera.position.set(120,60,180);
                        self.camera.lookAt(self.scene.position);
                        this.perspective = "Perspectove";
                    }
                }                              
            };

            let gui = new dat.GUI(); //控制器
            gui.add(this.controls,'switchCamera');
            gui.add(this.controls,"perspective").listen();

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);
          
        },
        animate(){
          
            this.step += 0.02;
            if(this.camera instanceof THREE.Camera){
                let x = 10 + (100* (Math.sin(this.step)));
                this.camera.lookAt(new THREE.Vector3(x,10,0));
                this.lookAtMesh.position.copy(new THREE.Vector3(x,10,0));
            }
            
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

