<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableDataYY"
      style="width: 100%"
      stripe
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="预约人姓名">
      </el-table-column>
      <el-table-column
        prop="appointment_date"
        label="预约日期">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="relation"
        label="与老人关系">
        <template slot-scope="scope">
          <p>{{relation[scope.row.relation]}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="old_name"
        label="老人姓名">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          <p>{{scope.row.status == 0 ? '已预约' : '已入住'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="id_number"
        label="身份证"
        width="170">
      </el-table-column>
      <el-table-column
        prop="active"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showjdzxManageTrue(scope.row)">
            详情
          </el-button>
          <el-button v-if="scope.row.status == 0" type="text" size="small" @click="goCheckIn(scope.row)">
            转入住
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="fenye">
      <div class="caozuo">
        <el-button type="danger" @click="delyyld">取消预约</el-button>
        <el-button type="success" @click="showEditFalse(0,0)">新增预约</el-button>
      </div>
      <div style="display: flex;margin-right: 20px;float: right;">
        <el-button type="primary" size="small" @click="JdyyManageList(1)">首页</el-button>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
        <el-button type="primary" size="small" @click="JdyyManageList(last_page)">末页</el-button>
      </div>
    </div>
    <v-jdyye :elderid="elderid" :elderList="elderList" :relation="relation" :self_care="self_care" :bedList="bedList"></v-jdyye>
  </div>
</template>

<script>
import vJdyye from "./JdyyManageEdit.vue";
export default {
  props: ["searchData"],
  data() {
    return {
      tableDataYY: [],
      multipleSelection: [],
      elderid: 0,
      relation: [],
      self_care: [],
      total: 0,
      last_page: 0,
      bedList: [],
      loading: false,
      builds: [],
      elderList: [],
      currentPage: 1
    };
  },
  components: {
    vJdyye
  },
  watch: {
    searchData() {
      this.JdyyManageList(1);
    }
  },
  mounted() {
    this.JdyyManageList(1);
    this.fetchRelation();
    this.fetchBedNoList();
    this.fetchBuild();
    this.fetchElders();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.JdyyManageList(val);
    },
    JdyyManageList: async function(val) {
      this.loading = true;
      let url = this.api.jdyydjlist + "?page=" + val;
      let data = this.searchData;
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
          this.tableDataYY = [];
          this.tableDataYY = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.elderid = 0;
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
    showEditFalse(scope, oldVisitBackFlag) {
      this.$store.dispatch("JdyyEditOpen");
      if (scope == 0) {
        this.elderid = 0;
      } else {
        this.elderid = scope.id;
      }
      if (oldVisitBackFlag == 1) {
        this.$store.dispatch("JdyyEditFalseOpen");
      } else {
        this.$store.dispatch("JdyyEditFalseClose");
      }
    },
    showjdzxManageTrue(scope) {
      this.$store.dispatch("JdyyEditOpen");
      this.$store.dispatch("JdyyEditFalseOpen");
      this.elderid = scope.id;
    },
    clean() {
      this.elderid = 0;
    },
    goCheckIn: async function(scope) {
      let url = this.api.appointmentmovein;
      var data = {
        id: scope.id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.$store.dispatch("checkinIdSave", res.data.data);
        this.$router.push({ path: `/djgl/rzdj` });
      } else if (res.data.status_code == 400) {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {}
        });
      } else {
        this.$alert(this.message.failTurnin, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {}
        });
      }
    },
    JdyyManageDel: async function(YyoldId) {
      let url = this.api.delyydjdjlist;
      var data = {
        id: YyoldId
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.$notify({
          title: this.message.success,
          message: this.message.cancelOrderSuccess,
          type: "success"
        });      
        this.JdyyManageList(1);
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {}
        });
      }
    },
    delyyld() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceRecordToCancel, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherCancelAppoint, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arrdel = this.multipleSelection;
            for (let k = 0; k < id_arrdel.length; k++) {
              let delid = id_arrdel[k].id;
              data.push(delid);
            }
            this.JdyyManageDel(data);
          })
          .catch(() => {});
      }
    },
    fetchRelation: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_FAMILY_ELATION,
          this.data.HEALTH_SELF_CARE_ABILITY
        ]
      };
      const res = await this.$http.post(url, data);
      this.relation = res.data.data[this.data.BEADHOUSE_FAMILY_ELATION];
      this.self_care = res.data.data[this.data.HEALTH_SELF_CARE_ABILITY];
    },
    fetchBedNoList: async function() {
      let url = this.api.bednolist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.bedList = res.data.data;
    },
    fetchBuild: async function() {
      let url = this.api.buildingcodelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.builds = res.data.data;
    },
    fetchElders: async function() {
      let url = this.api.searchelders;
      var data = {
        type: 4
      };
      const res = await this.$http.post(url, data);
      this.elderList = res.data.data;
    }
  }
};
</script>

<style scoped>
.fenye {
  margin: 20px 0 10px;
  margin-bottom: 20px;
  overflow: hidden;
  padding: 0 20px;
}
.caozuo {
  float: left;
  overflow: hidden;
}
.caozuo a {
  display: block;
  float: left;
  min-width: 90px;
  text-align: center;
  padding: 0 10px;
  line-height: 40px;
  background: #eee;
  border-radius: 4px;
  margin-right: 20px;
  color: #000;
  font-size: 12px;
}
.caozuo a:hover {
  background: #ff8777;
  color: white;
}
</style>
