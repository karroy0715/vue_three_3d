<template>
    <div></div>    
</template>

<script>
import * as THREE from 'three'
export default {
    name:'K04',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            light:null,
            line:null
        }
    },
    methods:{
        init(){
            let width,height;
            width = window.innerWidth;
            height = window.innerHeight;
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setSize(width, height);
            document.body.appendChild(this.renderer.domElement);
            this.renderer.setClearColor(0xffffff,1.0);
      
            this.camera = new THREE.PerspectiveCamera(70, width/height, 1, 1000);
            // this.camera.position.set(0,0,100);
                this.camera.position.x = 0;
                this.camera.position.y = 10;
                this.camera.position.z = 0;
                this.camera.up.x = 0;
                this.camera.up.y = 0;
                this.camera.up.z = 1;
                this.camera.lookAt({
                    x : 0,
                    y : 0,
                    z : 0
                });
            
      
            this.scene = new THREE.Scene();
      
            this.light = new THREE.DirectionalLight(0xff0000,1.0,0);
            this.light.position.set(100,100,200);
            this.scene.add(this.light);
     
            let geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(-500,0,0));
            geometry.vertices.push(new THREE.Vector3(500,0,0));

            for(var i=0; i<=20; i++){
                this.line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                    color:0x0000ff,opacity:0.2
                }));
                this.line.position.z =(i*50)-500;
                this.scene.add(this.line); 

                this.line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
                    color:0x0000ff,opacity:0.2
                }));

                this.line.position.x =(i*50)-500;
                this.line.rotation.y = 90*Math.PI/180; 
                this.scene.add(this.line);
            }
        },
        animate:function(){
            this.init();
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    },
    mounted(){
        this.animate();
    },
}
</script>
 <style>
   body{
        margin: none;
        background-color: #000000;
        overflow: hidden;
    }
</style>
