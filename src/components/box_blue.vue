<template>
    <div></div>    
</template>

<script>
import * as THREE from 'three'
export default {
    name:'Karry',
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
            this.camera = new THREE.PerspectiveCamera(70, width/height, 0.01, 100);
            this.camera.position.z = 1;
            this.scene = new THREE.Scene();
            
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width, height);
            document.body.appendChild(this.renderer.domElement);

            let geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
            let material = new THREE.MeshBasicMaterial({color: 0x0000ff});
            this.mesh = new THREE.Mesh(geometry, material); 
            this.scene.add(this.mesh);
        },
        animate:function(){
            requestAnimationFrame(this.animate);
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.02;
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
        background-color: #000000;
        overflow: hidden;
    }
</style>
