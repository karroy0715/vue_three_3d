<template>
    <div></div>
</template>

<script>
// import *  as THREE from 'three'
import $ from 'jquery'
import {OrbitControls} from './loaders/OrbitControls.js'

// import {Reflector} from './loaders/Reflector.js'
// import {Refractor,RefractorShader} from './loaders/Refractor.js'

import THREE from './loaders/Water2.js'
import {WEBGL} from './loaders/WebGL.js'

export default {
    name:'E03',
    data(){
        return{
            renderer:null,
            scene:null,
            camera:null,
            controls:null,
            water:null,
            clock:null,
            torusKnot:null,
            params:{color:'#ffffff',scale:4,flowX:1,flowY:1},

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf5f5f5);

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(-15,7,15);
            this.camera.lookAt(this.scene.position);
            this.camera.updateProjectionMatrix();

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);;
            document.body.appendChild(this.renderer.domElement);

            this.clock = new THREE.Clock();
            //object
            //环面打结几何体 
            // 构造函数 
            // TorusKnotGeometry(radius : Float, tube : Float, tubularSegments : Integer, radialSegments : Integer, p : Integer, q : Integer) 
            // p — 这个值决定了几何体绕旋转对称轴绕了多少圈. 默认值为2. 
            // q — 这个值决定了几何体绕环面的圆绕了多少圈. 默认值为3.
            let torusKnotGeometry = new THREE.TorusKnotBufferGeometry(3,1,256,32);
            let torusKnotMaterial = new THREE.MeshNormalMaterial();
            this.torusKnot = new THREE.Mesh(torusKnotGeometry,torusKnotMaterial);
            this.torusKnot.position.y = 4;
            this.torusKnot.scale.set(0.5,0.5,0.5);
            this.scene.add(this.torusKnot);

            //ground
            let groundGeometry = new THREE.PlaneBufferGeometry(40,40);
            let groundMaterial = new THREE.MeshStandardMaterial({roughness:0.8,metalness:0.4});
            let ground = new THREE.Mesh(groundGeometry,groundMaterial);
            ground.rotation.x = Math.PI * -0.5;
            this.scene.add(ground);

            //纹理
            let textureLoader = new THREE.TextureLoader();
            textureLoader.load('/static/texture/hardwood2_diffuse.jpg',function(map){
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 16; //各向异性
                map.repeat.set(4,4); //重复几次
                groundMaterial.map = map;
                groundMaterial.needsUpdate = true;
            });

            //water
            let waterGeometry = new THREE.PlaneBufferGeometry(20,20);
            this.water = new THREE.Water(waterGeometry,{
                color:this.params.color,
                scale:this.params.scale,
                flowDirection:new THREE.Vector2(this.params.flowX,this.params.flowY),
                textureWidth:1024,
                textureHeight:1024,
            });
            this.water.position.y = 1;
            this.water.rotation.x = Math.PI * -0.5;
            this.scene.add(this.water);

            //skybox
            let cubeTextureLoader = new THREE.CubeTextureLoader();
            cubeTextureLoader.setPath('/static/texture/skybox/');
            let cubeTexture = cubeTextureLoader.load(['px.jpg','nx.jpg','py.jpg','ny.jpg','pz.jpg','nz.jpg',]);
           
            let cubeShader = THREE.ShaderLib["cube"];
            cubeShader.uniforms["tCube"].value = cubeTexture;

            let skyBoxMaterial = new THREE.ShaderMaterial({
                fragmentShader:cubeShader.fragmentShader,
                vertexShader:cubeShader.vertexShader,
                uniforms:cubeShader.uniforms,
                side:THREE.BackSide
            });

            let skybox = new THREE.Mesh(new THREE.BoxBufferGeometry(1000,1000,1000), skyBoxMaterial);
            skyBoxMaterial.needsUpdate = true;
            this.scene.add(skybox);

            //light
            let ambientlight = new THREE.AmbientLight(0xcccccc,0.4);
            this.scene.add(ambientlight);

            let directionlight = new THREE.DirectionalLight(0xffffff,0.6);
            directionlight.position.set(-1,1,1);
            this.scene.add(directionlight);

            this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    
            window.addEventListener('resize',this.onResize,false);
        },
        onResize(){
            this.camera.aspect = window.innerWidth/window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth,window.innerHeight);
        },
        animate(){
            requestAnimationFrame(this.animate);
            let delta = this.clock.getDelta();
            this.torusKnot.rotation.x += delta;
            this.torusKnot.rotation.y += delta*0.5;
            this.renderer.render(this.scene,this.camera);
        }
    },
    mounted(){
        this.init();
        this.animate();
    },

}
</script>


<style>
/* 不可少 */
    body{
        margin: none;
        background-color: #000000;
        overflow: hidden;
    }
</style>