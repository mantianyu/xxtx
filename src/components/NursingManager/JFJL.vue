<template>
    <el-container style="height: 100%;background: #ffffff;">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
                <h5>积分记录</h5>
                <div class="find">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="记录时间" prop="start_time" label-width="100px">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.start_time"></el-date-picker>
            </el-form-item>
                <b style="margin-left: 5px;margin-right: 5px;">~</b>
            <el-form-item label="" prop="end_time" label-width="0">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.end_time"></el-date-picker>
            </el-form-item>
            <el-form-item label="护工:" prop="name">
                <el-select v-model="ruleForm.nurse_id" clearable filterable placeholder="请选择护工" style="width: 140px;" size="small">
                    <el-option @input="change()"
                    v-for="(nur, key) in nurArr"
                    :key="key"
                    :label="nur.name"
                    :value="nur.id">
                    </el-option>
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
                <v-record :searchData="searchData"></v-record>     
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script>
import vRecord from './common/JFJLTable.vue';

export default {
	data() {
		var startdate = (rule, value, callback) => {
			if (Date.parse(new Date(this.ruleForm.end_time)) < Date.parse(new Date(value))) {
				callback(new Error(this.message.EndTimeWarning));
			}
			callback();
		};
		var enddate = (rule, value, callback) => {
			if (Date.parse(new Date(this.ruleForm.start_time)) > Date.parse(new Date(value))) {
				callback(new Error(this.message.EndTimeWarning));
			}
			callback();
		};
		return {
			date: '',
			ruleForm: {
				start_time: '',
				end_time: '',
				nurse_id: '',
			},
			rules: {
				start_time: [{ validator: startdate, trigger: 'change' }],
				end_time: [{ validator: enddate, trigger: 'change' }],
			},
			name: '',
			nurArr: [],
			searchData: {},
		};
	},
	components: {
		vRecord,
	},
	created() {
		this.ruleForm.nurse_id = this.$route.params.id;
		var data = {
			date: this.ruleForm.date,
			nurse_id: this.ruleForm.nurse_id,
			start_time: this.ruleForm.start_time ? Date.parse(new Date(this.ruleForm.start_time)) / 1000 : '',
			end_time: this.ruleForm.end_time ? Date.parse(new Date(this.ruleForm.end_time)) / 1000 : '',
		};
		this.searchData = data;
	},
	mounted() {
		this.change();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = {
						date: this.ruleForm.date,
						nurse_id: this.ruleForm.nurse_id,
						start_time: this.ruleForm.start_time
							? Date.parse(new Date(this.ruleForm.start_time)) / 1000
							: '',
						end_time: this.ruleForm.end_time ? Date.parse(new Date(this.ruleForm.end_time)) / 1000 : '',
					};
					this.searchData = data;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		change: async function() {
			let url = this.api.gettasknurses;
			let data = {};
			const res = await this.$http.post(url, data);
			this.nurArr = res.data.data;
		},
	},
};
</script>

<style scoped>
.top-tit {
	padding: 20px;
	border-bottom: 1px solid #ddd;
	overflow: hidden;
}
.top-tit h5 {
	color: #ff8777;
	font-weight: normal;
	float: left;
	line-height: 30px;
	margin: 0;
	font-size: 18px;
}
.demo-ruleForm {
	display: flex;
}
.find form {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
}
.el-form-item {
	margin: 0;
}
</style>