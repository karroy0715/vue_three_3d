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
    name:"A03",
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

            // let geometry = new THREE.BoxGeometry(2,2,2);
            // geometry.computeVertexNormals();
            // geometry.center();
            // let material = new THREE.MeshPhongMaterial({color: 0xffff00});
            // let mesh = new THREE.Mesh(geometry, material);
            // let scale = this.computeScale(geometry);
            // mesh.scale.multiplyScalar(scale);
            // mesh.position.set(0, 0, 0);
            // this.scene.add(mesh);

        },
        loadModel(){
            let self = this; //这一点很重要。。
            let loader1 = new GLTFLoader();
            //模型名称 (1)tree2 (2)Flamingo (3)Squirrel1 (4)Parrot(5)Soldier
            loader1.load('/static/models/gltf/tree2.glb',function (gltf){
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
                console.log('bbox为'+ bbox);
                let mdlen=bbox.max.x-bbox.min.x; //边界的最小坐标值 边界的最大坐标值
                let mdwid=bbox.max.z-bbox.min.z;
                let mdhei=bbox.max.y-bbox.min.y;               
                console.log('mdlen值为:' + mdlen  + '     ' + 'mdwid值为:' + mdwid + '    ' + 'mdhei值为:' + mdhei);
                console.warn('2原始长宽比为：'+ mdlen / mdhei)
                // let x1=bbox.min.x+mdlen/2;
                // let y1=bbox.min.y+mdhei/2;
                // let z1=bbox.min.z+mdwid/2;
                // loadscene.position.set(-x1,-y1,-z1);
                // console.log('loadscene值为:' + loadscene.position.x + loadscene.position.y + loadscene.position.z);

                //调整大小后的模型。难点：如何设置缩放比例
                //思路：
                let dist =Math.abs(self.camera.position.z - loadscene.position.z- (mdwid/2));
                console.log('dist值为:' + dist );
                let vFov = self.camera.fov * Math.PI/180;
                console.log('vFov值为:' + vFov );
                let vheight = 2 * Math.tan(vFov * 0.5) *dist;
                console.log('vheight值为:' + vheight );
                let fraction = mdhei / vheight;
                // console.log('fraction值为:' + fraction );

                let finalHeight = self.height * fraction ;                
                console.log('finalHeight值为:' + finalHeight);

                let finalWidth = (finalHeight*mdlen) /mdhei;    //这个地方不对            
                console.log('finalWidth值为:' + finalWidth );                

                let value1 = self.width/finalWidth;
                console.log('value1缩放比例值为:' + value1);
                let value2 = self.height/finalHeight;
                console.log('value2缩放比例值为:' + value2);
                console.warn('2包围盒长宽比为:'+finalWidth/finalHeight)
                if(value1 >= value2){
                    loadscene.scale.set(value2,value2,value2);
                }
                else{
                    loadscene.scale.set(value1,value1,value1);
                } 

                self.scene.add(loadscene);

                let bbox2= new THREE.Box3().setFromObject(loadscene)
                console.log('bbox2为'+bbox2);
                let mdlen2=bbox2.max.x-bbox2.min.x;
                let mdwid2=bbox2.max.z-bbox2.min.z;
                let mdhei2=bbox2.max.y-bbox2.min.y;
                
                let x2=bbox2.min.x+mdlen2/2;
                let y2=bbox2.min.y+mdhei2/2;
                let z2=bbox2.min.z+mdwid2/2;
                loadscene.position.set(-x2,-y2,-z2);
                self.scene.add(loadscene);

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
