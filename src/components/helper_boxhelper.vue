<template>
    <div>

    </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls.js'
export default {
    name:"H05",
    data(){
        return{
            renderer:null,
            scene:null,
            camera:null,
            controls:null,
            boxhelper:null,
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
            this.camera.position.set(0,0,5);


            // this.controls.addEventListener('change',function(){this.renderer.render(this.scene,this.camera);});

            let geometry = new THREE.BoxGeometry(1,1,2);
            let material = new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:false});
            this.cube = new THREE.Mesh(geometry,material);
            this.scene.add(this.cube);

            let sphere = new THREE.SphereGeometry(1.5);
            let material1 = new THREE.MeshBasicMaterial();
            let object = new THREE.Mesh(sphere,material);
           
            this.boxhelper = new THREE.BoxHelper(object,0xff0000); //外面红色框
            this.scene.add(this.boxhelper);

            let box3 = new THREE.Box3();
            // box3.setFromCenterAndSize(new THREE.Vector3(0,0,0),new THREE.Vector3(2,2,2));
            let box3helper = new THREE.Box3Helper(box3,0x0000ff); //里面的蓝色框
            this.scene.add(box3helper);

            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            // this.controls.addEventListener('change', function () {
            //     this.renderer.render(this.scene, this.camera);
            // });
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.cube.rotation.x += 0.1;
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
        overflow: hidden;
    }
</style>