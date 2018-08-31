<template>
	<el-container style="height: 100%;background: #ffffff;">
		<el-header style="border-bottom: 1px solid #ddd;">
			<h5 style="color: #ff8777;margin-left: 30px;padding-top: 20px;">数据字典</h5>
		</el-header>
		<el-container style="height: 100%;">
			<el-aside width="200px" style="position: relative;">
      	<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<v-tree></v-tree>
      	</el-scrollbar>
			</el-aside>
			<el-main style="height: 100%;position: relative;">
      	<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<router-view></router-view>
      	</el-scrollbar>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import vTree from './SJZTTree.vue'

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
	.cwlx{
		background-color: #fff;
	    height: 100%;
	}
    a{
      color: #000;
    }
</style>