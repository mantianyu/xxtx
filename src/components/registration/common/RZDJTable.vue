<template>
    <div>
      <el-table
        v-loading="loading"
        :data="tableDataRZ"
        style="width: 100%"
        stripe
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
          prop="eldergender"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="eldercard"
          label="身份证号码"
        width="170">
        </el-table-column>
        <el-table-column
          prop="ifcheckin"
          label="是否完成登记">
          <template slot-scope="scope">
            <p>{{ scope.row.is_final == 0 ? '未完成' : '完成' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkinstatus"
          label="入住状态">
        </el-table-column>
        <el-table-column
          prop="starttime"
          label="入住开始时间">
        </el-table-column>
        <el-table-column
          prop="createdtime"
          label="登记时间">
        </el-table-column>
        <el-table-column
          prop="active"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <div class="caozuo">
          <el-button type="success" @click="showAdd(0)">新增</el-button>
          <el-button type="danger" @click="delold">删除</el-button>
        </div>
        <div style="display: flex;margin-right: 20px;float: right;">
          <el-button type="primary" size="small" @click="ManageList(1)">首页</el-button>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
          <el-button type="primary" size="small" @click="ManageList(last_page)">末页</el-button>
        </div>
      </div>
      <v-rzdje :inStatus="inStatus" :checkinid="checkinid" :status="status" :elderList="elderList" :national="national" :education="education" :religion="religion" :marital="marital" :living="living" :medical="medical" :income="income" :labour="labour" :blood="blood" :political="political" :retired="retired" :elderType="elderType" :care="care" :isNew="isNew"></v-rzdje>
    </div>
</template>

<script>
import vRzdje from "./rzdjEdit.vue";
import { mapState } from "vuex";

export default {
  props: ["searchData", "inStatus"],
  data() {
    return {
      checkinid: 0,
      total: 0,
      last_page: 0,
      tableDataRZ: [],
      multipleSelection: [],
      national: [],
      education: [],
      religion: [],
      marital: [],
      living: [],
      medical: [],
      income: [],
      labour: [],
      blood: [],
      political: [],
      retired: [],
      elderType: [],
      care: [],
      isNew: false,
      loading: false,
      currentPage: 1,
      elderList: [],
      status: 0
    };
  },
  components: {
    vRzdje
  },
  watch: {
    searchData() {
      this.ManageList(1);
    }
  },
  mounted() {
    this.ManageList(1);
    this.fetchNationality();
    this.fetchElders();
    this.checkinid = this.checkinId;
    if (this.checkinId != 0) {
      this.$store.dispatch("rzdjEditTrue");
      this.isNew = true;
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.ManageList(val);
    },
    ManageList: async function(val) {
      this.loading = true;
      let url = this.api.jdrzdjlist + "?page=" + val;
      let data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if(res.data.data.data.length == 0){
            this.$notify({
              title: this.message.hint,
              message: this.message.informationNoExist,
              type: "warning"
            })
          }else{
            this.$notify({
              title: this.message.success,
              message: `为您搜索到${res.data.data.total}条信息`,
              type: "success"
            })
          }
          this.tableDataRZ = [];
          this.tableDataRZ = res.data.data.data;
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
    },
    deleteAbility: async function(id) {
      let url = this.api.deleldercheckin;
      var data = {
        nlid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
            title: this.message.success,
            message: this.message.deleteCheckinSuccess,
            type: "success"
          });
          this.ManageList(1);
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
    delold() {
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
              let id = id_arr[k].checkinid;
              data.push(id);
            }
            this.deleteAbility(data);
		  })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("rzdjEditTrue");
      if (scope != 0) {
        this.checkinid = scope.checkinid;
        this.status = scope.status;
      } else {
        this.checkinid = 0;
        this.status = 0;
      }
    },
    clean() {
      this.checkinid = 0;
      this.isNew = false;
    },
    fetchNationality: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.PERSON_NATIONALITY,
          this.data.PERSON_EDUCATION,
          this.data.PERSON_RELIGION,
          this.data.PERSON_MARITAL_STATUS,
          this.data.PERSON_LIVING_STATUS,
          this.data.PERSON_MEDICAL_SECURITY,
          this.data.PERSON_INCOME_SOURCE,
          this.data.PERSON_LABOUR_CAPACITY,
          this.data.PERSON_BLOOD_GROUP,
          this.data.PERSON_POLITICAL_STATUS,
          this.data.PERSON_OCCUPATION_BEFORE_RETIRED,
          this.data.PERSON_ELDER_TYPE,
          this.data.HEALTH_SELF_CARE_ABILITY
        ]
      };
      const res = await this.$http.post(url, data);
      this.national = res.data.data[this.data.PERSON_NATIONALITY];
      this.education = res.data.data[this.data.PERSON_EDUCATION];
      this.religion = res.data.data[this.data.PERSON_RELIGION];
      this.marital = res.data.data[this.data.PERSON_MARITAL_STATUS];
      this.living = res.data.data[this.data.PERSON_LIVING_STATUS];
      this.medical = res.data.data[this.data.PERSON_MEDICAL_SECURITY];
      this.income = res.data.data[this.data.PERSON_INCOME_SOURCE];
      this.labour = res.data.data[this.data.PERSON_LABOUR_CAPACITY];
      this.blood = res.data.data[this.data.PERSON_BLOOD_GROUP];
      this.political = res.data.data[this.data.PERSON_POLITICAL_STATUS];
      this.retired = res.data.data[this.data.PERSON_OCCUPATION_BEFORE_RETIRED];
      this.elderType = res.data.data[this.data.PERSON_ELDER_TYPE];
      this.care = res.data.data[this.data.HEALTH_SELF_CARE_ABILITY];
    },
    fetchElders: async function(){
      let url = this.api.searchelders;
      var data = {
        'type': 4
      }
      const res = await this.$http.post(url, data);
      this.elderList = res.data.data;
    }
  },
  computed: mapState(["checkinId"])
};
</script>

<style scoped>
.fenye {
  margin: 20px 0 10px;
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
