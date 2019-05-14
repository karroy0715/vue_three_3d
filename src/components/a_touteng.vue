<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output" @mousedown="touchstart"></div>
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
    name:'A5',
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
            z:null,
            model2:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xcce0ff); 

            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            this.camera.position.set(0, 0, 50);
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

            window.addEventListener('click',this.touchstart,false);
           
        },
        loadModel(){
            this.guiControls = new function(){
                this.group = true;
                this.rotation = false;
                this.scale = 80;
            }
            let self = this; 
            this.group = new THREE.Group();

            // let gui = new dat.GUI();
            // gui.add(this.guiControls, 'scale', 50, 100).onChange(function(e){
            //     self.group.scale.set(e,e,e);
            // });
            // gui.add(this.guiControls, 'group');
            // gui.add(this.guiControls, 'rotation');          
             
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
                let mdwid=bbox.max.z-bbox.min.z;
                self.z = mdwid;
                let mdhei=bbox.max.y-bbox.min.y;
                // console.log('mdlen值为:' + mdlen  + '     ' + 'mdwid值为:' + mdwid + '    ' + 'mdhei值为:' + mdhei);

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
                
                self.model2.position.set(0,0,self.z/2); 
                console.log('self.z' + self.z);
                self.model2.name = 'cover'; 
                self.group.add(self.model2);  
                              
            }); 
            this.group.position.set(0,0,0);
            self.scene.add(this.group);
             
        }, 
        touchstart(event){
            if(event){
           
            //这个类设计用于鼠标去获取在3D世界被鼠标选中的一些物体
            //在实际代码中我们组成射线的两个点是摄像机所在视点与屏幕上点击的点连接而成的射线
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();

            //pageX和pageY获取的是鼠标指针距离文档（HTML）的左上角距离，不会随着滚动条滚动而改变；
            //clientX和clientY获取的是鼠标指针距离可视窗口(不包括上面的地址栏和滑动条)的距离，会随着滚动条滚动而改变；
            mouse.x = ( event.clientX / window.innerWidth )*2 - 1; ///鼠标的x到屏幕y轴的距离与屏幕宽的一半的比值 绝对值不超过1
            mouse.y = -( event.clientY / window.innerHeight )*2 + 1;
            raycaster.setFromCamera( mouse, this.camera );//通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置,用新的原点和方向来更新射线

            let intersects = raycaster.intersectObjects( this.model2.children );//新建一条从相机的位置到vector向量的一道光线
            if ( intersects.length > 0 ) {
                var selectedObject = intersects[ 0 ].object;//一旦 intersects  不为空，intersects[0].object 就是鼠标选中的物体

                this.model2.rotation.y = Math.PI/4;//旋转计算不对
			} 
            }
           
        },
        animate() {
            requestAnimationFrame(this.animate);
            if (this.controls) this.controls.update();


            this.renderer.render(this.scene, this.camera);
            this.stats.update();     
        }
    },
    mounted(){
        this.init();
        this.loadModel();
        this.touchstart();
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