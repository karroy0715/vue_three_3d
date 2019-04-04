<template>
    <div>
      <div id="container"></div>
    </div>
</template>
 
<script>
import * as Three from 'three'
 
export default {
  name: 'roy',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('container');
 
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 1;
 
        this.scene = new Three.Scene();
 
        let geometry = new Three.BoxGeometry(0.3, 0.3, 0.3);
        //MeshNormalMaterial是一种将法向量映射到 RGB 颜色的材质。网格在每一个面上渲染的颜色都不一样，
        //法向量是与面垂直的向量，由于一个物体各个面上的法向量都不同，所以每个面映射的颜色也不同。
        let material = new Three.MeshNormalMaterial();
 
        this.mesh = new Three.Mesh(geometry, material);
        this.scene.add(this.mesh);
 
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
 
    },
    animate: function() {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
      this.init();
      this.animate()
  }
}
</script>
<style scoped>
  #container {
    height: 400px;
  }
</style>
