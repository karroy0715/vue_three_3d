<template>
    <div></div>    
</template>

<script>
import * as THREE from 'three'
export default {
    name:'H01',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            arrowHelper:null,
            axesHelper:null,
        }
    },
    methods:{
        init:function(){
            let width,height;
            width = window.innerWidth;
            height = window.innerHeight;
            this.camera = new THREE.PerspectiveCamera(85, width/height, 0.01, 100);
            this.camera.position.z = 5;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf5f5f5);

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width, height);
            document.body.appendChild(this.renderer.domElement);

            let geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
            let material = new THREE.MeshBasicMaterial({color: 0xff00ff,wireframe:true});
            this.mesh = new THREE.Mesh(geometry, material); 
            this.scene.add(this.mesh);
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
        animate:function(){
            requestAnimationFrame(this.animate);
            this.mesh.rotation.x += 0.01;
            this.arrowHelper.rotation.z += 0.02;
			this.axesHelper.rotation.x += 0.01;
            this.renderer.render(this.scene, this.camera);
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
        margin: none;
        overflow: hidden;
    }
</style>
