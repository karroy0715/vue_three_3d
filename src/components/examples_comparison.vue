<template>
    <div class="container">
        <div class="slider"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import{ OrbitControls } from './loaders/OrbitControls.js'
import{ WEBGL } from './loaders/WebGL.js'

export default {
    name:"E02",
    data(){
        return{
            camera:null,
            renderer:null,
            sceneL:null,
            sceneR:null,
            controls:null,
            container:null,
            sliderPos:window.innerWidth/2,
            sliderMoved:false,
        }
    },
    methods:{
        init(){
            this.container = document.querySelector('.container');
            this.sceneL = new THREE.Scene();
            this.sceneL.background = new THREE.Color(0x0000ff);
            this.sceneR = new THREE.Scene();
            this.sceneR.background = new THREE.Color(0x00ff00);

            this.camera = new THREE.PerspectiveCamera(40,this.container.clientWidth/this.container.clientHeight,0.1,10);
            this.camera.position.set(2,4,7);

            this.controls = new OrbitControls(this.camera,this.container);

            this.initMeshes();
            this.initLights();

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
            //设置设备像素比。通常用于HiDPI设备防止模糊输出canvas。
            this.renderer.setPixelRatio(window.devicePixelRatio);
            //启用或禁用裁剪测试。被激活时，只有裁剪区域内的像素会被进一步的渲染行为所影响。
            this.renderer.setScissorTest(true); 

            this.container.appendChild(this.renderer.domElement);
            let self = this;
            this.renderer.setAnimationLoop(function(){
                //使用相机渲染一个场景。
                self.render();
            });
            window.addEventListener('resize',this.onWindowResize,false);
            this.initComparisons();
        },
        initMeshes(){
            let geoA = new THREE.IcosahedronBufferGeometry(1,0);
            let matA = new THREE.MeshStandardMaterial({color:0xffff00});
            let meshA= new THREE.Mesh(geoA,matA);
            this.sceneL.add(meshA);
            
            let geoB = new THREE.BoxBufferGeometry(2,2,2);
            let matB = new THREE.MeshStandardMaterial({color:0xff0000});
            let meshB= new THREE.Mesh(geoB,matB);
            this.sceneR.add(meshB);
        },
        initLights(){
            let light1 = new THREE.DirectionalLight();
            light1.position.set(20,20,20);
            this.sceneL.add(light1);
            this.sceneR.add(light1.clone());

            let light2 = new THREE.DirectionalLight();
            light2.position.set(20,20,20);
            this.sceneL.add(light2);
            this.sceneR.add(light2.clone());
        },
        render(){
            //将剪裁区域设为(x, y)到(x + width, y + height)
            this.renderer.setScissor(0,0,this.sliderPos,window.innerHeight/2);
            this.renderer.render(this.sceneL,this.camera);
            //这个地方有些不懂？？？？
            this.renderer.setScissor(this.sliderPos,0,window.innerWidth,window.innerHeight/2);
            this.renderer.render(this.sceneR,this.camera);
            this.renderer.setScissor(0,window.innerHeight/2,window.innerWidth,window.innerHeight);
            this.renderer.render(this.sceneR,this.camera); 
        },
        onWindowResize(){
            this.camera.aspect = this.container.clientWidth/this.container.clientHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.container.clientWidth,this.container.clientHeight);
            // if(!sliderMoved) this.sliderPos = window.innerWidth/2;
        },
        initComparisons(){
            let slider = document.querySelector('.slider');
            let clicked = false;
            let slideReady = () =>{
                clicked = true; this.controls.enabled = true;
            }
            let slideFinish = () =>{
                clicked = false; this.controls.enabled = false;
            }
            let slideMove = (e) =>{
                if(!clicked) return false;
                this.sliderMoved = true;
                this.sliderPos = e.pageX || e.touches[0].pageX;

                //prevent the slider from being positioned outside the window bounds
                if(this.sliderPos < 0 ) this.sliderPos = 0;
                if(this.sliderPos > window.innerWidth) this.sliderPos = window.innerWidth;

                slider.style.left = this.sliderPos - (slider.offsetWidth/2) + 'px';

            }
            slider.addEventListener('mousedown',slideReady); 
            slider.addEventListener('touchstart',slideReady);  

            slider.addEventListener('mouseup',slideFinish);  
            slider.addEventListener('touchend',slideFinish);  

            slider.addEventListener('mousemove',slideMove);  
            slider.addEventListener('touchmove',slideMove);  

        },

     },
    mounted(){
        this.init();
    }
}
</script>

<style>
    body {
        margin: 0px;
        overflow: hidden;
        text-align: center;
    }
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .slider {
        position: absolute;
        cursor: ew-resize;
        width: 40px;
        height: 40px;
        background-color: #2196F3;
        border:2px solid #ff0000;
        opacity: 0.7;
        border-radius: 50%;
        top: calc(50% - 20px);
        left: calc(50% - 20px);
    }
</style>
