<template>
    <div></div>    
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls';
// import Orbitcontrols from 'three-orbitcontrols';
// require("three/examples/js/controls/OrbitControls");
export default {
    name:'H04',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            controls:null,
            light:null,
            helper:null,
            
        }
    },
    methods:{   
        init() {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xcfcfcf);
            this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 50, 100);
            let target = new THREE.Vector3(0,0,0);
            this.camera.lookAt(target);
            this.camera.updateProjectionMatrix(); 
 
  
            let light = new THREE.DirectionalLight(0xffffff);
            light.position.set(100,100,800);
            this.scene.add(light);
            
            let size = 120;
            let divisions = 20;
            let gridHelper = new THREE.GridHelper(size, divisions);
            gridHelper.position.set(0,-20,0)
            this.scene.add(gridHelper);

 
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
 
            
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.addEventListener('change', function () {
                this.renderer.render(this.scene, this.camera);
            });
 
           let material = new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('/static/texture/texture-atlas.jpg')
            });
            let geometry = new THREE.CubeGeometry( 10 , 10 , 10 );
            let bricks = [
                new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), 
                new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
            let clouds = [
                new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), 
                new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
            let crate = [
                new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), 
                new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
            let stone = [
                new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), 
                new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
            let water = [
                new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), 
                new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
            let wood = [
                new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), 
                new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

            //清除现有的UV映射
            geometry.faceVertexUvs[0] = [];

            geometry.faceVertexUvs[0][0] = [bricks[0], bricks[1], bricks[3]];
            geometry.faceVertexUvs[0][1] = [bricks[1], bricks[2], bricks[3]];

            geometry.faceVertexUvs[0][2] = [clouds[0], clouds[1], clouds[3]];
            geometry.faceVertexUvs[0][3] = [clouds[1], clouds[2], clouds[3]];

            geometry.faceVertexUvs[0][4] = [crate[0], crate[1], crate[3]];
            geometry.faceVertexUvs[0][5] = [crate[1], crate[2], crate[3]];

            geometry.faceVertexUvs[0][6] = [stone[0], stone[1], stone[3]];
            geometry.faceVertexUvs[0][7] = [stone[1], stone[2], stone[3]];

            geometry.faceVertexUvs[0][8] = [water[0], water[1], water[3]];
            geometry.faceVertexUvs[0][9] = [water[1], water[2], water[3]];

            geometry.faceVertexUvs[0][10] = [wood[0], wood[1], wood[3]];
            geometry.faceVertexUvs[0][11] = [wood[1], wood[2], wood[3]];            

            this.mesh = new THREE.Mesh(geometry,material);

           
            this.helper = new THREE.FaceNormalsHelper(this.mesh, 10, 0xff0000, 1);
            this.scene.add(this.mesh, this.helper);
        },
        animate() {
            requestAnimationFrame(this.animate);
            //this.controls.update(); 
            this.mesh.rotation.x += 0.01;
            if (this.helper)  this.helper.update(); 
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
