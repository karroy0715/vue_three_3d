<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls.js'
export default {
    name:'H09',
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
            this.camera.position.set(0,50,150);
            let target = new THREE.Vector3(0,0,0);
            this.camera.lookAt(target);  
            this.camera.updateProjectionMatrix();         
            
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);

            let geometry = new THREE.BoxGeometry(40,40,40);
            let material = new THREE.MeshPhongMaterial({
                color:0xcfffff,
                wireframe:false,
            });

            this.cube = new THREE.Mesh(geometry,material);
            this.scene.add(this.cube);

            let light = new THREE.PointLight(0xff0dd0,10,600);
            light.position.set(30,40,10);
            this.scene.add(light);

            let helper = new THREE.PointLightHelper(light,10);//10为点光对象的大小
            this.scene.add(helper);
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.cube.rotation.x += 0.01;
            this.renderer.render(this.scene,this.camera);
        },
    },
    mounted(){
        this.init();
        this.animate();
    }  
}
</script>

