<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls.js'
import {all1} from './loaders/RectAreaLightUniformsLib.js'
export default {
    name:'H10',
    data(){
        return{
            renderer:null,
            scene:null,
            camera:null,
            controls:null,
            cube:null,
            rectlight:null,

        }
    },
    methods:{
        init(){
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.shadowMap.enable = true;
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

            let geometry = new THREE.BoxGeometry(30,30,30);
            let material = new THREE.MeshStandardMaterial({
                color:0xcfcfcf,
                wireframe:false,
                castShadow:true,
                receiveShadow:true,
                roughness:0, //粗糙度
                metalness:0, //金属感
            });
            this.cube = new THREE.Mesh(geometry,material);
            this.cube.position.x = 20;
            this.scene.add(this.cube);

            let material2 = new THREE.MeshStandardMaterial({
                color:0xa0cf00,roughness:0,metalness:0.6
            });
            let mesh = new THREE.Mesh(geometry,material2);
            mesh.position.set(-20,0,20);
            mesh.rotation.set(0,Math.PI/2.0,0);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add(mesh);

            let ambient = new THREE.AmbientLight(0xffffff,0.1);
            this.scene.add(ambient);

            this.rectlight = new THREE.RectAreaLight(0xffffff,1,100,100);
            this.rectlight.position.set(30,50,-30);
            this.scene.add(this.rectlight);

            //设置2个平面来显示区域光
            let rectlightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(),
                                    new THREE.MeshBasicMaterial({color:0x0000ff}));
            rectlightMesh.scale.x = this.rectlight.width;
            rectlightMesh.scale.y = this.rectlight.height;
            this.rectlight.add(rectlightMesh);

            let rectlightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(),
                                        new THREE.MeshBasicMaterial({color:0xff0000}));
            rectlightMeshBack.rotation.y = Math.PI;
            rectlightMesh.add(rectlightMeshBack);

            let radius = 100;
            let radials = 16;
            let circles = 8;
            let divisions = 64;
            let helper02 = new THREE.PolarGridHelper(radius, radials, circles, divisions);
            helper02.position.set(0, -20, 0);
            this.scene.add(helper02);
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            let target1 = new THREE.Vector3(0,0,0);
            let t = (Date.now() / 2000);
            let r = 25.0;
            let lx = r * Math.cos(t);
            this.rectlight.position.set(lx, this.rectlight.position.y, this.rectlight.position.z);
            this.rectlight.lookAt(target1);
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

