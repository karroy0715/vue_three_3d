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

export default {
    name:"book0708",
    data(){
        return{
            scene:null,
            sceneOrtho:null,
            camera:null,
            renderer:null,  
            stats:null,
            controls:null,

        }
    },
    methods:{
        init(){
            this.scene = new THREE.Scene();
            this.sceneOrtho = new THREE.Scene();
            // this.scene.background = new THREE.Color(0xEEEEEE);
            // this.scene.fog = new THREE.Fog(0xffffff,0.015,100); //雾化
                      
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 250);
            this.cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);
            this.camera.position.set(0,0,50);

            this.renderer = new THREE.WebGLRenderer({antialias: true });            
            this.renderer.setSize(window.innerWidth,window.innerHeight);
            this.renderer.setClearColor(new THREE.Color(0x0000ff, 1.0));
            this.renderer.setPixelRatio(window.devicePixelRatio);         
            document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

            let orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);

            let material = new THREE.MeshNormalMaterial();        
            let geom = new THREE.SphereGeometry(15, 20, 20);
            let mesh = new THREE.Mesh(geom, material);

            this.scene.add(mesh);

            // let getTexture = function () {
            //     let texture = new THREE.ImageUtils.loadTexture("/static/particles/sprite-sheet.png");
            //     return texture;
            // };

            // let ambientLight = new THREE.AmbientLight(0x0c0c0c);
            // this.scene.add(ambientLight);

            let self = this;
            this.controls = new function(){
                this.size = 150;
                this.sprite = 0;
                this.transparent = true;
                this.opacity = 0.6;
                this.color = 0xffffff;
                this.rotateSystem = true;

                this.redraw = function () {
                    self.sceneOrtho.children.forEach(function (child) {
                        if (child instanceof THREE.Sprite) self.sceneOrtho.remove(child);
                    });
                    self.createSprite(self.controls.size, self.controls.transparent, self.controls.opacity, self.controls.color, self.controls.sprite);
                };
            };

            let gui = new dat.GUI(); 
            gui.add(this.controls, 'sprite', 0, 5).step(1).onChange(this.controls.redraw);
            gui.add(this.controls, 'size', 0, 800).onChange(this.controls.redraw);
            gui.add(this.controls, 'transparent').onChange(this.controls.redraw);
            gui.add(this.controls, 'opacity', 0, 1).onChange(this.controls.redraw);
            gui.addColor(this.controls, 'color').onChange(this.controls.redraw);
            this.controls.redraw();

            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(this.stats.domElement);
          
        },
        getTexture(){
            let texture = new THREE.ImageUtils.loadTexture("/static/particles/sprite-sheet.png");
            return texture;
        },
        createSprite(size, transparent, opacity, color, spriteNumber){
            let spriteMaterial = new THREE.SpriteMaterial({
                        opacity: opacity,
                        color: color,
                        transparent: transparent,
                        map: this.getTexture()
                    }
            );

            // we have 1 row, with five sprites
            spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
            spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
            spriteMaterial.depthTest = false;

            spriteMaterial.blending = THREE.AdditiveBlending;

            let sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(size, size, size);
            sprite.position.set(100, 50, -10);
            sprite.velocityX = 5;

            this.sceneOrtho.add(sprite);
        },
        animate(){
            vvv
            this.camera.position.y = 100+ Math.sin(this.step += 0.01) * 20;
 
            let self = this;
            this.sceneOrtho.children.forEach(function (e) {
                if (e instanceof THREE.Sprite) {
                    // move the sprite along the bottom
                    e.position.x = e.position.x + e.velocityX;
                    if (e.position.x > window.innerWidth) {
                        e.velocityX = -5;
                        e.material.map.offset.set(1 / 5 * (self.controls.sprite % 4), 0);
                    }
                    if (e.position.x < 0) {
                        e.velocityX = 5;
                    }
                }
            });

            this.stats.update();  

            requestAnimationFrame(this.animate);

            this.renderer.render(this.scene,this.camera); 
            this.renderer.autoClear = false;
            this.renderer.render(this.sceneOrtho, this.cameraOrtho);
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