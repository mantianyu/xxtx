<template>
    <div  class="isZDXQ" v-show="isZDXQ">
		<el-container class="pop">
			<el-header style="height: auto;">
        <div class="pop-top">
          <h5>账单详情</h5>
          <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <div class="qxz">
          <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              type="index"
              width="55">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="项目费用">
            </el-table-column>
            <el-table-column
              prop="time"
              label="消费时间">
            </el-table-column>
            <el-table-column
              prop="fee_name"
              label="费用性质">
            </el-table-column>
            <el-table-column
              prop="introduction"
              label="备注">
            </el-table-column>
            <el-table-column
              prop="employee_name"
              label="员工名">
            </el-table-column>
          </el-table>
          <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
            <div></div>
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
				</el-scrollbar>
			</el-main>
		</el-container>
    </div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["ZDXQId"],
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
    ZDXQId() {
      if (this.ZDXQId != 0) {
        this.fetchList(1);
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    hideEditFalse() {
      this.$store.dispatch("isZDXQFalse");
      this.$parent.clean();
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.billdetail + '?page=' + val;
      var data = {
        bill_id: this.ZDXQId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    }
  },
  computed: mapState(["isZDXQ"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -400px;
}
.pop-top {
  border-bottom: 1px #e5e5e5 solid;
  padding: 0 20px;
  overflow: hidden;
  background: #f2f2f2;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  z-index: 99;
}
.pop-top h5 {
  float: left;
  font-weight: normal;
  font-size: 16px;
  line-height: 50px;
  margin: 0;
}
.pop-top span {
  float: right;
  cursor: pointer;
  display: block;
  width: 12px;
  height: 12px;
  margin-top: 20px;
}
.qxz {
  padding: 40px;
  margin-top: 25px;
  padding-top: 0;
}
.isZDXQ {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
