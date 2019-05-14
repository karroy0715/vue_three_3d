<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {Stats} from './loaders/stats.js'
import {OrbitControls} from './loaders/OrbitControls'
import {AsciiEffect} from './loaders/AsciiEffect'
export default {
    name:"book02",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
            sphere:null,
            step:0,
            stats:null,
            effect:null,
            controls:null           

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf5f5f5);

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(-30,40,30);
            this.camera.lookAt(this.scene.position);

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            // this.renderer.setClearColor(new THREE.Color(0x0000ff));
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true; //添加阴影
            // document.body.appendChild(this.renderer.domElement);

            // document.getElementById("WebGL-output").appendChild(this.renderer.domElement);
            // let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);
            
            this.effect = new AsciiEffect(this.renderer);
            this.effect.setSize(window.innerWidth,window.innerHeight);
            document.getElementById("WebGL-output").appendChild(this.effect.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.effect.domElement);

            let axes = new THREE.AxisHelper(20);
            this.scene.add(axes);

            let planeGeometery = new THREE.PlaneGeometry(60,20,1,1);
            let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
            let plane = new THREE.Mesh(planeGeometery,planeMaterial);
            plane.receiveShadow = true;
            plane.position.set(15,0,0);
            plane.rotation.x = -0.5*Math.PI;
            this.scene.add(plane);

            let cubeGeometry = new THREE.CubeGeometry(4,4,4);
            let cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
            this.cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
            this.cube.castShadow = true;
            this.cube.position.set(-4,3,0);
            this.scene.add(this.cube);

            let sphereGeometry = new THREE.SphereGeometry(4,20,20);
            let sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
            this.sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
            this.sphere.castShadow = true;
            this.sphere.position.set(20,4,2);
            this.scene.add(this.sphere);

            let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40,60,-10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            this.controls = new function(){
                this.rotationSpeed = 0.02;
                this.bouncingSpeed = 0.03;
            }
            let gui = new dat.GUI(); //控制器
            gui.add(this.controls,'rotationSpeed',0,0.5);
            gui.add(this.controls,"bouncingSpeed",0,0.5);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);

        },
        animate(){
            
            // this.cube.rotation.x += 0.02;
            // this.cube.rotation.y += 0.02;
            // this.cube.rotation.z += 0.02;

            // this.step += 0.04; //弹跳速度
            // this.sphere.position.x = 20 +(10*(Math.cos(this.step)));
            // this.sphere.position.y = 2 + (10*(Math.abs(Math.sin(this.step))));

            this.cube.rotation.x += this.controls.rotationSpeed;
            this.cube.rotation.y += this.controls.rotationSpeed;
            this.cube.rotation.z += this.controls.rotationSpeed;

            // this.step += 0.04; //弹跳速度
            this.step += this.controls.bouncingSpeed;
            this.sphere.position.x = 20 +(10*(Math.cos(this.step)));
            this.sphere.position.y = 2 + (10*(Math.abs(Math.sin(this.step))));

            requestAnimationFrame(this.animate);
            // this.renderer.render(this.scene,this.camera);
            this.effect.render(this.scene,this.camera);

            this.stats.update();       
        },
    },
    mounted(){
        this.init();
        this.animate();
       
    }
}
</script>

<style>
    body{
        margin: 0;
        overflow:hidden;
    }
</style>

