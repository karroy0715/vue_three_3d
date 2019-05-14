<template>
    <div>
        <div id = "Stats-output"></div>
        <div id= "WebGL-output"></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {Stats} from './loaders/Stats.js'
import {OrbitControls} from './loaders/OrbitControls'
import {SceneUtils} from './loaders/SceneUtils.js'
export default {
    name:"book01",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
            sphere:null,
            step:0,
            stats:null, 
            group:[],
            controls:null,  
            bboxMesh:null,           
        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xf5f5f5);

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(-0,30,30);
            this.camera.lookAt(new THREE.Vector3(0,0,0));

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            // this.renderer.setClearColor(new THREE.Color(0x0000ff));
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true; //添加阴影

            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);
            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

            let axes = new THREE.AxisHelper(20);
            this.scene.add(axes);

            var ground = new THREE.PlaneGeometry(100, 100, 50, 50);
            var groundMesh = SceneUtils.createMultiMaterialObject(ground,
                [new THREE.MeshBasicMaterial({wireframe: false, overdraw: true, color: 0x000000}),
                    new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5})                   
                ]);
            groundMesh.rotation.x = -0.5 * Math.PI;
            this.scene.add(groundMesh);

            let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            this.scene.add(ambientLight);

            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40,60,-10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            let self = this;
            this.controls = new function(){
                // we need the first child, since it's a multimaterial
                this.cubePosX = 0;
                this.cubePosY = 3;
                this.cubePosZ = 10;

                this.spherePosX = 10;
                this.spherePosY = 5;
                this.spherePosZ = 0;

                this.groupPosX = 10;
                this.groupPosY = 5;
                this.groupPosZ = 0;

                this.grouping = false;
                this.rotate = false;

                this.groupScale = 1;
                this.cubeScale = 1;
                this.sphereScale = 1;

                
                this.redraw = function(){
                    self.scene.remove(self.group);
                    // create a new one
                    self.sphere = self.createMesh(new THREE.SphereGeometry(5, 10, 10));
                    self.cube = self.createMesh(new THREE.BoxGeometry(6, 6, 6));

                    self.sphere.position.set(self.controls.spherePosX, self.controls.spherePosY, self.controls.spherePosZ);
                    self.cube.position.set(self.controls.cubePosX, self.controls.cubePosY, self.controls.cubePosZ);
                    // add it to the scene.
                    // also create a group, only used for rotating
                    self.group = new THREE.Group();
                    self.group.add(self.sphere);
                    self.group.add(self.cube);

                    self.scene.add(self.group);
                    self.controls.positionBoundingBox();
                    //dir, origin, length, color, headLength, headWidth
                    /*ArrowHelper的参数：
                        dir:方向,默认是法向量
                        origin:开始的坐标位置
                        length：辅助线的长度
                        color：辅助线的颜色
                        headLength：头部的长度
                        headWidth：头部的宽度
                    */
                    var arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), self.group.position, 10, 0x0000ff);
                    self.scene.add(arrow);
                };

                this.positionBoundingBox = function () {
                    self.scene.remove(self.bboxMesh);
                    var box = self.setFromObject(self.group);//group中的子对象的坐标变换完毕后，获取到组group的新的边界立方体
                    var width = box.max.x - box.min.x;
                    var height = box.max.y - box.min.y;
                    var depth = box.max.z - box.min.z;
                    //得到group立方体边界的宽高和深度，根据这些值，生成一个立方几何体

                    var bbox = new THREE.BoxGeometry(width, height, depth);
                    self.bboxMesh = new THREE.Mesh(bbox, new THREE.MeshBasicMaterial({
                        color: "red",
                        vertexColors: THREE.VertexColors,
                        wireframeLinewidth: 2,
                        wireframe: true
                    }));
                    self.scene.add(self.bboxMesh);
                    self.bboxMesh.position.x = ((box.min.x + box.max.x) / 2);
                    self.bboxMesh.position.y = ((box.min.y + box.max.y) / 2);
                    self.bboxMesh.position.z = ((box.min.z + box.max.z) / 2);
                };

            }
            let gui = new dat.GUI(); //控制器
            var sphereFolder = gui.addFolder("sphere");
            sphereFolder.add(this.controls, "spherePosX", -20, 20).onChange(function (e) {
                self.sphere.position.x = e;
                //当球体的坐标发生变化时，应该重新计算组group的范围
                //包含区域的最小矩形，该区域应在最小矩形内部
                self.controls.positionBoundingBox()
            });
            sphereFolder.add(this.controls, "spherePosZ", -20, 20).onChange(function (e) {
                self.sphere.position.z = e;
                self.controls.positionBoundingBox()
            });
            sphereFolder.add(this.controls, "spherePosY", -20, 20).onChange(function (e) {
                self.sphere.position.y = e;
                self.controls.positionBoundingBox()
            });
            sphereFolder.add(this.controls, "sphereScale", 0, 3).onChange(function (e) {
                self.sphere.scale.set(e, e, e);
                self.controls.positionBoundingBox()
            });

            var cubeFolder = gui.addFolder("cube");
            cubeFolder.add(this.controls, "cubePosX", -20, 20).onChange(function (e) {
                self.cube.position.x = e;
                self.controls.positionBoundingBox()
            });
            cubeFolder.add(this.controls, "cubePosZ", -20, 20).onChange(function (e) {
                self.cube.position.z = e;
                self.controls.positionBoundingBox()
            });
            cubeFolder.add(this.controls, "cubePosY", -20, 20).onChange(function (e) {
                self.cube.position.y = e;
                self.controls.positionBoundingBox()
            });
            cubeFolder.add(this.controls, "cubeScale", 0, 3).onChange(function (e) {
                self.cube.scale.set(e, e, e);
                self.controls.positionBoundingBox()
            });

            var cubeFolder = gui.addFolder("group");
            cubeFolder.add(this.controls, "groupPosX", -20, 20).onChange(function (e) {
                self.group.position.x = e;
                self.controls.positionBoundingBox()
            });
            cubeFolder.add(this.controls, "groupPosZ", -20, 20).onChange(function (e) {
                self.group.position.z = e;
                self.controls.positionBoundingBox()
            });
            cubeFolder.add(this.controls, "groupPosY", -20, 20).onChange(function (e) {
                self.group.position.y = e;
                self.controls.positionBoundingBox()
            });
            cubeFolder.add(this.controls, "groupScale", 0, 3).onChange(function (e) {
                self.group.scale.set(e, e, e);
                self.controls.positionBoundingBox()
            });

            gui.add(this.controls, "grouping");
            gui.add(this.controls, "rotate");
            this.controls.redraw();
            this.animate();

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);

        },
        createMesh(geom) {
            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;
            var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;

            // 创建一个多种材质的网格
            var plane = SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);
            return plane;
        },
        animate(){
            if (this.controls.grouping && this.controls.rotate) {
                this.group.rotation.y += step;
            }

            if (this.controls.rotate && !this.controls.grouping) {
                this.sphere.rotation.y += step;
                this.sphere.rotation.y += step;
            }

            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene,this.camera);

            this.stats.update();       
        },
        setFromObject(object) {
            // http://jsfiddle.net/MREL4/
        
            //Box3对象的构造函数.用来在三维空间内创建一个立方体边界对象
            //参数min,max,如果没有参数min,max将立方体边界初始化为Infinity,无穷大
            var box = new THREE.Box3();
            var v1 = new THREE.Vector3();
            //设置全局变换,object，即该demo中的group以及子对象都应用矩阵变换.
            object.updateMatrixWorld(true);
                                    
            //调用Box3.makeEmpty()方法,将立方体边界设置成无穷大.
            box.makeEmpty();
            //然后遍历组group中的每个子对象
            object.traverse(function (node) {
                //如果该子对象有几何体且几何体有顶点，则复制该几何体的每个顶点，然后对其进行矩阵变换
                //矩阵变换后得到的新的坐标位置，再根据这些新的坐标设置group的边界
                if (node.geometry !== undefined && node.geometry.vertices !== undefined) {
                    var vertices = node.geometry.vertices;
                    for (var i = 0, il = vertices.length; i < il; i++) {
                        v1.copy(vertices[i]);
                        v1.applyMatrix4(node.matrixWorld);
                        //applyMatrix4方法通过传递变换矩阵matrix(旋转,缩放,移动等变换矩阵)
                        //对当前立方体对象的8个角点,应用变换.
    
                        box.expandByPoint(v1);
                        //调用expandByPoint()方法重新设置立方体边界
                    }
                }
            });
            return box;
        },
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

