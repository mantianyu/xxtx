<template>
    <div>
        <el-table v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
            <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
            <el-table-column prop="id" label="编号">
            </el-table-column>
            <el-table-column prop="name" label="房间名称">
            </el-table-column>
            <el-table-column prop="bed_monthly_market_price" label="促销价" >
            </el-table-column>
            <el-table-column prop="bed_monthly_price" label="原价">
            </el-table-column>
            <el-table-column prop="rest_count" label="上限库存" >
            </el-table-column>
            <el-table-column prop="count" label="真实库存" >
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showchange(scope.row)">编辑</el-button>
                    <!-- <el-button type="text" size="small" @click="elderGoOut()">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <!-- <el-button type="danger" @click="exportList">导出</el-button> -->
          </div>
          <div style="display: flex;margin-right: 20px;">
            <el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="total">
            </el-pagination>
            <el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
          </div>
        </div>
        <v-changebed v-if="showChangeBed" :scope="scope"></v-changebed>
    </div>
</template>

<script>
import vChangebed from "./JGGLInfo.vue"

export default {
    data() {
        return {
            tableData: [],
            total: 0,
            last_page: 0,
            loading: false,
            currentPage: 1,
            showChangeBed: false,
            scope: 0
        }
    },
    components: {
        vChangebed
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
            let url = this.api.getbedtypelist + "?page=" + val;
            var data = this.searchData;
            try {
                const res = await this.$http.post(url, data);
                if (res.data.status_code == 200) {
                this.tableData = res.data.data.data;
                this.total = res.data.data.total;
                this.last_page = res.data.data.last_page;
                this.$nextTick(() => {
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
        showchange(scope){
            this.showChangeBed = true;
            this.scope = scope;
        }
    }
}
</script>

<style scoped>

</style>
