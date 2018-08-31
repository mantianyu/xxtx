<template>
    <div class="table">
        <el-table v-loading="loading" :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="eldername" label="老人姓名">
            </el-table-column>
            <el-table-column prop="bednumber" label="床位号">
            </el-table-column>
            <el-table-column prop="accidenttime" label="发生时间">
            </el-table-column>
            <el-table-column prop="nursingname" label="护理小组名称">
            </el-table-column>
            <el-table-column prop="typename" label="事故类型">
            </el-table-column>
            <el-table-column prop="accidentlevel" label="事故等级">
                <template slot-scope="scope">
                    <p>{{accident[scope.row.accidentlevel]}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="accidentreason" label="事故原因">
            </el-table-column>
            <el-table-column prop="name" label="负责人">
            </el-table-column>
            <el-table-column prop="accidentintroduction" label="事故描述">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showEditFalse(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="showEditTrue(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
            <div>
                <el-button type="danger" @click="delMore">删除</el-button>
                <el-button type="success" @click="showEditFalse(0)">添加记录</el-button>
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
        <v-esgjl :oldAccidentId="oldAccidentId" :accident="accident" :accidentList="accidentList" :elders="elders" :nursesTeam="nursesTeam"></v-esgjl>
    </div>
</template>

<script>
import vEsgjl from "./editSgjl.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      oldAccidentId: 0,
      accident: [],
      accidentList: [],
      total: 0,
      last_page: 0,
      loading: false,
      elders: [],
      nursesTeam: [],
      currentPage: 1
    };
  },
  components: {
    vEsgjl
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchAccidentList();
    this.fetchAccident();
    this.fetchElders();
    this.fetchNursTeam();
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
      let url = this.api.accidentlist + "?page=" + val;
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
          this.oldAccidentId = 0;
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
    showEditFalse(scope) {
      this.$store.dispatch("oldAccidentTrue");
      this.$store.dispatch("oldAccidentEditFalse");
      if (scope == 0) {
        this.oldAccidentId = 0;
      } else {
        this.oldAccidentId = scope.accidentid;
      }
    },
    showEditTrue(scope) {
      this.$store.dispatch("oldAccidentTrue");
      this.$store.dispatch("oldAccidentEditTrue");
      this.oldAccidentId = scope.accidentid;
    },
    clean() {
      this.oldAccidentId = 0;
    },
    delOldOutList: async function(id) {
      let url = this.api.accidentdel;
      var data = {
        accidentid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteSuccess,
              type: "success"
            });
          this.fetchList();
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
              let accidentid = id_arr[k].accidentid;
              data.push(accidentid);
            }
            this.delOldOutList(data);
          })
          .catch(() => {});
      }
    },
    fetchAccident: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_ACCIDENT_LEVEL
      };
      const res = await this.$http.post(url, data);
      this.accident = res.data.data;
    },
    fetchNursTeam: async function() {
      let url = this.api.getnursegrouplist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.nursesTeam = res.data.data;
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    fetchAccidentList: async function() {
      let url = this.api.accidenttypelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.accidentList = res.data.data.data;
    },
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