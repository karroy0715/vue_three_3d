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
    name:'A6',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            cube1:null,
            stats:null,
            clock:null,
            model:null,
            group:0,
            camControls:null,
            a:null,
            b:null,
            c:null,
            model2:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xf5f5f5); 

            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            this.camera.position.set(0,0, 50);
            // let target = new THREE.Vector3(0, 0, 0);
            // this.camera.lookAt(target);
            this.camera.updateProjectionMatrix(); //相机更新

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            //环境光和方向光混合以及加了阴影
            let light = new THREE.AmbientLight(0x666666);
            this.scene.add(light);

            let dirlight = new THREE.DirectionalLight(0xdfebff, 1);
            dirlight.position.set(10, 10, 100);
            dirlight.castShadow = true;

            this.scene.add(dirlight);

            let helper = new THREE.DirectionalLightHelper(dirlight,50,0xffff00);
            this.scene.add(helper);

            let axes = new THREE.AxisHelper(200);
            this.scene.add(axes);

            //OrbitControls控件操作模块
            let controls = new OrbitControls(this.camera, this.renderer.domElement);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);

            window.addEventListener('click',this.clickModel,false);
           
        },
        loadModel(){
            let self = this; 
            this.group = new THREE.Group();
                    
            let loader = new GLTFLoader();
            loader.load('/static/models/gltf/coverless.glb',function (gltf){
                const model1 = gltf.scene;
                
                model1.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });
                
                model1.rotation.x = Math.PI/2; 
                model1.scale.set(2, 2, 2);
                model1.position.set(0,0,0);
                model1.name = 'coverless';

                let bbox = new THREE.Box3().setFromObject(model1);
                let mdlen=bbox.max.x-bbox.min.x; //边界的最小坐标值 边界的最大坐标值
                self.a = mdlen;
                let mdwid=bbox.max.z-bbox.min.z;
                self.c = mdwid;
                let mdhei=bbox.max.y-bbox.min.y;
                self.b = mdhei;
                
                self.group.add(model1);
            });

            let loader1 = new GLTFLoader();
            loader1.load('/static/models/gltf/cover.glb',function (gltf){
                self.model2 = gltf.scene;
                
                self.model2.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });              
                self.model2.rotation.x = Math.PI/2; 
                self.model2.rotation.y = Math.PI; 
                self.model2.scale.set(2, 2, 2);
                // self.model2.position.set(0,0,0); 
                // console.log('self.c' + self.c);
                self.model2.name = 'cover'; 

                let boxhelper = new THREE.BoxHelper(self.model2,0x0000ff); //外面红色框
                self.scene.add(boxhelper);  

                self.group.add(self.model2);  
                              
            }); 
            this.group.position.set(0,0,0);
            self.scene.add(this.group);

            this.controls = new function(){
                this.target = "closeDoor";
            };
            let gui = new dat.GUI();
            var door_state = true;
            gui.add(this.controls, 'target', ['closeDoor','openDoor']).onChange(function (e) {
                console.log(e);
                switch (e) {
                    case "closeDoor":
                    if(!door_state){
                        let temp3=new THREE.Object3D();
                        temp3.add(self.model2);
                        self.scene.add(temp3);
                        temp3.position.set(0,0,0); 
                        door_state = true;
                    }
                    break;

                    case "openDoor":
                        if(door_state){
                            window.ob = self;
                            // let temp=new THREE.Object3D();
                            // temp.add(self.model2);
                            // self.scene.add(temp);
                            // // temp.position.set(-self.a/2,0,self.c/2);

                            // let boxhelper2 = new THREE.BoxHelper(temp,0xffff00); //外面红色框
                            // self.scene.add(boxhelper2);

                            // let angle = -Math.PI/4;
                            // self.model2.rotation.y = angle;
                            // temp.rotation.y= angle;

                            // let a = 0 - (self.a * 0.5 *(1-Math.cos(angle)));
                            // let b = 0;
                            // let c = self.c/2 + self.a *0.5 *Math.sin(Math.abs(angle));
                            // console.log('a'+a +'b'+b +'c'+c );

                            // temp.position.set(a, b,c);
                            // temp.position.set(a+1.2, b,c-1.4);


                            // let bbox1 = new THREE.Box3().setFromObject(temp);
                            // let mdlen1=bbox1.max.x-bbox1.min.x; //边界的最小坐标值 边界的最大坐标值                          
                            // let mdwid1=bbox1.max.z-bbox1.min.z;                          
                            // let mdhei1=bbox1.max.y-bbox1.min.y;

                            // //m mdlwn1 - (a.x-b.x); n a.z-b.z
                            // let m =  mdlen1 - Math.abs(-self.a/2 - (temp.position.x-(mdlen1/2)));
                            // let n = Math.abs(self.c/2 - (temp.position.z - (mdwid1/2)));
                            // console.log( 'm' +m + 'n' +n);
                            
                            // temp.position.x +=  m;
                            // temp.position.z +=  n;

                            // let boxhelper1 = new THREE.BoxHelper(temp,0x00ff00); 
                            // self.scene.add(boxhelper1);


                            door_state = false;

                        // let axis = new THREE.Vector3(-self.a/2,0,self.c/2)
                        // let angel = -Math.PI/4;
                        // sel.model2.rotateOnAxis(axis,angle);

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
        this.loadModel();
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