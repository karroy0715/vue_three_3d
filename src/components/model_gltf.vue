<template>
    <model-gltf src="static/models/gltf/Duck/glTF/Duck.gltf"></model-gltf>
</template>

<script>
    import { ModelGltf } from 'vue-3d-model'

    export default {
        name:'M02',
        data(){
          return {
            rotation:{
              x:-Math.PI/2,
              y:0,
              z:0
            }
          }
        },    
        methods:{
          onLoad(){
            this.rotate();   
          },
          rotate(){
            this.rotation.z += 0.01;
            requestAnimationFrame(this.rotate);
          }
        },

        components: {
            ModelGltf
        }
    }
</script>