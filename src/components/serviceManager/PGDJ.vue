<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
	        <h5>评估登记</h5>
	        <div class="find">
	        	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				  <el-form-item label="老人姓名" prop="name">
				    <el-input type="text" v-model="ruleForm.elder_name" style="width:100px" size="small" auto-complete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="评估类型" prop="type">
					    <el-select v-model="ruleForm.type" clearable placeholder="请选择评估类型" size="small" style="width:140px">
					    	<el-option v-for="(type, key) in evaluateType" :label="type" :value="key * 1" :key="key"></el-option>
					    </el-select>
				  </el-form-item>
				  <div style="margin-left: 10px">
				    <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
				  </div>
				</el-form>
	        </div>
	    </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	    <v-pgdjt :searchData="searchData" :evaluateType="evaluateType"></v-pgdjt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
	import VPgdjt from './common/PGDJTable.vue'

	export default{
		data() {
	      	return {
	        	ruleForm: {
		          elder_name: '',
		          type: ''
		        },
		        rules: {

		        },
		        searchData: {},
		        evaluateType: []
	      	};
	    },
	    components:{
	      	VPgdjt
	    },
	    mounted(){
	      	this.fetchEvaluateType();
	    },
	    methods: {
	      	submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	var data = {
		            		'elder_name': this.ruleForm.elder_name,
		            		'type': this.ruleForm.type * 1
		            	}
		            	this.searchData = data;
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });
	      	},
	        fetchEvaluateType: async function(){
						let url = this.api.data;
	        	var data = {
		            'group': this.data.BEADHOUSE_HEALTH_EVALUATE_TYPE
	        	}
						const res = await this.$http.post(url,data);
						this.evaluateType = res.data.data;
	        },
	    },
	}
</script>

<style scoped>
	.pgdj{
		background-color: #fff;
	    min-height: 100%;
	}
	.top-tit{padding: 20px;border-bottom: 1px solid #ddd;overflow: hidden;}
  	.top-tit h5{color: #ff8777;font-weight: normal;float: left;line-height: 30px;margin: 0;font-size: 18px}
  	.demo-ruleForm{
  		display: flex;
  	}
  	.find form{
  		height: 40px;
  		display: flex;
  		align-items: center;
  		justify-content: flex-end;
  	}
  	.el-form-item {
	    margin-bottom: 0;
	}
</style>