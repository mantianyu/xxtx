<template>
	<div class="addNursRelay" v-show="addNursRelay">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>护工替班</h5>
					<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="130px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="护工小组:" prop="teamGet">
									<el-select v-bind:disabled="workshiftid != 0" v-model="form.teamGet" clearable placeholder="请选择小组" style="width: 200px;" @change="selectGet">
										<el-option v-for="(team, key) in nursesTeam" :label="team.name" :value="team.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="接班人:" prop="successionid">
									<el-select v-bind:disabled="workshiftid != 0" v-model="form.successionid" clearable placeholder="请选择接班人" @change="fetchPlan" style="width: 200px;">
										<el-option v-for="(nurs, key) in nursesGet" :label="nurs.name" :value="nurs.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="护工小组:" prop="teamPost">
									<el-select v-bind:disabled="workshiftid != 0" v-model="form.teamPost" clearable placeholder="请选择小组" style="width: 200px;" @change="selectPost">
										<el-option v-for="(team, key) in nursesTeam" :label="team.name" :value="team.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="交班人:" prop="shiftid">
									<el-select v-bind:disabled="workshiftid != 0" v-model="form.shiftid" clearable placeholder="请选择交班人" @change="fetchPlan" style="width: 200px;">
										<el-option v-for="(nurs, key) in nursesPost" :label="nurs.name" :value="nurs.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="替班开始时间:" prop="starttime">
									<el-date-picker v-bind:disabled="workshiftid != 0" type="date" placeholder="选择日期" v-model="form.starttime" @change="fetchPlan" style="width: 200px;"></el-date-picker>
								</el-form-item>
								<el-form-item label="替班结束时间:" prop="endtime">
									<el-date-picker v-bind:disabled="workshiftid != 0" type="date" placeholder="选择日期" v-model="form.endtime" @change="fetchPlan" style="width: 200px;"></el-date-picker>
								</el-form-item>
							</div>
							<el-form-item label="替班原因:" prop="reason">
								<el-input v-bind:disabled="workshiftid != 0" type="textarea" style="width: 530px;" v-model="form.reason"></el-input>
							</el-form-item>
							<el-form-item class="nurseReplay" v-if="workshiftid == 0" label="选择班次:">
								<el-table
									:data="tableData"
                  ref="multipleTable"
									max-height="250"
									style="width: 530px;"
									@selection-change="handleSelectionChange"
                  @select="selectRow"
                  @select-all="selectAll">
									<el-table-column
										type="selection"
										width="55">
									</el-table-column>
									<el-table-column
										prop="date"
										label="日期">
										<template slot-scope="scope">
											<p>{{scope.row.work_day}}({{scope.row.week}})</p>
										</template>
									</el-table-column>
									<el-table-column
										prop="name"
										label="班次">
										<template slot-scope="scope">
											<p>{{scope.row.time}}({{scope.row.start_time}}~{{scope.row.end_time}})</p>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item v-if="workshiftid != 0" label="选择班次:" prop="reason">
								<p>jbdfighij</p>
							</el-form-item>
							<el-form-item label="登记人:" prop="employee_id">
								<el-input disabled v-model="form.employee_id" style="width: 530px;"></el-input>
							</el-form-item>
							<div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
								<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
								<el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
							</div>
						</el-form>
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
  props: ["workshiftid", "nursesTeam"],
  data() {
    var validateShiftid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.message.pleaseChoiceDeliverer));
      } else {
        if (this.form.successionid === this.form.shiftid) {
          callback(new Error(this.message.SuccessorRepeatWarning));
        }
        callback();
      }
    };
    return {
      form: {
        teamGet: "",
        teamPost: "",
        successionid: "",
        shiftid: "",
        starttime: "" + new Date(),
        endtime: "",
        reason: "",
        employee_id: localEvent.StorageGetter("empName")
      },
      rules: {
        successionid: [
          { required: true, message: this.message.pleaseChoiceSuccession, trigger: "change" }
        ],
        shiftid: [
          { required: true, validator: validateShiftid, trigger: "change" }
        ],
        starttime: [
          { required: true, message: this.message.pleaseChoiceStartTime, trigger: "change" }
        ],
        endtime: [
          { required: true, message: this.message.pleaseChoiceEndTime, trigger: "change" }
        ]
      },
      empId: localEvent.StorageGetter("empId"),
      tableData: [],
      multipleSelection: [],
      nursesGet: [],
      nursesPost: [],
      loading: false,
      bLoading: false
    };
  },
  watch: {
    workshiftid() {
      this.fetchDetail(this.workshiftid);
    }
  },
  methods: {
    checkboxInit(row, index) {
      if (row.effective == 0) return 0;
      else return 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectRow(selection, row) {
      if (row.effective == 0) {
        this.$alert(this.message.flightCannotReplace, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        });
      }
    },
    selectAll(selection) {
      this.$refs.multipleTable.clearSelection();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var shiftworks = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            var work = {
              schedulesid: this.multipleSelection[i].id,
              shiftday: this.multipleSelection[i].work_day,
              timeplanid: this.multipleSelection[i].time_plan_id
            };
            shiftworks.push(work);
          }
          var data = {
            successionid: this.form.successionid,
            shiftid: this.form.shiftid,
            shiftworks: shiftworks,
            reason: this.form.reason
          };
          this.saveRelay(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addNursRelayFalse");
      this.$refs["form"].resetFields();
      this.tableData = [];
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.workshiftinfo;
      var data = {
        id: id
      };
      const res = await this.$http.post(url, data);
      this.loading = false;
    },
    saveRelay: async function(data) {
      let url = this.api.workshift;
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.$parent.fetchList(1);
        this.bLoading = false;
        this.hideEditFalse();
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    fetchPlan: async function() {
      if (
        this.form.successionid != "" &&
        this.form.shiftid != "" &&
        this.form.starttime != "" &&
        this.form.endtime != ""
      ) {
        let url = this.api.successordetail;
        var data = {
          Handover: this.form.shiftid,
          Successor: this.form.successionid,
          start_time:
            new Date(this.form.starttime).getFullYear() +
            "-" +
            (new Date(this.form.starttime).getMonth() + 1) +
            "-" +
            new Date(this.form.starttime).getDate(),
          end_time:
            new Date(this.form.endtime).getFullYear() +
            "-" +
            (new Date(this.form.endtime).getMonth() + 1) +
            "-" +
            new Date(this.form.endtime).getDate()
        };
        const res = await this.$http.post(url, data);
        this.tableData = res.data.data;
      }
    },
    selectGet: async function(val){
      let url = this.api.getgroupnurses;
      let data = {
        group_id: val
      }
      const res = await this.$http.post(url, data);
      this.nursesGet = res.data.data;
      this.form.successionid = '';
    },
    selectPost: async function(val){
      let url = this.api.getgroupnurses;
      let data = {
        group_id: val
      }
      const res = await this.$http.post(url, data);
      this.nursesPost = res.data.data;
      this.form.shiftid = '';
    }
  },
  computed: mapState(["addNursRelay"])
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
.addNursRelay {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>