<template>
    <div>
        <div id = "Stats-output" ></div>
        <div id = "WebGL-output" ></div>
    </div>
</template>

<script>
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {Stats} from './loaders/stats.js'
import {OrbitControls} from './loaders/OrbitControls'
import {SceneUtils} from './loaders/SceneUtils'

export default {
    name:"book06",
    data(){
        return{
            scene:null,
            camera:null,
            renderer:null,  
            cube:null,
            sphere:null,
            stats:null,
            plane:null, 
            planeGeometery:null,
            controlPoints:[],
            vertices:[],
            mesh:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xEEEEEE);

            this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
            this.camera.position.set(-20,25,10);
            this.camera.lookAt(new THREE.Vector3(5,0,0));

            this.renderer = new THREE.WebGLRenderer({antialias: true });
            
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

            this.planeGeometery = new THREE.PlaneGeometry(60,40,1,1);
            let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
            this.plane = new THREE.Mesh(this.planeGeometery,planeMaterial);
            this.plane.receiveShadow = true;
            this.plane.position.set(0,0,0);
            this.plane.rotation.x = -0.5*Math.PI;
            this.scene.add(this.plane);

            // let spotLight = new THREE.SpotLight(0x00ff00);
            let spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(-40,60,10);
            spotLight.castShadow = true;
            this.scene.add(spotLight);

            this.vertices = [ //2 2 4
                new THREE.Vector3(1, 3, 1),
                new THREE.Vector3(1, 3, -1),
                new THREE.Vector3(1, -1, 1),
                new THREE.Vector3(1, -1, -1),
                new THREE.Vector3(-1, 3, -1),
                new THREE.Vector3(-1, 3, 1),
                new THREE.Vector3(-1, -1, -1),
                new THREE.Vector3(-1, -1, 1)
            ];
            let faces = [
                new THREE.Face3(0, 2, 1),
                new THREE.Face3(2, 3, 1),
                new THREE.Face3(4, 6, 5),
                new THREE.Face3(6, 7, 5),
                new THREE.Face3(4, 5, 1),
                new THREE.Face3(5, 0, 1),
                new THREE.Face3(7, 6, 2),
                new THREE.Face3(6, 3, 2),
                new THREE.Face3(5, 7, 0),
                new THREE.Face3(7, 2, 0),
                new THREE.Face3(1, 3, 4),
                new THREE.Face3(3, 6, 4),
            ];

            let geom = new THREE.Geometry();
            geom.vertices = this.vertices;
            geom.faces = faces;
            geom.computeFaceNormals();

            let materials = [
                new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true}),
                new THREE.MeshLambertMaterial({opacity:0.6,color:0x0000ff,transparent:true}),
                
            ];

            this.mesh = SceneUtils.createMultiMaterialObject(geom, materials);
            this.mesh.traverse(function(e){e.castShadow = true;});
            this.scene.add(this.mesh);
            
            function addControl(x,y,z){
                let controls = new function(){
                    this.x = x;
                    this.y = y;
                    this.z = z;
                };
                return controls;
            }
      
            this.controlPoints.push(addControl(3, 5, 3));
            this.controlPoints.push(addControl(3, 5, 0));
            this.controlPoints.push(addControl(3, 0, 3));
            this.controlPoints.push(addControl(3, 0, 0));
            this.controlPoints.push(addControl(0, 5, 0));
            this.controlPoints.push(addControl(0, 5, 3));
            this.controlPoints.push(addControl(0, 0, 0));
            this.controlPoints.push(addControl(0, 0, 3));

            let gui = new dat.GUI(); //控制器
            let self = this;
            gui.add(new function(){
                this.clone = function(){
                    let cloneGeometry = self.mesh.children[0].geometry.clone();
                    let materials = [
                        new THREE.MeshLambertMaterial({opacity:0.6,color:0x00ff00,transparent:true}),
                        new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true})
                    ]; 
                    let mesh2 =  SceneUtils.createMultiMaterialObject(cloneGeometry, materials); 
                    mesh2.children.forEach(function(e){e.castShadow = true});
                    
                    mesh2.translateX(5);
                    mesh2.translateZ(5);
                    mesh2.name = 'clone';
                    // self.scene.remove(self.scene.getChildByName("clone"));
                    self.scene.add(mesh2);
                }
            }, 'clone');

            for(let i = 0; i<8; i++){
                let fi = gui.addFolder('Vertices' + (i+1));
                fi.add(this.controlPoints[i], 'x', -10, 10);
                fi.add(this.controlPoints[i], 'y', -10, 10);
                fi.add(this.controlPoints[i], 'z', -10, 10);
            }

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);
          
        },

        
        animate(){
            
            for(let i=0; i<8; i++){
                this.vertices.push(new THREE.Vector3(this.controlPoints[i].x,this.controlPoints[i].y,this.controlPoints[i].z));
            }
            let that = this;
            this.mesh.children.forEach(function(e){
                e.geometry.vertices = that.vertices;
                e.geometry.verticesNeedUpdate = true;
                e.geometry.computeFaceNormals();
            })
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

