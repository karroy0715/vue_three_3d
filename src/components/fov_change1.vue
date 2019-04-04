<template>
    <div>
        Fov:<input type = "text" value = "45" id = "txtFov"> (0到180的值)
    </div>
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K08',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            light:null
        }
    },
    methods:{
        init:function(){
            let width,height;
            width = window.innerWidth;
            height = window.innerHeight;

            this.camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
            this.camera.position.set(0,0,600);

            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width, height);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0x000000,1.0);

            this.light = new THREE.AmbientLight(0xffffff);
            this.light.position.set(100,100,200);
            this.scene.add(this.light);

            // this.light = new THREE.PointLight(0xffffff);
            // this.light.position.set(0,0,300);
            // this.scene.add(this.light);           
           
            let geometry = new THREE.CylinderGeometry(50,50,70);
            let material = new THREE.MeshLambertMaterial({color:0xffff00});
            this.mesh = new THREE.Mesh(geometry,material);
            this.mesh.position = new THREE.Vector3(0,0,0);
            this.scene.add(this.mesh);
        },
        animate:function(){ 
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera);
            this.changeFov();
        },
        changeFov(){
            let txtFov = document.getElementById("txtFov").value;
            let val = parseFloat(txtFov);
            this.setCameraFov(val);
        },
        setCameraFov(fov){
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();
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
        background-color: #ffffff;
        overflow: hidden;
    }
</style>
