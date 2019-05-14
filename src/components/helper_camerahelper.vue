<template>
    <div></div>
</template>

<script>
import * as THREE from "three"
import {OrbitControls} from './loaders/OrbitControls.js'
export default {
    name:"H06",
    data(){
        return{
            renderer:null,
            scene:null,
            camera:null,
            controls:null,
            mesh:null,
            arrowHelper:null,
            axesHelper:null,

        }
    },
    methods:{
        init(){
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            document.body.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xcfcfcf);

            this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(5,0,5);

            let geometry = new THREE.BoxGeometry(1,1,2);
            let material = new THREE.MeshBasicMaterial({
                color:0x0000ff,
                wireframe:true
            });
            this.mesh = new THREE.Mesh(geometry,material);
            this.scene.add(this.mesh);

            let helper = new THREE.CameraHelper(this.camera);
            this.scene.add(helper);

            this.controls = new OrbitControls(this.camera,this.renderer.domElement);

            //箭头模块
            
            let dir = new THREE.Vector3(0,1000,0);//来自原点的方向，必须是单位向量
            dir.normalize();//规格化方向向量，转换为长度为1的向量
            let origin = new THREE.Vector3(0,0,0);//箭头开始的点
            let length = 3;//箭头的长度，默认值为1
            let hex = 0xffff00;//用于定义颜色 默认值为0xffff00
            let headlength = 0.5;//箭头长度，默认值为0.2*length
            let headWidth = 0.2; //箭头宽度的长度 ，默认值为0.2*headlength
            this.arrowHelper = new THREE.ArrowHelper(dir,origin,length,hex,headlength,headWidth);//箭头显示助手
            this.scene.add(this.arrowHelper);

            //坐标轴模块
            let size =3;
            this.axesHelper = new THREE.AxesHelper(size);
            this.scene.add(this.axesHelper);            
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.mesh.rotation.x += 0.1;
            this.renderer.render(this.scene,this.camera);
        }   
    },
    mounted(){
        this.init();
        this.animate();
    }
}
</script>
