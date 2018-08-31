<template>
	<el-container style="height: 100%;background-color: #fff;">
		<el-aside width="200px" style="border-right: 1px solid #ddd;height: 100%;">
		<v-tree></v-tree>
		</el-aside>
		<el-main style="padding: 0;position: relative;">
			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<script>
	import vTree from './common/HLXMTree.vue'

  	export default {
	    data() {
	      return {
	        
	      }
	    },
	    components:{
	    	vTree
	    },
	    watch:{
	      	
	    },
	    mounted(){
	    	
	    },
	    methods: {
	      	
	    }
  	}
</script>

<style scoped>
	.hlxm{
		background-color: #fff;
	    height: 100%;
	}
    a{
      color: #000;
    }
</style>