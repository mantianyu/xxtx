<template>
    <el-container style="height: 100%;background: #ffffff;">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
                <h5>服务记录</h5>
                <div class="find">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="订单号：" prop="orderId">
                            <el-input type="text" v-model="ruleForm.orderId" style="width:180px" size="small" auto-complete="off"></el-input>
                        </el-form-item>
						<el-form-item label="老人:" prop="elder_id">
                            <el-select v-model="ruleForm.elder_id" clearable filterable placeholder="请选择老人" style="width: 140px;" size="small">
                                <el-option @input="changeelder()"
                                v-for="(eld, key) in eldArr"
                                :key="key"
                                :label="eld.name"
                                :value="eld.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="记录日期：" prop="start_time" label-width="100px">
                            <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.start_time"></el-date-picker>
                        </el-form-item>
                            <b style="margin-left: 5px;margin-right: 5px;">~</b>
                        <el-form-item label="" prop="end_time" label-width="0">
                            <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.end_time"></el-date-picker>
                        </el-form-item>
						<div style="margin-left: 10px">
                            <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
                        </div>
					</el-form>
				</div>
            </div>
        </el-header>
        <el-main>
            <v-order :searchData="searchData"></v-order>
        </el-main>
    </el-container>
</template>

<script>
import VOrder from './common/FWJLTable.vue';

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
			ruleForm: {
				orderId: '',
				elder_id: '',
				start_time: '',
				end_time: '',
			},
			rules: {
				start_time: [{ validator: startdate, trigger: 'change' }],
				end_time: [{ validator: enddate, trigger: 'change' }],
			},
			searchData: {},
			eldArr: [],
		};
	},
	components: {
		VOrder,
	},
	created() {
		this.ruleForm.elder_id = this.$route.params.elderId;
		var data = {
			order_sn: this.ruleForm.orderId,
			elder_id: this.ruleForm.elder_id,
			start: this.ruleForm.start_time ? Date.parse(new Date(this.ruleForm.start_time)) / 1000 : '',
			end: this.ruleForm.end_time ? Date.parse(new Date(this.ruleForm.end_time)) / 1000 : '',
		};
		this.searchData = data;
	},
	mounted() {
		this.changeelder();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = {
						order_sn: this.ruleForm.orderId,
						elder_id: this.ruleForm.elder_id,
						start: this.ruleForm.start_time ? Date.parse(new Date(this.ruleForm.start_time)) / 1000 : '',
						end: this.ruleForm.end_time ? Date.parse(new Date(this.ruleForm.end_time)) / 1000 : '',
					};
					this.searchData = data;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		changeelder: async function() {
			let url = this.api.gettaskelders;
			let data = {};
			const res = await this.$http.post(url, data);
			this.eldArr = res.data.data;
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
	margin-bottom: 0;
}
@media screen and (max-width: 1380px) {
	.find {
		display: flex;
		justify-content: flex-end;
	}
	.find form {
		width: 510px;
		justify-content: flex-start;
	}
}
</style>
