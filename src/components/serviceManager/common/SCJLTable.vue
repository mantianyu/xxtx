<template>
	<div class="table">
		<el-table
			v-loading="loading"
			:data="tableData"
			stripe
			style="width: 100%">
			<el-table-column
			  type="index"
			  width="50">
			</el-table-column>
			<el-table-column
			  prop="elders_name"
			  label="老人姓名">
			</el-table-column>
			<el-table-column
			  prop="id_number"
			  label="身份证号">
			</el-table-column>
			<el-table-column
			  prop="employees_name"
			  label="送餐人员">
			</el-table-column>
			<el-table-column
			  prop="areas_name"
			  label="区域名称">
			</el-table-column>
			<el-table-column
			  prop="date_time"
			  label="送餐时间">
			</el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: flex-end;">
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
	  total: 0,
	  last_page: 0,
	  loading: false,
	  currentPage: 1
	};
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
	handleCurrentChange(val) {
	  this.fetchList(val);
	},
	fetchList: async function(val) {
	  this.loading = true;
	  let url = this.api.foodorderslist + "?page=" + val;
	  var data = this.searchData;
	  try {
		const res = await this.$http.post(url, data);
		if (res.data.status_code == 200) {
			if (res.data.data.data.length == 0) {
				this.$notify({
					title: this.message.hint,
					message: this.message.informationNoExist,
					type: "warning"
				});
			} else {
				this.$notify({
					title: this.message.success,
					message: `为您搜索到${res.data.data.total}条信息`,
					type: "success"
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
		this.$alert(this.message.timeOut, "", {
		  confirmButtonText: this.message.confirm,
		  callback: action => {
			this.loading = false;
		  }
		});
	  }
	}
  }
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>