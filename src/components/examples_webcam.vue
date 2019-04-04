<template>
    <div>
        <div id="info">
            <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - webgl video webcam input
        </div>
        <video id="video" autoplay style="display:none"></video>
    </div>
</template>

<script>
import * as THREE from "three"
import{ OrbitControls } from './loaders/OrbitControls.js'
import{ WEBGL } from './loaders/WebGL.js'
import * as dat from 'dat.gui';

export default {
    name:"E01",
    data(){
        return{
            renderer:null,
            camera:null,
            scene:null,
            video:null,
        }
    },
    methods:{
        init(){
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight,0.1,100);
            this.camera.position.z = 0.01;
            this.scene = new THREE.Scene();
            this.video = document.getElementById('video');

            let texture = new THREE.VideoTexture(this.video);

            let geometry = new THREE.PlaneBufferGeometry(16,9);
            geometry.scale(0.5,0.5,0.5);
            let material = new THREE.MeshBasicMaterial({map:texture});

            let count = 128;
            let radius = 32;
            //球坐标系。？？？？？？？数学公式如何计算得到的，
            for(let i = 1,l=count; i<=l; i++){
                let phi = Math.acos(-1 + (2*i) /l);
                let theta = Math.sqrt(1*Math.PI) * phi*10;
                let mesh = new THREE.Mesh(geometry,material);
                mesh.position.setFromSphericalCoords(radius,phi,theta);
                mesh.lookAt(this.camera.position);
                this.scene.add(mesh);
            }
            this.renderer = new THREE.WebGLRenderer({antialias:true});
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            document.body.appendChild(this.renderer.domElement);

            let controls = new OrbitControls(this.camera,this.renderer.document);
            controls.enableZoom = false;
            controls.enablePan = false;

            // window.addEventListener('resize',this.onWindowResize,false);

            let self = this;
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                let constraints = {video:{width:1280,height:720,facingMode:'user'}};
                navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
                // apply the stream to the video element used in the texture
                self.video.srcObject = stream;
                self
                }).catch(function(error){
                    console.error('unable to access the webcam.',error);
                });
            }else{
                console.error('MediaDevices interface not available.');
            }
        },
        // onWindowResize(){
        //     this.camera.aspect = window.innerWidth/window.innerHeight;
        //     this.camera.updateProjectionMatrix();
        //     this.renderer.setSize(window.innerWidth,window.innerHeight);
        // },
        createUI(){
            let FizzyText = function(){
                this.fov = 45;
            };
            this.text = new FizzyText();
            let gui = new dat.GUI();
            gui.add(this.text,"fov",0,180).name("视角大小");
        },   
        animate(){
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera);
            this.changeFov();
        },
        changeFov(){
            this.setCameraFov(this.text.fov);
        },
        setCameraFov(fov){
            this.camera.fov = fov;
            this.camera.updateProjectionMatrix();     
        }
    },
    mounted(){
        if ( WEBGL.isWebGLAvailable() === false ) {
				document.body.appendChild( WEBGL.getWebGLErrorMessage() );
        }
        this.init();
        this.createUI();
        // this.onWindowResize();
        this.animate();
    }
}
</script>

<style>
    body {
        background-color: #000;
        color: #fff;
        margin: 0px;
        overflow: hidden;
        font-family:Monospace;
        font-size:13px;
        text-align:center;
        font-weight: bold;
        text-align:center;
    }
    a {
        color:#0078ff;
    }
    #info {
        color:#fff;
        position: absolute;
        top: 5px;
        width: 100%;
        z-index:100;
    }
</style>

