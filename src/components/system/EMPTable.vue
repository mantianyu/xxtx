<template>
	<div class="table">
		<el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="员工姓名">
      </el-table-column>
      <el-table-column prop="id_number" label="身份证号" width="170">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column
              prop="department_name"
              label="部门">
      </el-table-column>
      <el-table-column
              prop="professional_qualification"
              label="职务">
      </el-table-column>
      <el-table-column
              prop="employment_date"
              label="入职时间">
      </el-table-column>
      <el-table-column
              prop="status_code"
              label="状态">
      </el-table-column>
      <el-table-column
              prop="account"
              label="系统用户">
      </el-table-column>
      <el-table-column
              label="操作">
          <template slot-scope="scope">
		          <el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
              <el-button v-if="scope.row.status === 1" type="text" size="small" @click="showMEdit(scope.row)">登陆设置</el-button>
          </template>
      </el-table-column>
  </el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div style="display: flex">
				<el-button type="danger" size="medium" @click="delMore">离职</el-button>
        <el-button type="success" size="medium" @click="showAdd(0)">增加</el-button>
        <el-button type="warning" size="medium" @click="comeIn">入职</el-button>
        <el-upload
          class="upload-demo"
          :action="this.api.employeeinfoimport"
          :with-credentials="true"
          :headers="{'Authorization': 'Bearer ' + token}"
          :on-success="handleSuccess"
          :show-file-list="false"
          style="margin-left: 10px;">
          <el-button size="medium" type="primary">导入</el-button>
        </el-upload>
        <el-button type="primary" size="medium" @click="exportList" style="margin-left: 10px;">导出</el-button>
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
    <v-medit :userid="userid" :promise_arr="promise_arr"></v-medit>
	</div>
</template>

<script>
import vNurse from "../NursingManager/common/addNurse.vue";
import vMedit from "./ManageEdit.vue";
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["searchData"],
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      position: [],
      nlid: 0,
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
      userid: "",
      promise_arr: [],
      token: localEvent.StorageGetter("accessToken"),
      flag: false
    };
  },
  components: {
    vNurse,
    vMedit
  },
  watch: {
    searchData() {
      this.fetchList(1);
    },
    accessToken() {
      this.token = this.accessToken;
    }
  },
  mounted() {
    this.fetchList(1);
    this.fetchNational();
    this.fetchEmp();
    this.fetchDepartment();
    this.PromiseList();
  },
  methods: {
    handleSuccess(response, file, fileList) {
      if (response.status_code == 200) {
        this.$alert(this.message.uploadSuccess, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {
            this.fetchList(1);
          }
        });
      } else {
        this.$alert(response.data, "", {
          confirmButtonText: this.message.confirm,
          center: true,
          callback: action => {}
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.employeeinfolist + "?page=" + val;
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
        this.$alert(this.message.pleaseChoiceWorker, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherLeave, "", {
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
    clean() {
      this.nlid = 0;
      this.userid = "";
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
    },
    showMEdit(scope) {
      this.userid = scope.id;
      this.$store.dispatch("manageEditOpen");
    },
    PromiseList: async function() {
      let url = this.api.promiseList;
      let data = {};
      const res = await this.$http.post(url, data);
      let PList = res.data.data;
      this.PromiseArr(PList);
    },
    PromiseArr(pList) {
      for (let i = 0; i < pList.length; i++) {
        var data = {
          name: pList[i].name,
          pid: pList[i].id
        };
        this.promise_arr.push(data);
      }
    },
    exportList: async function() {
      let url = this.api.employeeinfoexport;
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
    },
    comeIn() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceWorker, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherEntry, "", {
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
            this.comeInNurse(data);
          })
          .catch(() => {});
      }
    },
    comeInNurse: async function(id) {
      let url = this.api.employeesdel;
      var data = {
        eid: id,
        status: 1
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
    }
  },
  computed: mapState(["accessToken"])
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
</style>