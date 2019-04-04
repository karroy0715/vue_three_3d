<!--环境光 方向光 点光源实例-->
<template>
    <div ></div>
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K10',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null
        }
    },
    methods:{
        init:function(){
            let width = window.innerWidth;
            let height = window.innerHeight;

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width,height);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0xf5f5f5,1);

            this.camera = new THREE.PerspectiveCamera(45,width/height,1,1000);
            this.camera.position.set(0,0,1000);

            this.scene = new THREE.Scene();
        
            //let light = new THREE.AmbientLight(0xff0000);
            //let light = new THREE.DirectionalLight(0xff0000);
            let light = new THREE.PointLight(0xff0000);
            light.position.set(100,100,800);
            
            
            this.scene.add(light);

            let geometry = new THREE.BoxGeometry(200,200,80);
            let material = new THREE.MeshLambertMaterial({color:0x880000});
            this.mesh = new THREE.Mesh(geometry,material);
            this.mesh.position = new THREE.Vector3(0,0,0);
            this.scene.add(this.mesh);
        },
        animate:function(){
            this.init();
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    },
    mounted(){
        this.animate();
    }
}
</script>

<style>
    body{
        margin: none;
        background-color: #000000;
        overflow: hidden;
    }
</style>
