<template>
    <div>
        <el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%">
            <el-table-column label="服务老人"  prop="elder_name">
            </el-table-column>
            <el-table-column label="订单号" prop="order_sn">
            </el-table-column>
            <el-table-column label="订购人" prop="buyer">
            </el-table-column>
            <el-table-column label="联系电话" prop="contact_phone">
            </el-table-column>
            <el-table-column label="应服务天数"  prop="service_days">
            </el-table-column>
            <el-table-column label="完成天数"  prop="finish_days">
            </el-table-column>
            <el-table-column label="未达标天数" prop="fail_days">
            </el-table-column>
            <el-table-column label="完成率" prop="finish_percent">
            </el-table-column>
            <el-table-column label="达标率" prop="success_percent">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showPop(scope.row.elder_id)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
                <el-button type="danger" @click="exportList">导出</el-button>
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
    </div>
    
</template>

<script>
export default {
	props: ['searchData'],
	data() {
		return {
			tableData: [],
			total: 0,
			last_page: 0,
			loading: false,
			currentPage: 1,
		};
	},
	mounted() {
		this.fetchList(1);
	},
	watch: {
		searchData() {
			this.fetchList(1);
		},
	},
	methods: {
		handleCurrentChange(val) {
			this.fetchList(val);
		},
		fetchList: async function(val) {
			this.loading = true;
			let url = this.api.bankServe + '?page=' + val;
			var data = this.searchData;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
					this.tableData = [];
					this.tableData = res.data.data.list;
					this.total = res.data.data.total;
					this.last_page = res.data.data.last_page;
					this.accidentTypeId = 0;
					this.$nextTick(function() {
						this.loading = false;
						this.currentPage = val;
					});
				} else {
					this.loading = false;
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
		showPop(id) {
			this.$router.push({ name: 'FWJL', params: { elderId: id } });
		},
		exportList: async function() {
			let url = this.api.serveExport;
			var data = this.searchData;
			const res = await this.$http.post(url, data);
			if (res.data.status_code == 200) {
				window.open(res.data.data);
			} else {
				this.$alert(res.data.data, '', {
					confirmButtonText: this.message.confirm,
					center: true,
					callback: action => {},
				});
			}
		},
	},
};
</script>

<style scoped>
.table-expand {
	font-size: 0;
}
.table-expand label {
	width: 90px;
	color: #99a9bf !important;
}
.table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}
</style>
