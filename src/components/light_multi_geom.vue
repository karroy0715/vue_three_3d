<!--多个物体情况下，环境光 方向光 点光源实例以及混合光照射实例-->
<template>
    <div ></div>
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K11',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            mesh2:null,
            mesh3:null,
            mesh4:null,
            mesh5:null,
            mesh6:null,

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
            this.camera.position.set(50,100,800);

            this.scene = new THREE.Scene();
            //单个光照射时demo
            //let light = new THREE.DirectionalLight(0xff0000,0.9);
            //let light = new THREE.PointLight(0xff0000);
            //let light = new THREE.HemisphereLight(0xff0000);
            //let light = new THREE.AmbientLight(0xff0000);
            //位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
            //ight.position.set(0,0,0);
            //this.scene.add(light);
            
            //混合光demo
            let light;
            light = new THREE.AmbientLight(0x00ff00);
            light.position.set(100,100,200);
            this.scene.add(light); 

            light = new THREE.DirectionalLight(0xff0000,0.9);
            light.position.set(0,0,1);
            this.scene.add(light);

            // light = new THREE.PointLight(0x0000ff);
            // light.position.set(0,0,50);
            // this.scene.add(light);

                
            

            let geometry = new THREE.CubeGeometry(200, 100, 50,4,4);
            let material = new THREE.MeshLambertMaterial({color:0xFFFFFF});
            this.mesh = new THREE.Mesh(geometry,material);
            this.mesh.position = new THREE.Vector3(0,0,0);
            this.scene.add(this.mesh);
            //最左边的图
            let geometry2 = new THREE.CubeGeometry(200, 100, 50,4,4);
            let material2 = new THREE.MeshLambertMaterial({color:0xFFFFFF});
            this.mesh2 = new THREE.Mesh(geometry2,material2);
            this.mesh2.position = new THREE.Vector3(-300,0,0);
            this.scene.add(this.mesh2);

            this.mesh5 = new THREE.Mesh(geometry,material);
            this.mesh5.position = new THREE.Vector3(300,0,0);
            this.scene.add(this.mesh5);

            let geometry3 = new THREE.CubeGeometry(200, 100, 50,4,4);
            let material3 = new THREE.MeshLambertMaterial({color:0xFFFFFF});
            this.mesh3 = new THREE.Mesh(geometry3,material3);
            this.mesh3.position = new THREE.Vector3(0,-150,0);
            this.scene.add(this.mesh3);
            //最上面的图
            this.mesh4 = new THREE.Mesh(geometry3,material3);
            this.mesh4.position = new THREE.Vector3(0,150,0);
            this.scene.add(this.mesh4);

            this.mesh6 = new THREE.Mesh(geometry3,material3);
            this.mesh6.position = new THREE.Vector3(0,0,100);
            this.scene.add(this.mesh6);
        },
        animate:function(){
            this.init();
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    },
    mounted(){
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
