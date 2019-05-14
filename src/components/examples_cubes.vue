<template>
      <div></div>  
</template>

<script>
import * as THREE from 'three'
import $ from 'jquery'
export default {
    name:'E05',
    data(){
        return{
         
            stats:null,
            camera:null, 
            scene:null,
            raycaster:null,
            renderer:null,

            mouse:new THREE.Vector2(),
            INTERSECTED:null,
            radius:100,
            theta : 0,
        }
    },
    methods:{
        init(){
                let container = document.createElement( 'div' );
				document.body.appendChild( container );
				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - interactive cubes';
				container.appendChild( info );
				this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
				this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color( 0xf0f0f0 );
				var light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.position.set( 1, 1, 1 ).normalize();
				this.scene.add( light );
				var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
				for ( var i = 0; i < 20; i ++ ) {
					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
					object.position.x = Math.random() * 800 - 400;
					object.position.y = Math.random() * 800 - 400;
					object.position.z = Math.random() * 800 - 400;
					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;
					object.scale.x = Math.random() + 0.5;
					object.scale.y = Math.random() + 0.5;
					object.scale.z = Math.random() + 0.5;
					this.scene.add( object );
                };
                
                this.raycaster = new THREE.Raycaster();
                this.renderer = new THREE.WebGLRenderer();
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( this.renderer.domElement );
                
                document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

                window.addEventListener( 'resize', this.onWindowResize, false );

        },
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
		},
        onDocumentMouseMove(event){
            // event.preventDefault();

            // this.mouse.x =  ( event.clientX / window.innerWidth ) * 2 - 1;
            // this.mouse.y = - (event.clientY / window.innerHeight) *2 +1;
            
        },
        animate() {
            requestAnimationFrame( this.animate );
            this.render();
				
        },
        render() {
            this.theta += 0.1;
            this.camera.position.x = this.radius * Math.sin( THREE.Math.degToRad( this.theta ) );
            this.camera.position.y = this.radius * Math.sin( THREE.Math.degToRad( this.theta ) );
            this.camera.position.z = this.radius * Math.cos( THREE.Math.degToRad( this.theta ) );
            this.camera.lookAt( this.scene.position );
            this.camera.updateMatrixWorld();
            
            this.raycaster.setFromCamera(this.mouse,this.camera);
            let intersects = this.raycaster.intersectObjects(this.scene.children);

            if ( intersects.length > 0 ) {
                
					if ( this.INTERSECTED != intersects[ 0 ].object ) {
						if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
						this.INTERSECTED = intersects[ 0 ].object;
						this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
						this.INTERSECTED.material.emissive.setHex( 0xff0000 );
					}
				} else {
					if ( this.INTERSECTED ) this.INTERSECTED.material.emissive.setHex( this.INTERSECTED.currentHex );
					this.INTERSECTED = null;
				}
				this.renderer.render( this.scene, this.camera );
        },

    },
    mounted(){
        this.init();
        this.onWindowResize();
        this.onDocumentMouseMove( event );
        this.animate();
    }
    
}
</script>

<style>
    body {
        font-family: Monospace;
        background-color: #f0f0f0;
        margin: 0px;
        overflow: hidden;
    }
</style>