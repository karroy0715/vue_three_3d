<template>
    <ModelScale :key="key" :width=500 :height=300 :modelUrl="modelname" style="height:500px; width:500px;" />
</template>
<script>
import ModelScale from './components/ModelScale.vue'
export default {
    name:"scale",
    components:{ModelScale},
    data(){
        return {
            //(1)tree2 (5)Soldier (6)stone (3)Squirrel1|| (2) 不符合： Flamingo2  (4)Parrot
            modelname: ''    
        }
    },
    computed:{
	    key(){
            this.modelname = this.$route.query.name;
            return this.modelname;           
	    }
    },
    // 方法1
    // created () {
	// 	this.$watch(
    //         function () {
    //             this.modelname = this.$route.query.name;
	// 			return this.modelname;
    //         }
    //     )
    // },

    //方法2
    // created() {
    //     this.modelname = this.$route.query.name;
    //     return this.modelname;
    // }, 
    // //只写这个 需要刷新两遍才可以
    // watch:{         
    //     '$route':function(){
    //         debugger
    //         this.modelname = this.$route.query.name;
    //         console.log(this.modelname);
    //     }
    // },
    
    //方法3
    // watch: {
    //     '$route' (to, from) { //监听路由是否变化
    //         if(this.$route.query.name){// 判断条件1  判断传递值的变化
    //             this.modelname = this.$route.query.name;//获取文章数据
    //         }
    //     }
    // } //若参数无变化，则刷新得到data中数据
}
</script>