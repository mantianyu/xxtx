<template>
  <el-container style="height: 100%;background: #ffffff;" v-loading="loading">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>系统设置</h5>
	    </div>
    </el-header>
    <el-main style="position: relative;">
        <el-scrollbar class="scrollbar" style="width: 30%;height: 100%;overflow-x: hidden;position: absolute;left: 50%;top: 0;margin-left: -15%;">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="就餐积分：" style="margin-top: 20px;">
                    <el-input-number v-model="form.Dining_Integral" style="width: 200px;" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="用药积分：" style="margin-top: 20px;">
                    <el-input-number v-model="form.Medication_Integral" style="width: 200px;" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="早茶：" style="margin-top: 20px;">
                    <el-time-select
                        style="width: 200px;"
                        v-model="form.MORNING_TEA"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="早饭：" style="margin-top: 20px;">
                    <el-time-select
                        style="width: 200px;"
                        v-model="form.BREAKFAST"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="午饭：" style="margin-top: 20px;">
                    <el-time-select
                        style="width: 200px;"
                        v-model="form.LUNCH"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="下午茶：" style="margin-top: 20px;">
                    <el-time-select
                        style="width: 200px;"
                        v-model="form.AFTERNOON_TEA"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="晚饭：" style="margin-top: 20px;">
                    <el-time-select
                        style="width: 200px;"
                        v-model="form.DINNER"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="夜宵：" style="margin-top: 20px;">
                    <el-time-select
                        style="width: 200px;"
                        v-model="form.SUPPER"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '24:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <div style="margin-top: 30px;display:flex;justify-content: center;">
                    <el-button type="danger" size="medium" :loading="bLoading" @click="submitForm('form')">确认</el-button>
                </div>
            </el-form>
        </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
export default {
	data() {
		return {
			form: {
				Dining_Integral: '',
				Medication_Integral: '',
				MORNING_TEA: '',
				BREAKFAST: '',
				LUNCH: '',
				AFTERNOON_TEA: '',
				DINNER: '',
				SUPPER: '',
			},
			loading: false,
			bLoading: false,
		};
	},
	components: {},
	mounted() {
		this.fetchDetail();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.bLoading = true;
					let id = [
						{
							id: 1,
							value: this.form.Dining_Integral,
						},
						{
							id: 2,
							value: this.form.Medication_Integral,
						},
						{
							id: 37,
							value: this.form.MORNING_TEA,
						},
						{
							id: 38,
							value: this.form.BREAKFAST,
						},
						{
							id: 39,
							value: this.form.LUNCH,
						},
						{
							id: 40,
							value: this.form.AFTERNOON_TEA,
						},
						{
							id: 41,
							value: this.form.DINNER,
						},
						{
							id: 42,
							value: this.form.SUPPER,
						},
					];
					this.sysSave(id);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		fetchDetail: async function() {
			this.loading = true;
			let url = this.api.systemDetail;
			let data = {
				id: [1, 2, 37, 38, 39, 40, 41, 42],
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code === 200) {
					for (var id in res.data.data) {
						if (id == 1) {
							this.form.Dining_Integral = res.data.data[id];
						}
						if (id == 2) {
							this.form.Medication_Integral = res.data.data[id];
						}
						if (id == 37) {
							this.form.MORNING_TEA = res.data.data[id];
						}
						if (id == 38) {
							this.form.BREAKFAST = res.data.data[id];
						}
						if (id == 39) {
							this.form.LUNCH = res.data.data[id];
						}
						if (id == 40) {
							this.form.AFTERNOON_TEA = res.data.data[id];
						}
						if (id == 41) {
							this.form.DINNER = res.data.data[id];
						}
						if (id == 42) {
							this.form.SUPPER = res.data.data[id];
						}
						this.$nextTick(() => {
							this.loading = false;
						});
					}
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.loading = false;
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.loading = false;
					},
				});
			}
		},
		sysSave: async function(id) {
			let url = this.api.systemSave;
			let data = {
				id: id,
			};
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code === 200) {
					this.fetchDetail();
					this.bLoading = false;
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						callback: action => {
							this.bLoading = false;
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.bLoading = false;
					},
				});
			}
		},
	},
};
</script>

<style scoped>
.depart {
	background-color: #fff;
	min-height: 100%;
}
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
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.el-form-item {
	margin-bottom: 0;
}
</style>