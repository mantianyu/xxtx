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
		      prop="name"
		      label="护理员姓名">
		    </el-table-column>
		    <el-table-column
		      prop="id_number"
		      label="身份证号">
		    </el-table-column>
		    <el-table-column
		      prop="phone"
		      label="联系方式">
		    </el-table-column>
		    <el-table-column
		      prop="position"
		      label="职务">
		      <template slot-scope="scope">
		      	<p>{{ position[scope.row.position] }}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="操作">
		        <template slot-scope="scope">
		          <el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		          <el-button type="text" size="small" @click="showAssistant(scope.row)">护工资料</el-button>              
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" size="medium" @click="delMore">离职</el-button>
        <el-button type="success" size="medium" style="margin-left: 30px;" @click="showAdd(0)">增加</el-button>
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
	    <v-nurse :nlid="nlid" :flag="flag" :national="national" :marital="marital" :education="education" :political="political" :proQualification="proQualification" :position="position" :emp="emp" :department="department" :certificate="certificate"></v-nurse>
      <v-assistant :nlid="nalid"></v-assistant>
	</div>
</template>

<script>
import vNurse from "./addNurse.vue";
import vAssistant from "./addAssistant.vue";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      position: [],
      nlid: 0,
      nalid: 0,
      total: 0,
      last_page: 0,
      national: [],
      marital: [],
      education: [],
      political: [],
      proQualification: [],
      position: [],
      emp: [],
      department: [],
      certificate: [],
      loading: false,
      currentPage: 1,
      flag: true
    };
  },
  components: {
    vNurse, vAssistant
  },
  watch: {
    searchData() {
      this.fetchList(1);
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchNational();
    this.fetchEmp();
    this.fetchDepartment();
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
      let url = this.api.employeeslist + "?page=" + val;
      var data = this.searchData;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.nlid = 0;
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
    deleteNurse: async function(id) {
      let url = this.api.employeesdel;
      var data = {
        eid: id,
        status: 0
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
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
        this.$alert(this.message.pleaseChoiceNurse, "", {
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
            this.deleteNurse(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addNurseTrue");
      if (scope != 0) {
        this.nlid = scope.id;
      } else {
        this.nlid = 0;
      }
    },
    showAssistant(scope) {
      this.$store.dispatch("addAssistantTrue");
      if (scope != 0) {
        this.nalid = scope.id;
      } else {
        this.nalid = 0;
      }
    },
    clean() {
      this.nlid = 0;
      this.nalid = 0;
    },
    fetchNational: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.PERSON_NATIONALITY,
          this.data.PERSON_MARITAL_STATUS,
          this.data.PERSON_EDUCATION,
          this.data.PERSON_POLITICAL_STATUS,
          this.data.PERSON_PROFESSIONAL_QUALIFICATION_LEVEL,
          this.data.PERSON_POSITION,
          this.data.PERSON_CERTIFICATE_TYPE
        ]
      };
      const res = await this.$http.post(url, data);
      this.national = res.data.data[this.data.PERSON_NATIONALITY];
      this.marital = res.data.data[this.data.PERSON_MARITAL_STATUS];
      this.education = res.data.data[this.data.PERSON_EDUCATION];
      this.political = res.data.data[this.data.PERSON_POLITICAL_STATUS];
      this.proQualification =
        res.data.data[this.data.PERSON_PROFESSIONAL_QUALIFICATION_LEVEL];
      this.position = res.data.data[this.data.PERSON_POSITION];
      this.certificate = res.data.data[this.data.PERSON_CERTIFICATE_TYPE];
    },
    fetchEmp: async function() {
      let url = this.api.getemployeetypelist;
      var data = {
        type: 0
      };
      const res = await this.$http.post(url, data);
      this.emp = res.data.data;
    },
    fetchDepartment: async function() {
      let url = this.api.getdepartmentslist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.department = res.data.data;
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