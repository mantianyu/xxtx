<template>
    <el-container style="height: 100%;background: #ffffff;">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
                <h5>任务统计</h5>
                <div class="find">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
						<div style="margin-left: 10px">
							<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
						</div>
					</el-form>
				</div>
            </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <v-tasksum :searchData="searchData"></v-tasksum>      
            </el-scrollbar>
        </el-main>
  </el-container>
</template>

<script>
import vTasksum from './common/RWTJTable.vue';
export default {
	data() {
		return {
			ruleForm: {
				nurse_id: '',
				elder_id: '',
			},
			rules: {},
			searchData: {},
			loading: false,
			tableData: [],
			name: '',
			elder: '',
			nurArr: [],
			eldArr: [],
		};
	},
	components: {
		vTasksum,
	},
	mounted() {
		this.change();
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
						nurse_id: this.ruleForm.nurse_id,
						elder_id: this.ruleForm.elder_id,
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
	margin: 0;
}
</style>
