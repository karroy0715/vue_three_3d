<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'

import {RollerCoasterGeometry,RollerCoasterLiftersGeometry,RollerCoasterShadowGeometry,TreesGeometry} from './loaders/RollerCoaster.js'
export default {
    name:'E04',
    data(){
        return{
            renderer:null,
            camera:null,
            scene:null,
            light:null,
            mesh:null, 
            train:null, 
        }
    },
    methods:{
        init(){
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.vr.enabled = true;

            document.body.appendChild(this.renderer.domElement);

            document.body.appendChild(WEBVR.createButton(this.renderer,{frameOfReferenceType:'eye-level'}) );
            //
            this.scene = new THREE.Scene();
            this.scene = new THREE.Color(0xf0f0ff);

            this.train = new THREE.Object3D();
            this.scene.add(this.train);

            this.camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.1,500);
            this.trai.add(this.camera);

            this.light = new THREE.HemisphereLight(0xfff0f0,0x606066);
            this.light.position.set(1,1,1);
            this.scene.add(this.light);
            //
            let geometry = new THREE.PlaneBufferGeometry(500,500,15,15);
            geometry.rotateX(-Math.PI/2);

            let positions = geometry.attributes.position.array; //获取点数组
            let vertex = new THREE.Vector3();

            for(let i=0; i < positions.length; i+=3){
                vertex.fromArray(positions,i);
                vertex.x += Math.random()*10 - 5;
                vertex.z += Math.random()*10 - 5;

                let distance = (vertex.distanceTo(this.scene.position)/5 )- 25;
                vertex.y = Math.random() * Math.max(0,distance);

                vertex.toArray(positions,i);
            }
            geometry.computeVertexNormals();

            let material = new THREE.MeshLambertMaterial({color:0x407000});

            this.mesh = new THREE.Mesh(geometry,material);
            this.scene.add(this.mesh);

            let geometry2 = new TreesGeometry(this.mesh);
            let material2 = new THREE.MeshBasicMaterial({side:THREE.DoubleSide,vertexColors:THREE.VertexColors});
            this.mesh2 = new Mesh(geometry2,material2);
            this.scene.add(this.mesh2);
            
            let geometry3 = new SkyGeometry();
            let material3 = new THREE.MeshBasicMaterial({color:0xffffff});
            this.mesh3 = new THREE.Mesh(geometry3,material3);
            this.scene.add(this.mesh3);
            //

            let PI2 = Math.PI * 2;
            let curve = (function(){
                let vector = new THREE.Vector3();
                let vector2 = new THREE.Vector3();

                return{
                    getPointAt:function(t){
                        t = t*PI2;

                        let x = Math.sin(t*3) * Math.cos(t*4) * 50;
                        let y = Math.sin(t*10) * 2 + Math.cos(t*17)*2 + 5;
                        let z = Math.sin(t) * Math.sin(t*4) *50;

                        return vector.set(x,y,z).multiplyScalar(2);
                    },
                    
                    getTangentAt:function(t){
                        let delta = 0.0001;
                        let t1 = Math.max(0,t-delta);
                        let t2 = Math.min(1,t+delta);

                        return vector2.copy(this.getPointAt(t2)).sub(this.getPointAt(t1)).normalize;
                    }
                };
            } )();

            let geometry4 = new RollerCoasterGeometry(curve,1500);
            let material4 = new THREE.MeshPhongMaterial({vertexColors:THREE.VertexColors});
            this.mesh4 = new THREE.Mesh(geometry4,material4);
            this.scene.add(this.mesh4);

            let geometry5 = new RollerCoasterLiftersGeometry(curve,100);
            let material5 = new THREE.MeshPhongMaterial();
            this.mesh5 = new THREE.Mesh(geometry5,material5);
            this.mesh5.position.y = 0.1;
            this.scene.add(this.mesh5);

            let geometry6 = new RollerCoasterShadowGeometry(curve,500);
            let material6 = new THREE.MeshBasicMaterial({color:0x305000,depthWrite:false,transparent:true});
            this.mesh6 = new THREE.Mesh(geometry6,material6);
            this.mesh6.position.y = 0.1;
            this.scene.add(this.mesh6);

            let funfairs = [];
            //
            let geometry7 = new THREE.CylinderBufferGeometry(10,10,5,15);
            let material7 = new THREE.MeshLambertMaterial({color:0xff8080});
            this.mesh7 = new THREE.Mesh(geometry7,material7);
            this.scene.add(this.mesh7);
            funfairs.push(mesh7);

            let geometry8 = new THREE.CylinderBufferGeometry(5,6,4,10);
            let material8 = new THREE.MeshLambertMaterial({color:0x8080ff});
            this.mesh8 = new THREE.Mesh(geometry8,material8);
            this.mesh8.position.set(50,2,30);
            this.scene.add(mesh8);
            funfairs.push(mesh8);

            window.addEventListener('resize',onWindowResize,false); 
            this.onWindowResize();
            //
            let position = new THREE.Vector3();
            let tangent = new THREE.Vector3();
            let lookAt = new THREE.Vector3();

            let velocity = 0;
            let progress = 0;

            let prevTime = performance.now();

            function render(){
                let time = performance.now();
                let delta = time - prevTime;
                for(let i=0; i<funfairs.length; i++){
                    funfairs[i].rotation.y = time * 0.0004;        
                }
            }
            //

            progress += velocity;
            progress = progress%1;
            position.copy(curver.getpointAt(progress));
            positon.y += 0.3;

            train.position.copy(position);
            tangent.copy(vurver.getTangentAt(progress));

            velocity -= tangent.y*0.0000001 * delta;
            velocity = Math.max(0.00004,Math.min(0.0002,velocity));

            train.lookAt(lookAt.copy(position).sub(tangent));

            this.renderer.render(this.scene,this.camera);

            prevTime =time;
        },
        onWindowResize(){
            this.camera.aspect = window.innerWidth/window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth/window.innerHeight);
        },
    },
    mounted(){
        this.init();
        this.renderer.setAnimationLoop(this.render);
    }
}
</script>

<style>
    body {
        margin: 0px;
        color: #fff;
        font-family: Monospace;
        background-color: #444;
        overflow: hidden;
    }
</style>