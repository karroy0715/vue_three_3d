<template>
    <BoxSwitch :width=wid :height=hei :depth=20 />
</template>

<script>
import BoxSwitch from './components/BoxSwitch'
export default {
    name:"naoketeng",
    components:{BoxSwitch},
    data(){
        return {
            wid:40,
            hei:40                   
        }
    },
    created () {
		this.$watch(
            function () {
                this.wid = Number(this.$route.query.a);
                this.hei = Number(this.$route.query.b);
				return this.wid,this.hei;
            }
        )
	},
 
}
</script>