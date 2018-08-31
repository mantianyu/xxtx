<template>
	<div class="table">
		<el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="index"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="eldername"
		      label="老人姓名">
		    </el-table-column>
		    <el-table-column
		      prop="bednum"
		      label="床号">
		    </el-table-column>
		    <el-table-column
		      prop="majordiseases"
		      label="疾病">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
        <el-button type="success" @click="showAdd(0)">新增</el-button>
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
	    <v-drugset :elderId="elderId" :eatDrugTime="eatDrugTime" :noEdit="noEdit" :elders="elders" :elderBed="elderBed" :checkin_id="checkin_id"></v-drugset>
	</div>
</template>

<script>
import vDrugset from "./addDrugSet.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      elderId: 0,
      total: 0,
      last_page: 0,
      diseases: [],
      eatDrugTime: [],
      noEdit: false,
      elders: [],
      loading: false,
      elderBed: "",
      currentPage: 1,
      checkin_id:0,
    };
  },
  components: {
    vDrugset
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchDiseases();
    this.fetchElders();
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
      let url = this.api.elderset + "?page=" + val;
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
          this.elderId = 0;
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
    },
    showAdd(scope) {
      this.$store.dispatch("addDrugSetTrue");
      if (scope != 0) {
        this.elderId = scope.elderid;
        this.elderBed = scope.bednum;
        this.noEdit = true;
        this.checkin_id = scope.checkin_id;
      } else {
        this.elderId = 0;
        this.noEdit = false;
      }
    },
    clean() {
      this.elderId = 0;
      this.checkin_id = 0;
    },
    fetchDiseases: async function() {
      let url = this.api.data;
      var data = {
        group: [this.data.HEALTH_DISEASES, this.data.BEADHOUSE_MEDICATION_TIME]
      };
      const res = await this.$http.post(url, data);
      this.diseases = res.data.data[this.data.HEALTH_DISEASES];
      this.eatDrugTime = res.data.data[this.data.BEADHOUSE_MEDICATION_TIME];
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
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