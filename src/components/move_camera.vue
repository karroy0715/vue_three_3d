<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K05',
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
            let width,height;
            width = window.innerWidth;
            height = window.innerHeight;
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width, height);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0xffffff,1.0);

            this.camera = new THREE.PerspectiveCamera(30, width/height, 1, 1000);
            this.camera.position.set(0,0,600);
            // this.camera.up.set(0,1,0);
            // this.camera.lookAt({x:0,y:0,z:0});

            this.scene = new THREE.Scene();

            this.light = new THREE.AmbientLight(0xffffff);
            this.light.position.set(100,100,200);
            this.scene.add(this.light);

            let geometry = new THREE.CylinderGeometry(50,50,90);
            let material = new THREE.MeshLambertMaterial({color:0x00ff00});
            this.mesh = new THREE.Mesh(geometry,material);
            this.mesh.position = new THREE.Vector3(0,0,0);
            this.scene.add(this.mesh);
        },
        animate:function(){
            requestAnimationFrame(this.animate);
            this.camera.position.x = this.camera.position.x+0.5;
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
        margin: none;
        background-color: #000000;
        overflow: hidden;
    }
</style>
