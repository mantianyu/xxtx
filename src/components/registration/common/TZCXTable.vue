<template>
	<div class="table">
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
		      prop="old_name"
		      label="老人姓名">
		    </el-table-column>
		    <el-table-column
		      prop="id_number"
		      label="身份证号"
          width="170">
		    </el-table-column>
		    <el-table-column
		      prop="check_in_time"
		      label="入住时间">
		    </el-table-column>
		    <el-table-column
		      prop="check_out_date"
		      label="退住时间">
		    </el-table-column>
        <el-table-column
          prop="type"
          label="退住形式">
        </el-table-column>
        <el-table-column
          prop="reason"
          label="出院原因">
        </el-table-column>
        <el-table-column
          prop="employees_name"
          label="登记人">
        </el-table-column>
        <el-table-column
          prop="finish_time"
          label="登记时间">
        </el-table-column>
        <el-table-column
          label="评价"
          width="160">
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row.elder_score"
                disabled
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
              </el-rate>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="showCheckOut(scope.row)">老人信息详情</el-button>
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
    <v-etzdj :oldCheckOutId="oldCheckOutId" :checkOut="checkOut" :isEdit="true"></v-etzdj>
	</div>
</template>

<script>
import vEtzdj from "./editTzdj.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      oldCheckOutId: 0,
      checkOut: [],
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vEtzdj
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchCheckOut();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.eldercheckoutdetaillist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.oldCheckOutId = 0;
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
    fetchCheckOut: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_CHECK_OUT_TYPE
      };
      const res = await this.$http.post(url, data);
      this.checkOut = res.data.data;
    },
    showCheckOut(scope) {
      this.oldCheckOutId = scope.check_out_id;
      this.$store.dispatch("oldCheckOutTrue");
    },
    clean() {
      this.oldCheckOutId = 0;
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