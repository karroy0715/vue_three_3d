<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls.js'
export default {
    name:'H07',
    data(){
        return{
            renderer:null,
            scene:null,
            camera:null,
            controls:null,
            cube:null,
        }
    },
    methods:{
        init(){
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            document.body.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xcfcfcf);

            this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(0,0,150);
            let target = new THREE.Vector3(0,0,0);
            this.camera.lookAt(target);           
            
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);

            let geometry = new THREE.BoxGeometry(40,40,40);
            let material = new THREE.MeshBasicMaterial({
                color:0xff0000,
                wireframe:true,
            });

            this.cube = new THREE.Mesh(geometry,material);
            this.scene.add(this.cube);

            let light = new THREE.DirectionalLight(0x00ff00,2);
            light.position.set(20,20,50);

            let helper = new THREE.DirectionalLightHelper(light,50,0x0000ff);
            this.scene.add(helper);
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.cube.rotation.x += 0.1;
            this.renderer.render(this.scene,this.camera);
        },
    },
    mounted(){
        this.init();
        this.animate();
    }  
}
</script>

