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
            prop="eldername" 
            label="老人姓名">
            </el-table-column>
            <el-table-column 
            prop="bedname" 
            label="床位号">
            </el-table-column>
            <el-table-column
                    prop="entourage_name"
                    label="陪同人员姓名">
            </el-table-column>
            <el-table-column
                    prop="entourage_phone"
                    label="陪同人员电话">
            </el-table-column>
            <el-table-column
                    prop="out_time"
                    label="外出时间">
            </el-table-column>
            <el-table-column
                    prop="plan_back_time"
                    label="计划返回时间">
            </el-table-column>
            <el-table-column
                    prop="back_time"
                    label="实际返回时间">
            </el-table-column>
            <el-table-column
                    prop="reason"
                    label="外出原因">
            </el-table-column>
            <el-table-column
                    prop="is_back"
                    label="是否返回">
                <template slot-scope="scope">
                    <p>{{ scope.row.is_back === 0 ? '未返回':'已返回' }}</p>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <!-- <el-button v-if="scope.row.is_back == 0" type="text" size="small" @click="showEditFalse(scope.row,1)">修改</el-button> -->
                    <el-button type="text" size="small" @click="showEditTrue(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
            <div>
                <el-button type="danger" @click="delMore">删除</el-button>
                <el-button type="success" @click="showEditFalse(0,0)">登记外出</el-button>
                <el-button type="primary" @click="comeBack">登记返回</el-button>
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
        <v-ewcdj :oldOutId="oldOutId" :elders="elders" :emps="emps"></v-ewcdj>
    </div>
</template>

<script>
// oldOutBackFlag: 控制oldOutBack  0 不控制  1 控制

import vEwcdj from "./editWcdj.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      oldOutId: 0,
      total: 0,
      last_page: 0,
      elders: [],
      loading: false,
      emps: [],
      currentPage: 1
    };
  },
  components: {
    vEwcdj
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchElders();
    this.fetchEmps();
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
      let url = this.api.findoutregistrations + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.page_count;
          this.oldOutId = 0;
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
    showEditFalse(scope, oldOutBackFlag) {
      this.$store.dispatch("oldOutEditTrue");
      this.$store.dispatch("oldOutFalse");
      if (scope == 0) {
        this.oldOutId = 0;
      } else {
        this.oldOutId = scope.oid;
      }
      if (oldOutBackFlag == 1) {
        this.$store.dispatch("oldOutEditBackTrue");
      } else {
        this.$store.dispatch("oldOutEditBackFalse");
      }
    },
    showEditTrue(scope) {
      this.$store.dispatch("oldOutEditTrue");
      this.$store.dispatch("oldOutTrue");
      this.$store.dispatch("oldOutEditBackTrue");
      this.oldOutId = scope.oid;
    },
    delOldOutList: async function(id) {
      let url = this.api.deleteoutregistrations;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.fetchList(1);
          this.fetchElders();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceDelete, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherDelete, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let oid = id_arr[k].oid;
              data.push(oid);
            }
            this.delOldOutList(data);
          })
          .catch(() => {});
      }
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {
        type: 2
      };
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    fetchEmps: async function() {
      let url = this.api.getnuringemployeelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.emps = res.data.data;
    },
    clean() {
      this.oldOutId = 0;
    },
    comeBack(){
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceReturnRecord, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherReturn, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let oid = id_arr[k].oid;
              data.push(oid);
            }
            this.goBackElder(data);
          })
          .catch(() => {});
      }
    },
    goBackElder: async function(id){
      let url = this.api.addoutregistrations;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.fetchList(1);
          this.fetchElders();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
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
