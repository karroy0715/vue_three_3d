<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
// import { ModelGltf } from 'vue-3d-model'
import {GLTFLoader} from './loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import {Stats} from './loaders/Stats.js'
import {OrbitControls} from './loaders/OrbitControls';

export default {
    name:'A7',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            stats:null,
            geometry:null,
        
        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xCCE8CF); 

            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            this.camera.position.set(0,0,180);
            this.camera.updateProjectionMatrix(); //相机更新

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let light = new THREE.AmbientLight(0x666666);
            this.scene.add(light);
            let dirlight = new THREE.DirectionalLight(0xdfebff, 1);
            dirlight.position.set(10, 10, 100);
            dirlight.castShadow = true;

            let axes = new THREE.AxisHelper(200);
            this.scene.add(axes);

            let controls = new OrbitControls(this.camera, this.renderer.domElement);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);

            this.width = 40;
            this.height = 40;
            this.depth = 20;

            let geometry1 = new THREE.PlaneBufferGeometry(this.width,this.height);
            let geometry2 = new THREE.PlaneBufferGeometry(this.width,this.depth);
            let geometry3 = new THREE.PlaneBufferGeometry(this.depth,this.height);
            
            let loader = new THREE.TextureLoader();

            let texture1 = loader.load('/static/texture/squirrelbox/1.jpg');
            let material1 = new THREE.MeshLambertMaterial({map:texture1});
            this.mesh1 = new THREE.Mesh(geometry1,material1);
            this.mesh1.position.set(0,0,this.depth/2);
            this.scene.add(this.mesh1);

            let texture3 = loader.load('/static/texture/squirrelbox/3.jpg');
            let material3 = new THREE.MeshLambertMaterial({map:texture3});
            this.mesh3 = new THREE.Mesh(geometry1,material3);
            this.mesh3.position.set(0,0,-this.depth/2);
            this.mesh3.rotation.x = -Math.PI;
            this.mesh3.rotation.z = -Math.PI;
            this.scene.add(this.mesh3);

            let texture2 = loader.load('/static/texture/squirrelbox/2.jpg');
            let material2 = new THREE.MeshLambertMaterial({map:texture2});
            this.mesh2 = new THREE.Mesh(geometry2,material2);
            this.mesh2.position.set(0,-this.height/2,0);
            this.mesh2.rotation.x = -Math.PI/2;
            this.scene.add(this.mesh2);

            let texture4 = loader.load('/static/texture/squirrelbox/4.jpg');
            let material4 = new THREE.MeshLambertMaterial({map:texture4});
            this.mesh4 = new THREE.Mesh(geometry2,material4);
            this.mesh4.position.set(0,this.height/2,0);
            this.mesh4.rotation.x = -Math.PI/2;
            this.scene.add(this.mesh4);

            let texture5 = loader.load('/static/texture/squirrelbox/5.jpg');
            let material5 = new THREE.MeshLambertMaterial({map:texture5});
            this.mesh5 = new THREE.Mesh(geometry3,material5);
            this.mesh5.position.set(-this.width/2,0,0);
            this.mesh5.rotation.y = -Math.PI/2;
            this.scene.add(this.mesh5);

            let texture6 = loader.load('/static/texture/squirrelbox/5.jpg');
            let material6 = new THREE.MeshLambertMaterial({map:texture6});
            this.mesh6 = new THREE.Mesh(geometry3,material6);
            this.mesh6.position.set(this.width/2,0,0);
            this.mesh6.rotation.y = Math.PI/2;
            this.scene.add(this.mesh6);

            let self = this;
            
            this.controls = new function(){
                this.target = "closeDoor";
            };
            let gui = new dat.GUI();
            let door_state = true;
            let direction = true;
            gui.add(this.controls, 'target', ['closeDoor','openLeft','openRight','openUp','openDown']).onChange(function (e) {
                console.log(e);
                switch (e) {
                    case "closeDoor":
                    if(!door_state){
                        if(direction){
                            self.mesh1.position.set(0,0,self.depth/2);
                            self.mesh1.rotation.y =0 ;
                        }else{
                            self.mesh1.position.set(0,0,self.depth/2);
                            self.mesh1.rotation.x =0 ;                            
                        }
                        door_state = true;
                    }
                    break;

                    case "openLeft":
                        if(door_state){                      
                            let angle = -Math.PI/4;
                            self.mesh1.rotation.y = angle;
                            let a = 0 - (self.width * 0.5 *(1-Math.cos(angle)));
                            let b = 0;
                            let c = self.depth/2 + self.width *0.5 *Math.sin(Math.abs(angle));
                            self.mesh1.position.set(a, b,c);
                            door_state = false;
                            direction = true;
                        }
                        break; 
                    
                     case "openRight":
                        if(door_state){                         
                            let angle = Math.PI/4;
                            self.mesh1.rotation.y = angle;
                            let a = 0 + (self.width * 0.5 *(1-Math.cos(angle)));
                            let b = 0;
                            let c = self.depth/2 + self.width *0.5 *Math.sin(Math.abs(angle));
                            self.mesh1.position.set(a, b,c);
                            door_state = false;
                            direction = true;
                        }
                        break; 
                    
                    case "openUp":
                        if(door_state){
                            let angle = -Math.PI/4;
                            self.mesh1.rotation.x = angle;
                            let a2 = 0;
                            let b2 = 0 + (self.height * 0.5 *(1-Math.cos(angle)));
                            let c2 = self.depth/2 + self.height *0.5 *Math.sin(Math.abs(angle));
                            self.mesh1.position.set(a2, b2,c2);
                            door_state = false;
                            direction = false;
                        }
                        break;
                    
                    case "openDown":
                        if(door_state){
                            let angle = Math.PI/4;
                            self.mesh1.rotation.x = angle;
                            let a2 = 0;
                            let b2 = 0 - (self.height * 0.5 *(1-Math.cos(angle)));
                            let c2 = self.depth/2 + self.height *0.5 *Math.sin(Math.abs(angle));
                            self.mesh1.position.set(a2, b2,c2);
                            door_state = false;
                            direction = false;
                        }
                        break;  
                }
            });            
        }, 
        animate() {
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene, this.camera);
            this.stats.update();     
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