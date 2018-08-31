<template>
	<div class="table">
		<el-table
        	v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="护工">
		    </el-table-column>
		    <el-table-column
		      prop="score"
		      label="总积分">
		    </el-table-column>
            <el-table-column
				prop="address"
				label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="checkRecord(scope.row)">查看记录</el-button>
				</template>
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
import { mapState } from "vuex";

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
    };
  },
  components: {
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
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
      let url = this.api.getnursescores + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
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
    checkRecord(scope){
      this.$router.push({name: 'JFJL',params:{ id:scope.id}})
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
a {
  color: #606266;
}
</style>