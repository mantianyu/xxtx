<template>
  <div class="ycglDetail" v-show="ycglDetail">
		<el-container class="pop">
			<el-header style="height: auto;">
          <div class="pop-top">
              <h5>预存管理</h5>
              <span class="pop-close" @click="hideEdit"><i class="el-icon-close"></i></span>
          </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <div class="find" style="display: flex;justify-content: space-around;align-items: center;">
              <el-form :model="form" status-icon :rules="rules" ref="form" label-width="80px" class="demo-ruleForm" style="display: flex;justify-content:center;align-items: center;">
            <el-form-item label="时间" prop="start_time" label-width="100px" style="margin: 0;">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="form.start_time"></el-date-picker>
            </el-form-item>
                <b style="margin-left: 5px;margin-right: 5px;">~</b>
            <el-form-item label="" prop="end_time" label-width="0" style="margin: 0;">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="form.end_time"></el-date-picker>
            </el-form-item>
                <div style="margin-left: 10px">
                  <el-button type="danger" size="small" @click="submitForm('form')">查询</el-button>
                </div>
              </el-form>
              <div>
                账户余额：{{imprests}}元
              </div>
            </div>
            <div>
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
                  prop="amount"
                  label="预存金额">
                </el-table-column>
                <el-table-column
                  prop="created_at"
                  label="收费时间">
                </el-table-column>
                <el-table-column
                  prop="employee_name"
                  label="收费员">
                </el-table-column>
                <el-table-column
                  prop="caption"
                  label="说明">
                </el-table-column>
                <el-table-column
                  prop="method"
                  label="交费方式">
                  <template slot-scope="scope">
                    <p>{{methods[scope.row.method]}}</p>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remarks"
                  label="备注">
                </el-table-column>
              </el-table>
              <div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: flex-end;">
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
  props: ["imprests", "checkinId", "methods"],
  data() {
    var startdate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.form.end_time)) < Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    var enddate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.form.start_time)) > Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    return {
      form: {
        start_time: "",
        end_time: ""
      },
      rules: {
        start_time: [{ validator: startdate, trigger: "change" }],
        end_time: [{ validator: enddate, trigger: "change" }]
      },
      tableData: [],
      total: 0,
      last_page: 0,
      loading: false,
      currentPage: 1,
      searchData: {
        id: this.checkinId
      }
    };
  },
  watch: {
    checkinId() {
      if (this.checkinId !== 0) {
        this.searchData = {
          id: this.checkinId
        };
        this.fetchList(1);
      }
    },
    searchData() {
      this.fetchList(1);
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var start_time;
          var end_time;
          if (this.form.start_time == "" || this.form.start_time == null) {
            start_time = "";
          } else {
            start_time = this.form.start_time.getTime() / 1000;
          }
          if (this.form.end_time == "" || this.form.end_time == null) {
            end_time = "";
          } else {
            end_time = this.form.end_time.getTime() / 1000;
          }
          var data = {
            start_time: start_time,
            end_time: end_time,
            id: this.checkinId
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEdit() {
      this.$store.dispatch("ycglDetailFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.detailImpredetail + "?page=" + val;
      var data = this.searchData;
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
              this.hideEdit();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEdit();
          }
        });
      }
    }
  },
  computed: mapState(["ycglDetail"])
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
.ycglDetail {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>