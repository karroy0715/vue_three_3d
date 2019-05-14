<template>
    <div></div>
</template>

<script>
import * as THREE from 'three'
// import { ModelGltf } from 'vue-3d-model'
import {GLTFLoader} from './loaders/GLTFLoader.js'
import {OrbitControls} from './loaders/OrbitControls';


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
            mixer:null,
            model:null

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

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            document.body.appendChild(this.renderer.domElement);

            //环境光和方向光混合以及加了阴影
            let light = new THREE.AmbientLight(0xffffff, 0.1);
            this.scene.add(light);

            let dirlight = new THREE.DirectionalLight(0xffffff);
            dirlight.position.set(-30, 120, -100);
            dirlight.castShadow = true;
            //dirlight.shadowCameraVisible=true;
            dirlight.shadow.camera.top = 100;
            dirlight.shadow.camera.bottom = -100;
            dirlight.shadow.camera.left = -100;
            dirlight.shadow.camera.right = 100;
            dirlight.shadow.camera.near = 0.1;
            dirlight.shadow.camera.far = 500;
            this.scene.add(dirlight);

           //淡绿色的平面
            let mesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(200, 200), 
                new THREE.MeshPhongMaterial({color: 0x9cfcf9, depthWrite: false})  
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(0, -20, 0);
            mesh.receiveShadow = true;
            this.scene.add(mesh);

            //蓝绿相隔的网格
            // PolarGridHelper( radius：标网格的半径, radials：径向线的数量, circles：圆圈数, 
            // divisions：每个圆圈使用的线段数, color1：用于网格元素的第一种颜色, color2：用于网格元素的第一种颜色 )
            // let radius = 100;
            // let radials = 16;
            // let circles = 8;
            // let divisions = 64;
            let PolarGridHelper = new THREE.PolarGridHelper(100, 16, 8, 64,0x00ff00,0x0000ff);
            PolarGridHelper.position.set(0, -20, 0)
            this.scene.add(PolarGridHelper)
          
          
            this.geometry = new THREE.BoxGeometry(30, 30, 30, 3, 3, 3);
            // 右边立方体
            let material = new THREE.MeshStandardMaterial({
                color: 0x00ff00,
                wireframe: false,
                castShadow: true,
                receiveShadow: true,
                roughness: 0, //表面放射粗糙度
                metalness: 0, //金属感,设置的值的范围为0-1，值越小，材质越光滑，高光越明显
                // metalnessMap: 0.1 //设置的值的范围为0-1，值越大，越有生锈金属的质感，值越小反光越清晰
 
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
            // mshStdBox.rotation.set(0, Math.PI / 2.0, 0);
            mshStdBox.castShadow = true;
            mshStdBox.receiveShadow = true;
            this.scene.add(mshStdBox);

            //OrbitControls控件操作模块
            let controls = new OrbitControls(this.camera, this.renderer.domElement);
            controls.autoRotate = true; //将自动旋转打开
            controls.autoRotateSpeed = 0.5;
            // controls.addEventListener('change', function () {
            //         this.renderer.render(this.scene, this.camera)});  
            
        },
        loadModel(){
            let self = this; //这一点很重要。。
            
            let group = new THREE.Group();
            let arr = []; //生成一个速度的数组
            for(let i=0; i<1000; i++){
                group.add(randomCube());
                arr.push({
                    speed:Math.random(),
                    y:-3
                });
            }
            this.scene.add(group);

              //随机一个立方体
            function randomCube() {
                let material1 = new THREE.MeshBasicMaterial({color:0xffffff * Math.random()});
                let boxSize = Math.random()*0.5;
                let geometry1 = new THREE.BoxGeometry(boxSize, boxSize,boxSize);
                let mesh1 = new THREE.Mesh(geometry1, material1);
                mesh1.position.set(Math.random()*100-50, -3, Math.random()*100-50);
                mesh1.speed = Math.random();
                return mesh1;
            }
             //创建webWorkers
            if (!window.Worker) {
                alert("你的电脑不支持web Workers");
            }
            let myWorker = new Worker('worker.js');
              
            let loader = new GLTFLoader();
            loader.load('/static/models/gltf/Soldier.glb',function (gltf){
                self.model = gltf.scene;
                self.scene.add(self.model);
                self.model.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);
                    }
                });
                self.model.rotation.y = -Math.PI;  //object对象绕y轴旋转180度
                self.model.scale.set(70, 70, 70);  //控制object对象的缩放大小
                
                //骨骼显示助手
                let skeleton = new THREE.SkeletonHelper(self.model);
                self.scene.add(skeleton);

                //AnimationMixer是场景中特定对象的动画播放器。
                //当场景中的多个对象独立动画时，可以为每个对象使用一个AnimationMixer
                let animations = gltf.animations;
                self.mixer = new THREE.AnimationMixer(self.model);
                //这个地方不太懂？？？？三个必须有 并且acions[1]只可为1.

                let idleAction = self.mixer.clipAction(animations[0]);//通过动画数据创建播放器
                let walkAction = self.mixer.clipAction(animations[3]);
                let runAction = self.mixer.clipAction(animations[1]);
                self.actions = [idleAction, walkAction, runAction];
                self.actions[1].play();//直接调用播放器的播放事件让动画播放 
                // self.actions[1].setDuration(5).play();//单位是秒

                //在模型加载完成后，链接worker线程
                myWorker.postMessage(arr);

                myWorker.onmessage = function (e) {
                    for(let i=0; i<e.data.length; i++){
                        group.children[i].position.y = e.data[i].y;
                    }
                }
                self.animate();
            });
        
        },
        activateAllActions() {
            if(this.actions){ //判断是否为数组，foEach只处理数组
                this.actions.forEach(function (action) {
                    action.play();
                });
            };
        },
        animate() {
            requestAnimationFrame(this.animate);

            let mixerUpdateDelta = this.clock.getDelta();
            if (this.mixer) this.mixer.update(mixerUpdateDelta); //v=s/t。动画播放器更新

            if (this.controls) this.controls.update();
            this.cube.rotation.y += 0.01;
            this.renderer.render(this.scene, this.camera);
        }

    },
    mounted(){
        this.init();
        this.loadModel();
        this.animate();
        this.activateAllActions();
    }
}
</script>
