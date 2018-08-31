<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
			<h5>就医登记</h5>
			<div class="find">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
					<el-form-item label="老人姓名" prop="elder_name">
						<el-input type="text" v-model="ruleForm.elder_name" style="width:100px" size="small" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="就医时间" prop="time">
							<el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.time"></el-date-picker>
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
	    <v-jydjt :searchData="searchData"></v-jydjt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
	import VJydjt from './common/JYDJTable.vue'

	export default{
		data() {
	      	return {
	        	ruleForm: {
		          elder_name: '',
		          time: '',
		        },
		        rules: {

		        },
		        searchData: {}
	      	};
	    },
	    components:{
	      	VJydjt
	    },
	    mounted(){
	      	
	    },
	    methods: {
	      	submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		var time;
		          		if(this.ruleForm.time == '' || this.ruleForm.time == null){
		          			time = '';
		          		}else{
		          			time = this.ruleForm.time.getTime() / 1000;
		          		}
		            	var data = {
		            		'elder_name': this.ruleForm.elder_name,
				          	'time': time,
		            	}
		            	this.searchData = data;
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });
	      	},
	    },
	}
</script>

<style scoped>
	.nlpg{
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