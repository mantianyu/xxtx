<template>
    <div>
        <el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @expand-change="expandDetail">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <p>位置：{{ scope.row.children.position ? scope.row.children.position : '' }}</p>
                    <p>内容：{{ scope.row.children.content ? scope.row.children.content : '' }}</p>
                    <div v-if="scope.row.children.data">
                        <img v-for="(url, key) in scope.row.children.data" :key="key" style="width: 150px;float:left;" :src="url">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="订单号"  prop="order_sn">
            </el-table-column>
            <el-table-column label="老人"  prop="elder_name">
            </el-table-column>
            <el-table-column label="服务护工" prop="nurse_name">
            </el-table-column>
            <el-table-column label="服务时间" prop="created_at">
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
            let url = this.api.bankServeList + "?page=" + val;
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
                this.$alert(this.message.timeOut, "", {
                confirmButtonText: this.message.confirm,
                callback: action => {
                    this.loading = false;
                }
                });
            }
        },
        expandDetail(val){
            this.fetchDetail(val);
        },
        fetchDetail: async function(val){
            let url = this.api.serveDetail;
            let data = {
                id: val.id
            }
            const res = await this.$http.post(url, data);
            this.$set(val,"children",res.data.data);
        }
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
