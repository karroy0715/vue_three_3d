<template>
    <div ></div>
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K03',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            line:null
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

            this.camera = new THREE.PerspectiveCamera(45,width/height,1,10000);
            this.camera.position.set( 0,0,100);
            this.camera.up.set(0,1,0);
            // this.camera.lookAt({x : 0,y : 0,z : 0});
            this.scene = new THREE.Scene();

            let light = new THREE.DirectionalLight(0xff0000,1.0,0);
            light.position.set(100,100,200);
            this.scene.add(light);

            let geometry = new THREE.Geometry();
            let material = new THREE.LineBasicMaterial({vertexColors:true});
            let color1 = new THREE.Color(0x444444), color2 = new THREE.Color(0xff0000);
            let p1 = new THREE.Vector3(-100,0,100);
            let p2 = new THREE.Vector3(100,0,-100);
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);
            geometry.colors.push(color1,color2);
            this.line = new THREE.Line(geometry,material);
            this.scene.add(this.line);
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
