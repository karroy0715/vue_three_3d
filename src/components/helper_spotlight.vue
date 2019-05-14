<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls.js'
import {GLTFLoader} from './loaders/GLTFLoader.js'
export default {
    name:'H11',
    data(){
        return{
            renderer:null,
            scene:null,
            camera:null,
            controls:null,
            mesh:null,
        }
    },
    methods:{
        init(){
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            document.body.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xcfcfcf);

            this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(0,50,150);
            let target = new THREE.Vector3(0,0,0);
            this.camera.lookAt(target);  
            this.camera.updateProjectionMatrix();         
            
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.5;

            //最下面的平面
            let mesh1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(200,200),
                            new THREE.MeshPhongMaterial({color:0x9cfc99}));
            mesh1.rotation.x = -Math.PI/2; //这句话很有趣。只运行一次
            mesh1.position.set(0,-20,0);
            mesh1.receiveShadow = true;
            this.scene.add(mesh1);
            
            //蓝色立方体
            let geometry = new THREE.BoxGeometry(80,5,80);
            let material = new THREE.MeshStandardMaterial({
                color:0x0000ff,
                roughness:0,
                metalness:0.6,
            });
            this.mesh = new THREE.Mesh(geometry,material);
            this.mesh.position.set(0,0,20);
            // this.mesh.rotation.set(0,Math.PI / 2.0,0); 
            this.mesh.rotation.y = Math.PI/2.0;
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.scene.add(this.mesh);   

            let PolarGridHelper = new THREE.PolarGridHelper(100, 16, 8, 64,0x00ff00,0x0000ff);
            PolarGridHelper.position.set(0, -20, 0)
            this.scene.add(PolarGridHelper) ;
            
            let ambient = new THREE.AmbientLight(0xffffff,0.1);
            this.scene.add(ambient);

            let spotlight = new THREE.SpotLight(0xffffff,1);
            spotlight.position.set(15,110,50);
            spotlight.angle = Math.PI/4;
            spotlight.penumbra = 0.05;//边缘范围，反比
            spotlight.decay = 2;  //衰减系数，反比
            spotlight.distance = 400; //发光距离
            spotlight.castShadow = true; //阴影
            spotlight.shadow.mapSize.width = 1024; 
            spotlight.shadow.mapSize.height = 1024;
            spotlight.shadow.camera.near = 10; //近截面
            spotlight.shadow.camera.far = 250;
            this.scene.add(spotlight);

            let lighthelper = new THREE.SpotLightHelper(spotlight,0xdfdfdf);
            this.scene.add(lighthelper);

            let camerahelper = new THREE.CameraHelper(spotlight.shadow.camera);
            this.scene.add(camerahelper);
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.mesh.rotation.y += 0.01;
            this.renderer.render(this.scene,this.camera);
        },
    },
    mounted(){
        this.init();
        this.animate();
    }  
}
</script>

