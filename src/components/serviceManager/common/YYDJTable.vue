<template>
	<div class="table">
		<div class="find" style="margin-top: 10px;margin-right: 30px;">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
				<el-form-item label="老人姓名" prop="eldername" style="margin: 0;">
					<el-input type="text" v-model="ruleForm.eldername" style="width:100px" size="small" auto-complete="off"></el-input>
				</el-form-item>
				<div style="margin-left: 10px">
					<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
				</div>
			</el-form>
		</div>
		<el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%">
		    <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="eldername"
		      label="老人姓名">
		      <template slot-scope="scope">
		      	<router-link :to="{ path: '/fwgl/yydj/drugdjt/' + scope.row.elderid}">
              		{{scope.row.eldername}}
            	</router-link>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="bednum"
		      label="床号">
		    </el-table-column>
		    <el-table-column
		      prop="martime"
		      label="用药日期">
		    </el-table-column>
		    <el-table-column
		      prop="isprovisionality"
		      label="用药类型">
		      <template slot-scope="scope">
		      	<p>{{scope.row.isprovisionality == 0 ? '常规用药':'临时用药'}}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="employeename"
		      label="登记人">
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
        <el-button type="success" @click="showAlways">常规用药登记</el-button>
        <el-button type="success" @click="showInterim">临时用药登记</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination
				  background
				  @current-change="handleCurrentChange"
					    :current-page="currentPage"
				  layout="prev, pager, next"
				  :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
	    </div>
	    <v-interim :elders="elders"></v-interim>
	    <v-always :elders="elders"></v-always>
	</div>
</template>

<script>
import vAlways from './addAlways.vue';
import vInterim from './addInterim.vue';

export default {
	data() {
		return {
			ruleForm: {
				eldername: '',
			},
			rules: {},
			tableData: [],
			total: 0,
			last_page: 0,
			loading: false,
			elders: [],
			searchData: {},
			currentPage: 1,
		};
	},
	components: {
		vInterim,
		vAlways,
	},
	watch: {
		searchData() {
			this.fetchList(1);
		},
	},
	mounted() {
		this.fetchList(1);
		this.fetchElders();
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					var data = {
						eldername: this.ruleForm.eldername,
					};
					this.searchData = data;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleCurrentChange(val) {
			this.fetchList(val);
		},
		fetchList: async function(val) {
			this.loading = true;
			let url = this.api.medicationrecordalllist + '?page=' + val;
			var data = this.searchData;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					if (res.data.data.data.length == 0) {
						this.$notify({
							title: this.message.hint,
							message: this.message.informationNoExist,
							type: 'warning',
						});
					} else {
						this.$notify({
							title: this.message.success,
							message: `为您搜索到${res.data.data.total}条信息`,
							type: 'success',
						});
					}
					this.tableData = [];
					this.tableData = res.data.data.data;
					this.total = res.data.data.total;
					this.last_page = res.data.data.last_page;
					this.$nextTick(function() {
						this.loading = false;
						this.currentPage = val;
					});
				} else {
					this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
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
		showAlways() {
			this.$store.dispatch('addAlwaysTrue');
		},
		showInterim() {
			this.$store.dispatch('addInterimTrue');
		},
		fetchElders: async function() {
			let url = this.api.getsearchelder;
			var data = {};
			const res = await this.$http.post(url, data);
			this.elders = res.data.data;
		},
	},
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
	background: #ff8777;
	border-color: #ff8777;
}
.find form {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
a {
	color: #ff8777;
}
</style>