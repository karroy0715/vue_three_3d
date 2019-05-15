<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output" @mousedown="mousedown"></div>
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
    name:'A8',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            stats:null,
            geometry:null,
            group:null,
            door_state:true,
        
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

            this.group = new THREE.Group();
            this.group.add(this.mesh1);
            // this.group.add(this.mesh2);
            // this.group.add(this.mesh3);
            // this.group.add(this.mesh4);
            // this.group.add(this.mesh5);
            // this.group.add(this.mesh6); 
            this.scene.add(this.group);                  
        }, 
        mousedown(event){
            if(event){
                let raycaster = new THREE.Raycaster();
                let mouse = new THREE.Vector2();

                mouse.x = ( event.clientX / window.innerWidth )*2 - 1;
                mouse.y = -( event.clientY / window.innerHeight )*2 + 1;
                raycaster.setFromCamera( mouse, this.camera );

                let intersects = raycaster.intersectObjects( this.group.children);                
                if ( intersects.length > 0 ) {
                    let selectedObject = intersects[ 0 ].object;
                    

                    if(this.door_state){                      
                        let angle = -Math.PI/4;
                        this.mesh1.rotation.y = angle;
                        let a = 0 - (this.width * 0.5 *(1-Math.cos(angle)));
                        let b = 0;
                        let c = this.depth/2 + this.width *0.5 *Math.sin(Math.abs(angle));
                        this.mesh1.position.set(a, b,c);
                        this.door_state = false;
                    }else{
                        this.mesh1.position.set(0,0,this.depth/2);
                        this.mesh1.rotation.y =0 ;  
                        this.door_state = true;                      
                    }
                } 
           } 
            
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