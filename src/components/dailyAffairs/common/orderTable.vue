<template>
    <div>
        <el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
            <el-table-column label="老人"  prop="elder.name">
            </el-table-column>
            <el-table-column label="订单状态" prop="status">
            </el-table-column>
            <el-table-column label="开始日期" prop="buy_start_date">
            </el-table-column>
            <el-table-column label="截止日期" prop="buy_end_date">
            </el-table-column>
            <el-table-column label="订购时间" prop="create_time">
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
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
    props: ["searchData"],
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            total: 0,
            last_page: 0,
            loading: false,
            currentPage: 1,
        }
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(val) {
            this.fetchList(val);
        },
        fetchList: async function(val) {
            this.loading = true;
            let url = this.api.orderlist + "?page=" + val;
            var data = this.searchData;
            try {
                const res = await this.$http.post(url, data);
                if (res.data.status_code == 200) {
                    this.tableData = [];
                    this.tableData = res.data.data.data;
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
                this.$alert(this.message.timeOut, "", {
                confirmButtonText: this.message.confirm,
                callback: action => {
                    this.loading = false;
                }
                });
            }
        },
    }
}
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
