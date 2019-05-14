<template>
    <div>
        <div id= "WebGL-output"></div>       
    </div>    
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from './loaders/OrbitControls'
import {GLTFLoader} from './loaders/GLTFLoader.js'
export default {
    name:"A3",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
            sphere:null,
            step:0,
            stats:null, 
            width:500,
            height:300,         
        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf5f5f5);

            this.camera = new THREE.PerspectiveCamera(45,this.width/this.height,0.1,1000);
            this.camera.position.set(0,0,100);

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            this.renderer.setSize(this.width,this.height);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true; 
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);
            // orbitcontrols.maxPolarAngle = Math.PI * 0.5;

            let axes = new THREE.AxisHelper(100);
            this.scene.add(axes);

            let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40,60,-10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            let dirlight = new THREE.DirectionalLight(0xdfebff, 1);
            dirlight.position.set(20, 20, 20);
            dirlight.castShadow = true;
            dirlight.shadow.mapSize.width = 1024;
            dirlight.shadow.mapSize.height = 1024;
            dirlight.shadow.camera.top = 100;
            dirlight.shadow.camera.bottom = -100;
            dirlight.shadow.camera.left = -100;
            dirlight.shadow.camera.right = 100;
            dirlight.shadow.camera.near = 0.1;
            dirlight.shadow.camera.far = 50;
            this.scene.add(dirlight);

            let helper = new THREE.DirectionalLightHelper(dirlight,2,0xffff00);
            this.scene.add(helper);

        },
        loadModel(){
            let self = this;
            let loader1 = new GLTFLoader();
            //模型名称 (1)tree2 (2)Flamingo (3)Squirrel1 (4)Parrot(5)Soldier
            loader1.load('/static/models/gltf/Flamingo.glb',function (gltf){
                const loadscene = gltf.scene;               
                loadscene.traverse(function(object){
                    if(object.isMesh){
                        object.castShadow = true;
                        console.log(object);                        
                    }
                });               
                loadscene.rotation.x = -Math.PI/2;
        
                // 思路：得到原始模型，并放置在中心位置，获取到该模型的最大最小边框值
                //根据边框值，设置缩放比例，然后重新加载放在中心位置
                let bbox = new THREE.Box3().setFromObject(loadscene);
                console.log(bbox);
                let mdlen=bbox.max.x-bbox.min.x; //边界的最小坐标值 边界的最大坐标值
                let mdwid=bbox.max.z-bbox.min.z;
                let mdhei=bbox.max.y-bbox.min.y;               
                console.log('mdlen值为:' + mdlen  + '     ' + 'mdwid值为:' + mdwid + '    ' + 'mdhei值为:' + mdhei);
                console.warn('原始长宽比为：'+ mdlen / mdhei)
                // let x1=bbox.min.x+mdlen/2;
                // let y1=bbox.min.y+mdhei/2;
                // let z1=bbox.min.z+mdwid/2;
                // loadscene.position.set(-x1,-y1,-z1);
                // console.log('loadscene值为:' + loadscene.position.x + loadscene.position.y + loadscene.position.z);

                //将包围盒的世界坐标转为屏幕坐标                
                let worldVector = new THREE.Vector3(  
                    (bbox.min.x + bbox.max.x) / 2, (bbox.min.y + bbox.max.y) / 2, (bbox.min.z + bbox.max.z) / 2);//获取模型的世界坐标
                console.log('x' + worldVector.x + 'y' + worldVector.y + 'z' + worldVector.z);
                let standardVector = worldVector.project(self.camera);//世界坐标转标准设备坐标
                let a = self.width / 2;
                let b = self.height / 2;
                let m = standardVector.x * a + a;//标准设备坐标转屏幕坐标
                let n = -standardVector.y * b + b;//标准设备坐标转屏幕坐标
                console.log('包围盒m值为:' + m  + '.     n值为:' + n ); 

                //获取包围盒三个坐标点然后计算包围盒
                let worldVector1 = new THREE.Vector3 ( -mdlen/ 2, mdhei/ 2, mdwid/ 2);   
                let standardVector1 = worldVector1.project(self.camera);//世界坐标转标准设备坐标
                let a1 = self.width / 2;
                let b1 = self.height / 2;
                let m1 = standardVector1.x * a1 + a1;//标准设备坐标转屏幕坐标
                let n1 = -standardVector1.y * b1 + b1;//标准设备坐标转屏幕坐标
                console.log('包围盒m1值为:' + m1  + '.    n1值为:' + n1 ); 

                let worldVector2 = new THREE.Vector3( mdlen/ 2, mdhei/ 2, mdwid/ 2); 
                let standardVector2 = worldVector2.project(self.camera);//世界坐标转标准设备坐标
                let a2 = self.width / 2;
                let b2 = self.height / 2;
                let m2 = standardVector2.x * a2 + a2;//标准设备坐标转屏幕坐标
                let n2 = -standardVector2.y * b2 + b2;//标准设备坐标转屏幕坐标
                console.log('包围盒m2值为:' + m2  + '.    n2值为:' + n2 ); 

                let worldVector3 = new THREE.Vector3( mdlen/ 2, -mdhei/ 2, mdwid/ 2); 
                let standardVector3 = worldVector3.project(self.camera);//世界坐标转标准设备坐标
                let a3 = self.width / 2;
                let b3 = self.height / 2;
                let m3 = standardVector3.x * a3 + a3;//标准设备坐标转屏幕坐标
                let n3 = -standardVector3.y * b3 + b3;//标准设备坐标转屏幕坐标
                console.log('包围盒m3值为:' + m3  + '.    n3值为:' + n3 );   
                
                let pwidth = m2-m1;
                let qheight = n3-n2;
                console.log('缩放前包围盒mdlen值x为:' + mdlen  + '. ' +'mdhei值y为:' + mdhei + '. ' + 'mdwid值z为:' + mdwid );
                console.log('屏幕坐标中包围盒长为:' + pwidth  + '. 宽为:' + qheight ); 
                console.warn('包围盒长宽比为:'+pwidth/ qheight)
                let value1 = self.width/pwidth;
                console.log('value1缩放比例值为:' + value1);
                let value2 = self.height/qheight;
                console.log('value2缩放比例值为:' + value2);
                window._loadscene = loadscene
                if(value1 >= value2){
                    loadscene.scale.set(value2,value2,value2);
                }
                else{
                    loadscene.scale.set(value1,value1,value1);
                }

                let bbox2= new THREE.Box3().setFromObject(loadscene)
                console.log('bbox2为'+bbox2);
                let mdlen2=bbox2.max.x-bbox2.min.x;
                let mdwid2=bbox2.max.z-bbox2.min.z;
                let mdhei2=bbox2.max.y-bbox2.min.y;
                
                // let centerpoint=new THREE.Vector3();
                let x2=bbox2.min.x+mdlen2/2;
                let y2=bbox2.min.y+mdhei2/2;
                let z2=bbox2.min.z+mdwid2/2;
                loadscene.position.set(-x2,-y2,-z2);
                self.scene.add(loadscene);

                self.camera.position.z += 0.5 * mdhei2;
                let boxhelper = new THREE.BoxHelper(loadscene,0xbe1915); //外面红色框
                self.scene.add(boxhelper);  
            });                       
        },
        animate(){
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera);  
        }
    },
    mounted(){
        this.init();
        this.animate(); 
        this.loadModel();      
    }
}
</script>

<style>
    body{
        margin: 0;
        overflow:hidden;
        margin: 100px;
        margin-top: 0px;
        background:  #D9FCCA;
    }
    #WebGL-output{
        height:300px;
        width:500px;
        background: #d9fcca; 
        margin-left: 10px;
        margin-top:10px;               
    }
</style>
