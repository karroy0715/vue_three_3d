<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import {GLTFLoader} from './loaders/GLTFLoader.js'
import * as dat from 'dat.gui'
import {Stats} from './loaders/Stats.js'
import {OrbitControls} from './loaders/OrbitControls';

export default {
    name:'A1',
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
            this.scene.background = new THREE.Color(0xf5f5f5);   

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 100, 150);
            let target = new THREE.Vector3(0, 0, 0);
            this.camera.lookAt(target);
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
            let light = new THREE.AmbientLight(0xffffff, 0.1);
            this.scene.add(light);

            let dirlight = new THREE.DirectionalLight(0xffffff);
            dirlight.position.set(-50, 120, 100);
            dirlight.castShadow = true;
            dirlight.shadow.camera.top = 100;
            dirlight.shadow.camera.bottom = -100;
            dirlight.shadow.camera.left = -100;
            dirlight.shadow.camera.right = 100;
            dirlight.shadow.camera.near = 0.1;
            dirlight.shadow.camera.far = 500;
            this.scene.add(dirlight);

            let axes = new THREE.AxisHelper(20);
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
            let meshGeometry = new THREE.PlaneBufferGeometry(500, 500);
            let meshMaterial = new THREE.MeshPhongMaterial(
                {map: THREE.ImageUtils.loadTexture('/static/texture/grasslight-big.jpg')});
            let mesh = new THREE.Mesh(meshGeometry,meshMaterial);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(0, -40, 0);
            mesh.receiveShadow = true;
            this.scene.add(mesh);
          
           //右边盒子
            this.geometry = new THREE.BoxGeometry(80,80,40);
            let material1 = new THREE.MeshPhongMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/5.jpg') } );
            let material2 = new THREE.MeshPhongMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/5.jpg') } );
            let material3 = new THREE.MeshPhongMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/4.jpg') } );
            let material4 = new THREE.MeshPhongMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/2.jpg') } );
            let material5 = new THREE.MeshPhongMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/1.jpg') } );
            let material6 = new THREE.MeshPhongMaterial( { 
            map: THREE.ImageUtils.loadTexture('/static/texture/squirrelbox/3.jpg') } );            
            let materials = [material1, material2, material3, material4, material5, material6];            
            let meshFaceMaterial = new THREE.MeshFaceMaterial( materials ); 
            this.cube = new THREE.Mesh(this.geometry, meshFaceMaterial);
            this.cube.position.set(100,0,100);
            this.cube.castShadow = true;
            this.cube.receiveShadow = true;
            this.scene.add(this.cube);

            //  左边平躺盒子
            this.geometry1 = new THREE.BoxGeometry(50, 50, 25); 
            this.cube1 = new THREE.Mesh(this.geometry1, meshFaceMaterial);
            this.cube1.position.set(-140,-15,150);
            this.cube1.rotation.x = -Math.PI/7.5;
            this.cube1.castShadow = true;
            this.cube1.receiveShadow = true;
            this.scene.add(this.cube1);

            //足球
            let sphereGeometry = new THREE.SphereGeometry(20);
            let sphereMaterial = new THREE.MeshPhongMaterial(
                {map: THREE.ImageUtils.loadTexture('/static/texture/football.jpg')});
            this.sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
            this.sphere.castShadow = true;
            this.sphere.position.set(0,-20,150);
            this.scene.add(this.sphere);

            //OrbitControls控件操作模块
            let controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.autoRotate = true; //将自动旋转打开

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
                self.model = gltf.scene;
                self.scene.add(self.model);
                self.model.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });
                self.model.rotation.z = -Math.PI;  
                self.model.scale.set(20, 20, 20);
                self.model.position.set(-100,0,100);
            });

            let loader1 = new GLTFLoader();
            loader1.load('/static/models/gltf/tree2.glb',function (gltf){
                self.model = gltf.scene;
                self.scene.add(self.model);
                self.model.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });
               
                self.model.scale.set(200, 200, 200);
                self.model.position.set(-250,200,250);
                self.model.rotation.x = -Math.PI/2;
               
            });        
        },

        animate() {
            requestAnimationFrame(this.animate);
            if (this.controls) this.controls.update();
            this.cube.rotation.y += 0.01;

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