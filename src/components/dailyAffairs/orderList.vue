<template>
    <el-container style="height: 100%;background: #ffffff;">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
                <h5>订单列表</h5>
                <div class="find">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="老人:" prop="elder">
                            <el-select v-model="ruleForm.elder_id" clearable filterable placeholder="请选择老人" style="width: 140px;" size="small">
                                <el-option @input="changeelder()"
                                v-for="(eld, key) in eldArr"
                                :key="key"
                                :label="eld.name"
                                :value="eld.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态:" prop="status">
                            <el-select v-model="ruleForm.status_no" clearable filterable placeholder="请选择订单状态" style="width: 140px;" size="small">
                                <el-option @input="changestatus()"
                                v-for="sta in statusArr"
                                :key="sta.id"
                                :label="sta.value"
                                :value="sta.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订购日期：" prop="startTime" label-width="100px">
                            <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.start_time"></el-date-picker>
                        </el-form-item>
                            <b style="margin-left: 5px;margin-right: 5px;">~</b>
                        <el-form-item label="" prop="endTime" label-width="0">
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
import VOrder from './common/orderTable.vue';

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
				elder_id: '',
				status_no: '',
				start_time: '',
				end_time: '',
			},
			rules: {
				start_time: [{ validator: startdate, trigger: 'change' }],
				end_time: [{ validator: enddate, trigger: 'change' }],
			},
			searchData: {},
			eldArr: [],
			statusArr: [
				{
					id: -8,
					value: '退款拒绝',
				},
				{
					id: -7,
					value: '退款中',
				},
				{
					id: -6,
					value: '订单已转出',
				},
				{
					id: -5,
					value: '待确认转移',
				},
				{
					id: -4,
					value: '已关闭',
				},
				{
					id: -3,
					value: '已退款',
				},
				{
					id: -2,
					value: '审核失败',
				},
				{
					id: -1,
					value: '已取消',
				},
				{
					id: 0,
					value: '待审核',
				},
				{
					id: 1,
					value: '已审核待支付',
				},
				{
					id: 2,
					value: '支付成功',
				},
				{
					id: 3,
					value: '服务开始',
				},
				{
					id: 4,
					value: '服务完成',
				},
			],
		};
	},
	components: {
		VOrder,
	},
	mounted() {
		this.changeelder();
	},
	methods: {
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = {
						elder_id: this.ruleForm.elder_id,
						status_no: this.ruleForm.status_no,
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
		width: 500px;
		justify-content: flex-start;
	}
}
</style>
