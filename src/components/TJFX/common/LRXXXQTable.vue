<template>
    <div class="lrxxxq">
        <el-table v-loading="loading" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="index">
            </el-table-column>
            <el-table-column prop="name" label="老人名称">
            </el-table-column>
            <el-table-column prop="id_number" label="身份证号码" width="170">
            </el-table-column>
            <el-table-column prop="gender" label="性别" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="birthday" label="生日" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="age" label="年龄" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="income_source" label="经济来源" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="medical_security" label="是否有保险" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="beadhouse" label="养老院" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showPop(scope.row)">查看详情</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
          <div>
            <el-button type="danger" @click="exportList">导出</el-button>
          </div>
          <div style="display: flex;margin-right: 20px;">
            <el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" background layout="prev, pager, next" :total="total">
            </el-pagination>
            <el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
          </div>
        </div>
        <!-- <v-elder v-if="elderEdit" :elderId="elderId" :relation="relation" :national="national" :education="education" :religion="religion" :marital="marital" :living="living" :medical="medical" :income="income" :labour="labour" :blood="blood" :political="political" :retired="retired" :elderType="elderType" :care="care"></v-elder> -->
    </div>
</template>

<script>
// import vElder from "./elderDetail.vue";
import { mapState } from "vuex";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      loading: false,
      elderId: 0,
      currentPage: 1,
      // national: [],
      // education: [],
      // religion: [],
      // marital: [],
      // living: [],
      // medical: [],
      // income: [],
      // labour: [],
      // blood: [],
      // political: [],
      // retired: [],
      // elderType: [],
      // care: [],
      // relation: []
    };
  },
  components: {
    // vElder
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    // this.fetchNationality();
  },
  methods: {
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.elderlist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(() => {
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
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    showPop(scope) {
      this.$store.dispatch("elderEditTrue");
      this.elderId = scope.id;
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
          this.data.HEALTH_SELF_CARE_ABILITY,
          this.data.BEADHOUSE_FAMILY_ELATION
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
      this.relation = res.data.data[this.data.BEADHOUSE_FAMILY_ELATION];
    },
    exportList: async function(){
      let url = this.api.elderinfoexport;
      let data = this.searchData;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        window.open(res.data.data);
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {}
        });
      }
    }
  },
  computed: mapState(["elderEdit"])
};
</script>

<style scoped>
.lrxxxq {
  background-color: #fff;
  min-height: 100%;
}

.top-tit {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}

.top-tit h5 {
  color: #ff8777;
  font-weight: normal;
  float: left;
  line-height: 30px;
  margin: 0;
  font-size: 18px;
}

.demo-ruleForm {
  display: flex;
}

.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.el-form-item {
  margin-bottom: 0;
}

.el-select-dropdown__wrap el-scrollbar__wrap {
  overflow: visible !important;
}
</style>