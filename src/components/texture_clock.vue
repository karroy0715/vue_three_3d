<template>
    <div ></div>
</template>

<script>
import * as THREE from 'three'
import {clock} from './loaders/clock'
export default {
    name:'K13',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            texture:null
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
            
            this.scene = new THREE.Scene();
        
            let light = new THREE.DirectionalLight(0xffffff);
            light.position.set(100,100,800);
            this.scene.add(light);

            let geometry = new THREE.CubeGeometry( 10 , 10 , 10 );
            let canvas;
            this.texture = new THREE.Texture(canvas);
            let material = new THREE.MeshPhongMaterial({map:this.texture });
            this.texture.needsUpdate = true;
            
            this.mesh = new THREE.Mesh(geometry,material);
            this.scene.add(this.mesh);

            window.addEventListener('resize',this.onWindowResize,false);
        },
        onWindowResize(){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);

        },
        animate:function(){
            this.texture.needsUpdate = true;
            this.mesh.rotation.x -= 0.01;
            this.mesh.rotation.y -= 0.01;
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animate);
            
        }
    },
    mounted(){
        clock();
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
