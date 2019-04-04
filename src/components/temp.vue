<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
// import { ModelGltf } from 'vue-3d-model'
import {GLTFLoader} from './loaders/GLTFLoader.js'
import {Orbitcontrols} from 'three-orbitcontrols';
import {SkeletonHelper} from './loaders/RectAreaLightUniformsLib.js'

export default {
    name:'H04',
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,
            mesh:null,
            geometry:null,
            helper:null,
            clock:null,
            actions:null,
            mixer:null

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf5f5f5);

            this.clock = new THREE.Clock();

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 100, 150);
            let target = new THREE.Vector3(0, 0, 0);
            this.camera.lookAt(target);
            this.camera.updateProjectionMatrix(); //相机更新
            //环境光和方向光混合以及加了阴影
            let light = new THREE.AmbientLight(0xffffff, 0.1);
            this.scene.add(light);

            let dirlight = new THREE.DirectionalLight(0xffffff);
            dirlight.position.set(-30, 120, -100);
            dirlight.castShadow = true;
            dirlight.shadow.camera.top = 100;
            dirlight.shadow.camera.bottom = -100;
            dirlight.shadow.camera.left = -100;
            dirlight.shadow.camera.right = 100;
            dirlight.shadow.camera.near = 0.1;
            dirlight.shadow.camera.far = 500;
            this.scene.add(dirlight);

           
            let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(200, 200), new THREE.MeshPhongMaterial({
                color: 0x9cfcf99,
                depthWrite: false
            }));
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(0, -20, 0)
            mesh.receiveShadow = true;
            this.scene.add(mesh);

  // PolarGridHelper( radius：标网格的半径, radials：径向线的数量, circles：圆圈数, 
  // divisions：每个圆圈使用的线段数, color1：用于网格元素的第一种颜色, color2：用于网格元素的第一种颜色 )
            let radius = 100;
            let radials = 16;
            let circles = 8;
            let divisions = 64;
            let PolarGridHelper = new THREE.PolarGridHelper(radius, radials, circles, divisions);
            PolarGridHelper.position.set(0, -20, 0)
            this.scene.add(PolarGridHelper)
           
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            document.body.appendChild(this.renderer.domElement);
 
            //OrbitControls控件操作模块
            let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            controls.autoRotate = true; //将自动旋转打开
            controls.autoRotateSpeed = 0.5;
            // controls.addEventListener('change', function () {
            //         this.renderer.render(this.scene, this.camera)});

            this.geometry = new THREE.BoxGeometry(30, 30, 30, 3, 3, 3);
            // 右边立方体
            let material = new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                wireframe: false,
                castShadow: true,
                receiveShadow: true,
                roughness: 0, //表面放射粗糙度
                metalness: 0 //金属感
 
            }); 
            this.cube = new THREE.Mesh(this.geometry, material);
            this.cube.position.set(30, 0, 20);
            this.scene.add(this.cube);
 
            // 左边立方体
            let matStdObjects = new THREE.MeshStandardMaterial({
                color: 0x0000ff,
                roughness: 0,
                metalness: 0.6
            });
            let mshStdBox = new THREE.Mesh(this.geometry, matStdObjects);
            mshStdBox.position.set(-30, 0, 20);
            mshStdBox.rotation.set(0, Math.PI / 2.0, 0);
            mshStdBox.castShadow = true;
            mshStdBox.receiveShadow = true;
            this.scene.add(mshStdBox);

            this.loadModel();
        },
        loadModel(){
            let loader = new GLTFLoader();
            loader.load('/static/models/gltf/Soldier.glb',function (gltf){
                let model = gltf.scene;
                this.scene.add(model);
                model.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });
                model.rotation.y = -Math.PI;
                model.scale.set(50, 50, 50);
                
                //骨骼显示助手
                let skeleton = new THREE.SkeletonHelper(model);
                this.scene.add(skeleton);

                let animations = gltf.animations;
                this.mixer = new THREE.AnimationMixer(model);
 
                let idleAction = this.mixer.clipAction(animations[0]);
                let walkAction = this.mixer.clipAction(animations[3]);
                let runAction = this.mixer.clipAction(animations[1]);
                this.actions = [idleAction, walkAction, runAction];
                this.actions[1].play();
                this.animate();
            });
        
        },
        activateAllActions() {
            if(this.actions){
                this.actions.forEach(function (action) {
                    action.play();
                });
            };
        },
        animate() {
            requestAnimationFrame(this.animate);
            let mixerUpdateDelta = this.clock.getDelta();
            if (this.mixer) this.mixer.update(mixerUpdateDelta);
            if (this.controls) this.controls.update();
            this.cube.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        }

    },
    mounted(){
        this.init();
        this.loadModel()
        this.animate();
        this.activateAllActions();
    }
}
</script>
