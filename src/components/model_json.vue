<template>
    <model-three src="static/models/json/scene.json"></model-three>
</template>

<script>
    import { ModelThree } from 'vue-3d-model'

    export default {
        name:'M03',
        components: {
            ModelThree
        }
    }
</script>