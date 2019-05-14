<template>
    <div></div>    
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls';

export default {
    name:'H02',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            geometry:null,
            material:null,
            controls:null,
            light:null,
            helper:null,
            
        }
    },
    methods:{   
        init() {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xcfcfcf);
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 50, 150);
            let target = new THREE.Vector3(0,0,0);
            this.camera.lookAt(target);
            this.camera.updateProjectionMatrix(); //相机更新
 
            // DirectionalLight( color, intensity )
            this.light = new THREE.DirectionalLight(0xFFFFFF, 2);
            this.light.position.set(20, 20, 50);
            
            // PolarGridHelper( radius：标网格的半径, radials：径向线的数量, circles：圆圈数, 
            // divisions：每个圆圈使用的线段数, color1：用于网格元素的第一种颜色, color2：用于网格元素的第一种颜色 )
            let radius = 100;
            let radials = 16;
            let circles = 8;
            let divisions = 64;
            let helper02 = new THREE.PolarGridHelper(radius, radials, circles, divisions);
            helper02.position.set(0, -20, 0);
            this.scene.add(helper02);
 
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
 
            //OrbitControls控件操作模块
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.addEventListener('change', function () {
                this.renderer.render(this.scene, this.camera);
            });
 
            // BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments )
            this.geometry = new THREE.BoxGeometry(30, 30, 30, 3, 3, 3);
            this. material = new THREE.MeshBasicMaterial({
                color: 0xff00ff,
                wireframe: false
            }); //wireframe默认为false
 
            this.mesh = new THREE.Mesh(this.geometry, this.material);
 
            // FaceNormalsHelper( object, size, hex, linewidth )
            this.helper = new THREE.FaceNormalsHelper(this.mesh, 10, 0x00ffcc, 1);
            this.scene.add(this.mesh, this.helper);
        },
        animate() {
            requestAnimationFrame(this.animate);
            //this.controls.update(); (与前面的绑定事件二选一)
            this.mesh.rotation.x += 0.01;
            if (this.helper)  this.helper.update(); //判断是否有法向助手，有则更新
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
        overflow: hidden;
    }
</style>
