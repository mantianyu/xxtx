<template>
  <el-container style="height: 100%;background: #ffffff;">
		<el-header style="border-bottom: 1px solid #ddd;">
			<h5 style="color: #ff8777;margin-left: 30px;padding-top: 20px;">楼房管理</h5>
		</el-header>
		<el-main style="position: relative;overflow: hidden;">
			<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
				<router-view></router-view>
          	</el-scrollbar>
		</el-main>
	</el-container>
</template>

<script>
  	export default {
	    data() {
	      return {
	        
	      }
	    },
	    watch:{
	      	
	    },
	    mounted(){
	    	
	    },
		computed:{
		},
	    methods: {
	    }
  	}
</script>

<style scoped>
	.cwlx{
		background-color: #fff;
	}
    a{
      color: #000;
    }
</style>