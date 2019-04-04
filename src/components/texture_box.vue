<template>
    <div ></div>
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K12',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null
        }
    },
    methods:{
        init:function(){
            let width = window.innerWidth;
            let height = window.innerHeight;

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width,height);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0xf5f5f5,1);

            this.camera = new THREE.PerspectiveCamera(45,width/height,1,1000);
            this.scene = new THREE.Scene();
        
            let light = new THREE.DirectionalLight(0xffffff);
            light.position.set(100,100,800);
            this.scene.add(light);

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
            this.mesh.position.z = -50;
            this.scene.add(this.mesh);

            window.addEventListener('resize',this.onWindowResize,false);
            this.render();
        },
        render(){
            this.renderer.render(this.scene, this.camera);
        },
        onWindowResize(){
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.render();
        },
        animate:function(){
            this.mesh.rotation.x += 0.04;
            this.mesh.rotation.y += 0.02;
            this.render();
            requestAnimationFrame(this.animate);
            
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
        background-color: #000000;
        overflow: hidden;
    }
</style>
