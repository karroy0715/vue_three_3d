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
export default {
    name:"book10",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
            sphere:null,
            step:0,
            stats:null, 
            sphereLightMesh:null,  
            pointLight:null,    
            invert:1,
            phase:0       
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

            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true; //添加阴影

            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);
            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

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

            // let spotLight = new THREE.SpotLight(0xffffff);
            // spotLight.position.set(-40,60,-10);
            // spotLight.castShadow = true;
            // this.scene.add(spotLight);

            let ambiColor = "#0c0c0c"
            let ambientLight = new THREE.AmbientLight(ambiColor);
            this.scene.add(ambientLight);

            let pointColor = "#ccffcc";
            this.pointLight = new THREE.PointLight(pointColor);
            this.pointLight.distance = 100;
            this.scene.add(this.pointLight);

            // add a small sphere simulating the pointlight
            let sphereLight = new THREE.SphereGeometry(0.2);
            let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
            this.sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
            this.sphereLightMesh.castShadow = true;
            this.sphereLightMesh.position = new THREE.Vector3(3, 0, 3);
            this.scene.add(this.sphereLightMesh);

            this.controls = new function(){
                this.rotationSpeed = 0.02;
                this.bouncingSpeed = 0.03;
                this.ambientColor = ambiColor;
                this.pointColor = pointColor;
                this.intensity = 1;
                this.distance = 100;
            };

            let self = this;
            let gui = new dat.GUI(); //控制器
            gui.addColor(this.controls,'ambientColor').onChange(function(e){
                ambientLight.color = new THREE.Color(e);
            });
            gui.addColor(this.controls,'pointColor').onChange(function(e){
                self.pointLight.color = new THREE.Color(e);
            });
            gui.add(this.controls, 'intensity', 0, 3).onChange(function (e) {
                self.pointLight.intensity = e;
            });
            gui.add(this.controls, 'distance', 0, 100).onChange(function (e) {
                self.pointLight.distance = e;
            });

            gui.add(this.controls,'rotationSpeed',0,0.5);
            gui.add(this.controls,"bouncingSpeed",0,0.5);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);

        },
        animate(){

            this.cube.rotation.x += this.controls.rotationSpeed;
            this.cube.rotation.y += this.controls.rotationSpeed;
            this.cube.rotation.z += this.controls.rotationSpeed;

            this.step += this.controls.bouncingSpeed;
            this.sphere.position.x = 20 +(10*(Math.cos(this.step)));
            this.sphere.position.y = 2 + (10*(Math.abs(Math.sin(this.step))));

            // move the light simulation

            if (this.phase > 2 * Math.PI) {
                this.invert = this.invert * -1;
                this.phase -= 2 * Math.PI;
            } else {
                this.phase += this.controls.rotationSpeed;
            }
            this.sphereLightMesh.position.z = +(7 * (Math.sin(this.phase)));
            this.sphereLightMesh.position.x = +(14 * (Math.cos(this.phase)));
            this.sphereLightMesh.position.y = 5;

            if (this.invert < 0) {
                let pivot = 14;
                this.sphereLightMesh.position.x = (this.invert * (this.sphereLightMesh.position.x - pivot)) + pivot;
            }

            this.pointLight.position.copy(this.sphereLightMesh.position)

            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera);

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

