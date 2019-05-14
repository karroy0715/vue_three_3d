<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
// import { ModelGltf } from 'vue-3d-model'
import {GLTFLoader} from './loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import {Stats} from './loaders/Stats.js'
import {OrbitControls} from './loaders/OrbitControls';

export default {
    name:'A2',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            geometry:null,
            cube:null,
            geometry1:null,
            cube1:null,
            stats:null,
            clock:null,
            actions:null,
            mixer:null,
            model:null,
            objmesh:null,
            step:0,
             camControls:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xcce0ff); 
            this.scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

            this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
            this.camera.position.set(1000, 50, 1500);
            // let target = new THREE.Vector3(0, 0, 0);
            // this.camera.lookAt(target);
            this.camera.updateProjectionMatrix(); //相机更新

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            //环境光和方向光混合以及加了阴影
            let light = new THREE.AmbientLight(0x666666);
            this.scene.add(light);

            let dirlight = new THREE.DirectionalLight(0xdfebff, 1);
            // dirlight.position.set(50, 200, 100);
            dirlight.position.set(100, 800, 1000);
            dirlight.position.multiplyScalar( 1.3 );
            dirlight.castShadow = true;
            dirlight.shadow.mapSize.width = 5120;
            dirlight.shadow.mapSize.height = 5120;
            dirlight.shadow.camera.top = 1000;
            dirlight.shadow.camera.bottom = -1000;
            dirlight.shadow.camera.left = -1000;
            dirlight.shadow.camera.right = 1000;
            dirlight.shadow.camera.near = 0.1;
            dirlight.shadow.camera.far = 20000;
            this.scene.add(dirlight);

            let helper = new THREE.DirectionalLightHelper(dirlight,50,0x0000ff);
            this.scene.add(helper);

            let axes = new THREE.AxisHelper(200);
            this.scene.add(axes);

            // //skybox
            // let cubeTextureLoader = new THREE.CubeTextureLoader();
            // cubeTextureLoader.setPath('/static/texture/Park2/');
            // let cubeTexture = cubeTextureLoader.load(['posx.jpg','negx.jpg','posy.jpg','negy.jpg','posz.jpg','negz.jpg',]);
           
            // let cubeShader = THREE.ShaderLib["cube"];
            // cubeShader.uniforms["tCube"].value = cubeTexture;

            // let skyBoxMaterial = new THREE.ShaderMaterial({
            //     fragmentShader:cubeShader.fragmentShader,
            //     vertexShader:cubeShader.vertexShader,
            //     uniforms:cubeShader.uniforms,
            //     side:THREE.BackSide
            // });

            // let skybox = new THREE.Mesh(new THREE.BoxBufferGeometry(1000,1000,1000), skyBoxMaterial);
            // skyBoxMaterial.needsUpdate = true;
            // skybox.position.y = 0;
            // this.scene.add(skybox);
            
           //绿色的平面
            let loader = new THREE.TextureLoader();
            let groundTexture = loader.load( '/static/texture/grasslight-big.jpg' );
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set( 25, 25 );
            groundTexture.anisotropy = 16;
            let groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
            let mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
            mesh.position.y = - 250;
            mesh.rotation.x = - Math.PI / 2;
            mesh.receiveShadow = true;
            this.scene.add( mesh );
          
           //右边盒子
            this.geometry = new THREE.BoxGeometry(160,160,80);
            let material1 = new THREE.MeshLambertMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/5.jpg') } );
            let material2 = new THREE.MeshLambertMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/5.jpg') } );
            let material3 = new THREE.MeshLambertMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/4.jpg') } );
            let material4 = new THREE.MeshLambertMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/2.jpg') } );
            let material5 = new THREE.MeshLambertMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/1.jpg') } );
            let material6 = new THREE.MeshLambertMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/3.jpg') } );            
            let materials = [material1, material2, material3, material4, material5, material6];            
            let meshFaceMaterial = new THREE.MeshFaceMaterial( materials ); 
            this.cube = new THREE.Mesh(this.geometry, meshFaceMaterial);
            this.cube.position.set(500,-180,10);
            this.cube.rotation.y = -Math.PI/3;
            this.cube.castShadow = true;
            this.cube.receiveShadow = true;
            this.scene.add(this.cube);

            // //  左边平躺盒子
            this.geometry1 = new THREE.BoxGeometry(100, 100, 50); 
            this.cube1 = new THREE.Mesh(this.geometry1, meshFaceMaterial);
            this.cube1.position.set(450,-200,100);
            this.cube1.rotation.x = -Math.PI/10;
            this.cube.rotation.y = -1 + Math.PI/2.5;
            this.cube1.castShadow = true;
            this.cube1.receiveShadow = true;
            this.scene.add(this.cube1);

            // //足球
            let sphereGeometry = new THREE.SphereGeometry(40);
            let sphereMaterial = new THREE.MeshLambertMaterial(
                {map: THREE.ImageUtils.loadTexture('/static/texture/football.jpg')});
            this.sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
            this.sphere.castShadow = true;
            this.sphere.position.set(0,-205,150);
            this.scene.add(this.sphere);

            //OrbitControls控件操作模块
            let controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.maxPolarAngle = Math.PI * 0.5;
            controls.minDistance = 1000;
            controls.maxDistance = 5000;

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);
           
        },
        loadModel(){
            let self = this; //这一点很重要。。
             
            let loader = new GLTFLoader();
            loader.load('/static/models/gltf/Squirrel1.glb',function (gltf){
                const sence = gltf.scene;
                
                sence.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });
                sence.rotation.z = -Math.PI; 
                sence.rotation.y = -1 + Math.PI/2; 
                sence.scale.set(40, 40, 40);
                sence.position.set(0,0,0);
                self.scene.add(sence);
            });

            let loader1 = new GLTFLoader();
            loader1.load('/static/models/gltf/tree2.glb',function (gltf){
                const sence = gltf.scene;
                
                sence.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });              
                sence.scale.set(600, 600, 600);
                sence.position.set(-2500,400,-250);
                sence.rotation.x = -Math.PI/2;    
                self.scene.add(sence);          
            }); 
            
            var loader2 = new GLTFLoader();
            loader2.load( './static/models/gltf/Flamingo.glb', function( gltf ) { 
                let birdmesh = gltf.scene.children[ 0 ];
                var s = 2;
                birdmesh.scale.set( s, s, s );
                birdmesh.rotation.y = -1;
                birdmesh.castShadow = true;
                birdmesh.receiveShadow = true;
                birdmesh.position.set(300,500,-4000);
                self.scene.add( birdmesh );
            } );  
            var loader3 = new GLTFLoader();
            loader3.load( './static/models/gltf/Flamingo.glb', function( gltf ) { 
                let birdmesh = gltf.scene.children[ 0 ];
                var s = 2;
                birdmesh.scale.set( s, s, s );
                birdmesh.rotation.y = -1;
                birdmesh.castShadow = true;
                birdmesh.receiveShadow = true;
                birdmesh.position.set(100,550,-4000);
                self.scene.add( birdmesh );
            } ); 
        },

        animate() {
            requestAnimationFrame(this.animate);
            if (this.controls) this.controls.update();

            // this.step += 0.04; //弹跳速度
            // this.sphere.position.x = 20 +(10*(Math.cos(this.step)));
            // this.sphere.position.y = 2 + (10*(Math.abs(Math.sin(this.step))));

            this.renderer.render(this.scene, this.camera);
            this.stats.update();     
        }
    },
    mounted(){
        this.init();
        this.loadModel();
        this.animate();
      
    }
}
</script>
<style>
    body{
        margin: 0;
        overflow:hidden;
    }
</style>