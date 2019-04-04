<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
//import * as Stats from 'stats'
import {Stats} from './loaders/Stats'
export default {
    name:'K07',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null, 
            stats:null
        }
    },
    methods:{
        init:function(){
            let width,height;
            width = window.innerWidth;
            height = window.innerHeight;

            this.camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
            this.camera.position.set(0,0,600);

            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width, height);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0xffffff,1.0);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild(this.stats.domElement);

            this.light = new THREE.AmbientLight(0xffffff);
            this.light.position.set(100,100,200);
            this.scene.add(this.light);

            // this.light = new THREE.PointLight(0xffffff);
            // this.light.position.set(0,0,300);
            // this.scene.add(this.light);           
           
            let geometry = new THREE.CylinderGeometry(50,50,70);
            let material = new THREE.MeshLambertMaterial({color:0xffff00});
            this.mesh = new THREE.Mesh(geometry,material);
            this.mesh.position = new THREE.Vector3(0,0,0);
            this.scene.add(this.mesh);
        },
        animate:function(){
            requestAnimationFrame(this.animate);
            this.mesh.position.x += 0.1;
            this.renderer.render(this.scene,this.camera);
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
        margin: none;
        background-color: #000000;
        overflow: hidden;
    }
</style>
