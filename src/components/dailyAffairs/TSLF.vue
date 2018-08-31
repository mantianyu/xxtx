<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
			<h5>探视来访</h5>
			<div class="find">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="来访人" prop="visitorName">
						<el-input type="text" v-model="ruleForm.visitorName" style="width:100px" size="small" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="老人姓名" prop="elderName">
						<el-input type="text" v-model="ruleForm.elderName" style="width:100px" size="small" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="来访时间" prop="date">
						<el-date-picker type="date" size="small" placeholder="选择日期" style="width: 140px;" v-model="ruleForm.date"></el-date-picker>
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
		<v-tslft :searchData="searchData"></v-tslft>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VTslft from './common/TSLFTable.vue'

export default {
	data() {
		return {
			ruleForm: {
				visitorName: '',
				elderName: '',
				date: ''
			},
			rules: {

			},
			searchData: {}
		};
	},
	components: {
		VTslft
	},
	mounted() {

	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let time = '';
					if(this.ruleForm.date != ''){
						time = Date.parse(new Date(this.ruleForm.date)) / 1000;
					}
					var data = {
						'name': this.ruleForm.visitorName,
						'old_name': this.ruleForm.elderName,
						'visit_time': time,
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
	.tslf{
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