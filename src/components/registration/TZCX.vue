<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
	        <h5>退住查询</h5>
	        <div class="find">
	        	<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				  <el-form-item label="老人姓名" prop="elderName">
				    <el-input type="text" v-model="ruleForm.elderName" style="width:100px" size="small" auto-complete="off"></el-input>
				  </el-form-item>
				   <el-form-item label="退住时间" prop="date">
				       <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.startDate"></el-date-picker>
				       <b style="margin-left: 5px;margin-right: 5px;">~</b>
				       <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.endDate"></el-date-picker>
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
	    <v-tzcxt :searchData="searchData"></v-tzcxt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
	import VTzcxt from './common/TZCXTable.vue'

	export default{
		data() {
	      	return {
	        	ruleForm: {
		          elderName: '',
		          startDate: '',
		          endDate: ''
		        },
		        rules: {
		          
		        },
		        searchData: {}
	      	};
	    },
	    components:{
	      	VTzcxt
	    },
	    mounted(){
	      	
	    },
	    methods: {
	      	submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		if(this.ruleForm.startDate == '' || this.ruleForm.startDate == null || this.ruleForm.endDate == '' || this.ruleForm.endDate == null ){
		          			var start_time;
			          		var end_time;
			          		if(this.ruleForm.startDate == '' || this.ruleForm.startDate == null){
			          			start_time = '';
			          		}else{
			          			start_time = this.ruleForm.startDate.getTime() / 1000;
			          		}
			          		if(this.ruleForm.endDate == '' || this.ruleForm.endDate == null){
			          			end_time = '';
			          		}else{
			          			end_time = this.ruleForm.endDate.getTime() / 1000;
			          		}
			            	var data = {
			            		'elder_name': this.ruleForm.elderName,
			            		'start_time': start_time,
								'end_time': end_time,
								'type': 1
			            	}
			            	this.searchData = data;
		          		}else{
		          			if(this.ruleForm.startDate.getTime() > this.ruleForm.endDate.getTime()){
			          			this.$alert(this.message.startNoLaterEnd, '', {
						          confirmButtonText: this.message.confirm,
						          callback: action => {
						            
						          }
						        });
			          		}else{
			          			var start_time;
				          		var end_time;
				          		if(this.ruleForm.startDate == '' || this.ruleForm.startDate == null){
				          			start_time = '';
				          		}else{
				          			start_time = this.ruleForm.startDate.getTime() / 1000;
				          		}
				          		if(this.ruleForm.endDate == '' || this.ruleForm.endDate == null){
				          			end_time = '';
				          		}else{
				          			end_time = this.ruleForm.endDate.getTime() / 1000;
				          		}
				            	var data = {
				            		'elder_name': this.ruleForm.elderName,
				            		'start_time': start_time,
									'end_time': end_time,
									'type': 1
				            	}
				            	this.searchData = data;
			          		}
		          		}
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });
	      	},
	      	search: async function(data){
	      		let url = this.api.eldercheckoutdetaillist;
	      		const res = await this.$http.post(url,data);
	      		console.log(res)
	      		this.searchList = res.data.data.data;
	      	}
	    },
	}
</script>

<style scoped>
	.tslf{
		background-color: #fff;
	    min-height: 100%;
	    position: relative;
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