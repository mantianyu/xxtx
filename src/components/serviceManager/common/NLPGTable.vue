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
		      prop="number"
		      label="评估编号">
		    </el-table-column>
		    <el-table-column
		      prop="idnumber"
		      label="身份证号码"
					width="170">
		    </el-table-column>
		    <el-table-column
		      prop="created_at"
		      label="开始时间">
		    </el-table-column>
		    <el-table-column
		      prop="is_final"
		      label="是否完成评估">
		      <template slot-scope="scope">
		      	<p>{{ scope.row.is_final == 0 ? '未完成' : '完成' }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="final_garde_score"
		      label="评估结果">
		      <template slot-scope="scope">
		      	<p>{{ totalLevel[scope.row.final_garde_score] }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="use_national_standard"
		      label="评估标准">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button v-if="scope.row.is_final == 0" type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		          	<el-button v-if="scope.row.is_final == 1" type="text" size="small" @click="showMain(scope.row)">查看</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
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
	    <v-ability :abilityId="abilityId" :listId="listId" :national="national" :education="education" :religion="religion" :marital="marital" :living="living" :medical="medical" :income="income" :relation="relation" :elders="elders" :main="main"></v-ability>
	</div>
</template>

<script>
import vAbility from "./abilityEdit.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      listId: 0,
      abilityId: 0,
      total: 0,
      last_page: 0,
      national: [],
      education: [],
      religion: [],
      marital: [],
      living: [],
      medical: [],
      income: [],
      relation: [],
      totalLevel: ["能力完好", "轻度失能", "中度失能", "重度失能"],
      elders: [],
      loading: false,
      main: false,
      currentPage: 1,
      allElders: [],
      checkinElders: []
    };
  },
  components: {
    vAbility
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchNationality();
    this.fetchAllElders();
    this.fetchCheckinElders();
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
      let url = this.api.abilitylist + "?page=" + val;
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
          this.abilityId = 0;
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
      let url = this.api.delability;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteAbilitySuccess,
              type: "success"
            });
          this.fetchList(1);
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
              let id = id_arr[k].id;
              data.push(id);
            }
            this.deleteAbility(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("abilityEditTrue");
      if (scope != 0) {
        this.abilityId = scope.elder_id;
        this.listId = scope.id;
        this.elders = this.allElders;
      } else {
        this.abilityId = 0;
        this.listId = 0;
        this.elders = this.checkinElders;
      }
    },
    showMain(scope) {
      this.$store.dispatch("abilityEditTrue");
      if (scope != 0) {
        this.abilityId = scope.elder_id;
        this.listId = scope.id;
        this.main = true;
        this.elders = this.allElders;
      } else {
        this.abilityId = 0;
        this.listId = 0;
        this.elders = this.checkinElders;
      }
    },
    clean() {
      this.abilityId = 0;
      this.listId = 0;
      this.main = false;
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
      this.relation = res.data.data[this.data.BEADHOUSE_FAMILY_ELATION];
    },
    fetchAllElders: async function() {
      let url = this.api.getsearchelder;
      var data = {
        type: 1
      };
      const res = await this.$http.post(url, data);
      this.allElders = res.data.data;
    },
    fetchCheckinElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.checkinElders = res.data.data;
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
