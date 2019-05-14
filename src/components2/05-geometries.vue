<template>
    <div>
        <div id = "Stats-output" ></div>
        <div id = "WebGL-output" ></div>
    </div>
</template>

<script>
// import * as THREE from 'three'
import * as dat from 'dat.gui'
import {Stats} from './loaders/stats.js'
import {OrbitControls} from './loaders/OrbitControls'
import {ConvexGeometry} from './loaders/ConvexGeometry.js'
import {SceneUtils} from './loaders/SceneUtils'
import {ParametricGeometries} from './loaders/ParametricGeometries'

export default {
    name:"book05",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            stats:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xEEEEEE);
            this.scene.fog = new THREE.Fog(0xffffff,0.015,100); //雾化
            // this.scene.fog = new THREE.FogExp2(0xff0000,0.015);
            // this.scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});//材质覆盖属性

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(-30,40,30);
            this.camera.lookAt(this.scene.position);

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

            this.planeGeometery = new THREE.PlaneGeometry(60,40,1,1);
            let planeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
            this.plane = new THREE.Mesh(this.planeGeometery,planeMaterial);
            this.plane.receiveShadow = true;
            this.plane.position.set(0,0,0);
            this.plane.rotation.x = -0.5*Math.PI;
            this.scene.add(this.plane);

            let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40,40,50);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);

            this.addGeometries(this.scene);
          
        },
        addGeometries(scene){
            let geoms = [];
            geoms.push(new THREE.CylinderGeometry(1,4,4));
            geoms.push(new THREE.BoxGeometry(2,2,2));
            geoms.push(new THREE.SphereGeometry(2));
            geoms.push(new THREE.IcosahedronGeometry(4));

            //使用几个点创建凸形
            let points = [
                new THREE.Vector3(2,2,2),
                new THREE.Vector3(2,2,-2),

                new THREE.Vector3(-2,2,-2),
                new THREE.Vector3(-2,2,2),

                new THREE.Vector3(2,-2,2),
                new THREE.Vector3(2,-2,-2),

                new THREE.Vector3(-2,-2,-2),
                new THREE.Vector3(-2,-2,2),
            ];
            geoms.push(new THREE.ConvexGeometry(points));

            //  创建一个路径集合图形PathGeometry
            let pts = []; // points array  - 路径配置文件点将存储在此处
            let detail = .1; //半圆细节 - 将使用多少角度增量来生成点
            let radius = 3; // half_sphere的半径 
            for (let angle = 0.0; angle < Math.PI; angle += detail){ //循环从0.0弧度到PI（0  -  180度）
                pts.push(new THREE.Vector3(
                    Math.cos(angle)*radius, 0 , Math.sin(angle)*radius //角度/半径到x，z
                ));
            }
            geoms.push(new THREE.LatheGeometry(pts,12));

            geoms.push(new THREE.OctahedronGeometry(3));

            //create a geometry based on a function
            // function是该属性为一个函数，该函数以u、v值作为参数定义每个顶点的位置。需要返回THREE.Vector3的值
            // slices是该属性定义u值应该分成多少份
            // stacks是该属性定义v值应该分成多少份
            geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));

            geoms.push(new THREE.TetrahedronGeometry(3));

            geoms.push(new THREE.TorusGeometry(3,1,10,10));

            geoms.push(new THREE.TorusKnotGeometry(3,0.5,50,20));

            let j = 0;
            for(let i = 0; i<geoms.length; i++){
                // let cubeMaterial = new THREE.MeshLambertMaterial({wireframe: true, color: Math.random() * 0xffffff});

                let materials = [
                    new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.SmoothShading}),
                    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
                ];

                let mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials);
                mesh.traverse(function(e){e.castShadow = true;});

                mesh.position.set(-24+((i%4)*12), 4, -8+(j*12));

                if((i+1)%4 == 0) j++;

                this.scene.add(mesh);               
            }

        },
        animate(){
            this.stats.update();  

            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera); 
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
        margin: 0;
        overflow:hidden;
    }
</style>

