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
    name:"book07",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
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
            this.scene.fog = new THREE.Fog(0xffffff,0.015,100); //雾化

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

            this.controls = new function(){
                this.scaleX = 1;
                this.scaleY = 1;
                this.scaleZ = 1;

                this.positionX = 0;
                this.positionY = 4;
                this.positionZ = 0;

                this.rotationX = 0;
                this.rotationY = 0;
                this.rotationZ = 0;
                this.scale = 1;

                this.translateX = 0;
                this.translateY = 0;
                this.translateZ = 0;

                this.visible = true;
               
                this.translate = function(){
                    self.cube.translateX(self.controls.translateX);
                    self.cube.translateY(self.controls.translateY);
                    self.cube.translateZ(self.controls.translateZ);

                    self.controls.positionX = self.cube.position.x;
                    self.controls.positionY = self.cube.position.y;
                    self.controls.positionZ = self.cube.position.z;
                }
            };

            let material = new THREE.MeshLambertMaterial({color:0x0000ff});
            let geometry = new THREE.BoxGeometry(5,8,3);
            this.cube = new THREE.Mesh(geometry,material);
            this.cube.position.set(0,4,0);
            this.cube.castShadow = true;
            this.scene.add(this.cube);

            let gui = new dat.GUI(); //控制器
            let guiScale = gui.addFolder('scale');
            guiScale.add(this.controls,'scaleX',0,5);
            guiScale.add(this.controls,'scaleY',0,5);
            guiScale.add(this.controls,'scaleZ',0,5);      
            
            let guiPosition = gui.addFolder('position');
            let contX = guiPosition.add(this.controls,'positionX',-10,10);
            let contY = guiPosition.add(this.controls,'positionY',-4,20);
            let contZ = guiPosition.add(this.controls,'positionZ',-10,10);

            contX.listen();
            let self = this;
            contX.onChange(function(value){
                self.cube.position.x = self.controls.positionX;
            });
            contY.listen();
            contY.onChange(function(value){
                self.cube.position.y = self.controls.positionY;
            });
            contZ.listen();
            contZ.onChange(function(value){
                self.cube.position.z = self.controls.positionZ;
            });

            let guiRotation = gui.addFolder('rotation');
            guiRotation.add(this.controls, 'rotationX', -4, 4);
            guiRotation.add(this.controls, 'rotationY', -4, 4);
            guiRotation.add(this.controls, 'rotationZ', -4, 4);

            let guiTranslate = gui.addFolder('translate');
            guiTranslate.add(this.controls, 'translateX', -10, 10);
            guiTranslate.add(this.controls, 'translateY', -10, 10);
            guiTranslate.add(this.controls, 'translateZ', -10, 10);
            guiTranslate.add(this.controls, 'translate');

            gui.add(this.controls, 'visible');           
            
            
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);
          
        },
        animate(){
            this.cube.visible = this.controls.visible;

            this.cube.rotation.x = this.controls.rotationX;
            this.cube.rotation.y = this.controls.rotationY;
            this.cube.rotation.z = this.controls.rotationZ;

            this.cube.scale.set(this.controls.scaleX,this.controls.scaleY,this.controls.scaleZ);

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

