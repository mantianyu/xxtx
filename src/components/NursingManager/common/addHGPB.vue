<template>
	<div class="addHGPB" v-show="addHGPB">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>护工排班</h5>
					<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="排班表名称:" prop="name">
									<el-input v-bind:disabled="detail" v-model="form.name" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="选择方案:" prop="scheme_id">
									<el-select v-bind:disabled="edit" v-model="form.scheme_id" clearable placeholder="请选择方案" style="width: 200px;" @change="changePlan">
										<el-option v-for="(plan, key) in plans" :label="plan.name" :value="plan.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="选择员工:" prop="user_ids">
									<el-select v-bind:disabled="detail" filterable multiple v-model="form.user_ids" clearable placeholder="请选择员工" style="width: 200px;" @change="changeEmp">
										<el-option v-for="(nurs, key) in nurses" v-bind:disabled="form.user_ids.indexOf(nurs.id) != -1" :label="nurs.name" :value="nurs.id" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="执行时间:" prop="time">
									<el-select v-bind:disabled="edit" v-model="form.time" clearable placeholder="请选择执行时间" style="width: 200px;" @change="changeDate">
										<el-option v-for="(day, key) in days" :label="day" :value="day" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="开始日期:" prop="start_day">
									<el-input disabled v-model="form.start_day" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="结束日期:" prop="end_day">
									<el-input disabled v-model="form.end_day" style="width: 200px;"></el-input>
								</el-form-item>
							</div>
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="批量设置" prop="type">
									<el-checkbox-group v-model="form.type">
										<el-checkbox v-for="(planList, key) in planLists" :key="key" v-bind:disabled="planList.dis" :label="planList.id" name="type">{{planList.name}}({{planList.start_time}}~{{planList.end_time}})</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="开始排班:">
									<el-button type="danger" size="medium" style="margin-left: 30px;" @click="beginPlan">开始排班</el-button>
								</el-form-item>
							</div>
							<el-table
								v-if="isShow"
								ref="singleTable"
								:data="tableData"
								highlight-current-row
								style="width: 100%">
								<el-table-column
								type="index"
								width="50">
								</el-table-column>
								<el-table-column
								property="date"
								label="日期">
								</el-table-column>
								<el-table-column
								v-for="(name, key) in names"
								:key="key"
								:label="name">
								  <template slot-scope="scope">
									  <el-select v-bind:disabled="detail" filterable multiple v-model="scope.row.users[key].work" clearable size="mini">
										  <el-option v-for="(planList, key) in scope.row.planLists" :key="key" :label="planList.name" :value="planList.id"></el-option>
										</el-select>
                    <div class="shifter" v-for="(work, key) in scope.row.work_shifter" :key="key">{{ work.name }}</div>
                    <div class="successor" v-for="(work, key) in scope.row.work_successor" :key="key">{{ work.name }}</div>
									</template>
								</el-table-column>
						</el-table>
							<div v-if="isSave" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
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
  props: ["workId", "edit", "plans", "nurses", "detail"],
  data() {
    return {
      form: {
        name: "",
        scheme_id: "",
        user_ids: [],
        time: "",
        start_day: "",
        end_day: "",
        type: []
      },
      rules: {
        name: [
          {
            required: true,
            message: this.message.pleaseInputArrangeName,
            trigger: "blur"
          }
        ],
        scheme_id: [
          {
            required: true,
            message: this.message.pleaseChoiceProject,
            trigger: "change"
          }
        ],
        user_ids: [
          {
            required: true,
            message: this.message.pleaseChoiceStaff,
            trigger: "change"
          }
        ]
      },
      isShow: false,
      isSave: false,
      days: [],
      cycle: 0,
      planLists: [],
      tableData: [],
      works: [],
      dateArr: [],
      names: [],
      userIds: [],
      loading: false,
      bLoading: false,
    };
  },
  watch: {
    workId() {
      if (this.workId == 0) {
        this.tableData = [];
        this.works = [];
        this.planLists = [];
        this.isSave = false;
      } else {
        this.fetchDetail(this.workId);
        this.isSave = true;
      }
    }
  },
  methods: {
    changeEmp(val){
      this.isSave = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var works = this.works;
          if (this.form.user_ids.length !== works[0].users.length) {
            this.$alert(this.message.pleaseReclickArrange, "", {
              confirmButtonText: this.message.confirm,
              callback: action => {
                this.bLoading = false;
              }
            });
            return;
          }
          if (this.workId == 0) {
            var data = {
              name: this.form.name,
              scheme_id: this.form.scheme_id,
              user_ids: this.form.user_ids,
              time: this.form.time,
              start_day: this.form.start_day,
              end_day: this.form.end_day,
              time_plan_ids: this.form.type,
              employee_id: localEvent.StorageGetter("empId"),
              works: works
            };
            this.saveWork(data);
          } else {
            var data = {
              id: this.workId,
              name: this.form.name,
              scheme_id: this.form.scheme_id,
              user_ids: this.form.user_ids,
              time: this.form.time,
              start_day: this.form.start_day,
              end_day: this.form.end_day,
              time_plan_ids: this.form.type,
              employee_id: localEvent.StorageGetter("empId"),
              works: works
            };
            this.saveWork(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addHGPBFalse");
      this.$refs["form"].resetFields();
      this.$parent.clean();
      this.isShow = false;
      this.isSave = false;
      this.tableData = [];
      this.works = [];
      this.planLists = [];
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.getworkschemes;
      var data = {
        wid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.scheme_id = res.data.data.scheme_id;
          this.form.user_ids = res.data.data.user_ids;
          this.form.type = res.data.data.time_plan_ids;
          this.userIds = res.data.data.user_ids;
          this.form.time = res.data.data.time;
          this.form.start_day = res.data.data.start_day;
          this.form.end_day = res.data.data.end_day;
          this.names = res.data.data.user_name;
          this.cycle = res.data.data.cycle;
          this.planLists = res.data.data.plan;
          this.fetchTime(this.form.time);
          this.tableData = [];
          this.works = [];
          var workArr = res.data.data.works;
          for (
            let i = 0;
            i < workArr.length;
            i = i + res.data.data.user_ids.length
          ) {
            var data = {
              date: workArr[i].date,
              planLists: [],
              users: []
            };
            for (let m = i; m < i + res.data.data.user_ids.length; m++) {
              let planLists = [];
              for (let k = 0; k < res.data.data.plan.length; k++) {
                var planData = {
                  employee_id: res.data.data.plan[k].employee_id,
                  end_time: res.data.data.plan[k].end_time,
                  id: res.data.data.plan[k].id,
                  name: res.data.data.plan[k].name,
                  scheme_id: res.data.data.plan[k].scheme_id,
                  start_time: res.data.data.plan[k].start_time,
                  dis: false
                };
                for (let n = 0; n < workArr[m].work_shifter.length; n++) {
                  if (
                    res.data.data.plan[k].id === workArr[m].work_shifter[n].id
                  ) {
                    planData.dis = true;
                  }
                }
                for (let n = 0; n < workArr[m].work_successor.length; n++) {
                  if (
                    res.data.data.plan[k].id === workArr[m].work_successor[n].id
                  ) {
                    planData.dis = true;
                  }
                }
                data.planLists.push(planData);
              }
              var user = {
                id: workArr[m].id,
                work: workArr[m].work,
                work_shifter: workArr[m].work_shifter,
                work_successor: workArr[m].work_successor,
              };
              data.users.push(user);
            }
            this.tableData.push(data);
            this.works.push(data);
          }
          this.isShow = true;
          if (this.detail) {
            this.isSave = false;
          } else {
            this.isSave = true;
          }
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    },
    saveWork: async function(data) {
      let url = this.api.workschemes;
      try {
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
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    fetchDate: async function(id) {
      let url = this.api.getcycle;
      var data = {
        cycle: id
      };
      const res = await this.$http.post(url, data);
      this.form.end_day = res.data.data.end;
      this.form.start_day = res.data.data.start;
      this.form.time = res.data.data.time;
      this.dateArr = res.data.data.day;
      if (id == 0) {
        this.days = res.data.data.month;
      } else {
        this.days = res.data.data.week;
      }
    },
    changePlan(val) {
      for (let i = 0; i < this.plans.length; i++) {
        if (this.plans[i].id == val) {
          this.cycle = this.plans[i].cycle;
          this.fetchDate(this.plans[i].cycle);
          this.planLists = this.plans[i].plan;
          this.tableData = [];
          this.works = [];
          this.isShow = false;
          this.isSave = false;
          return;
        }
      }
    },
    fetchTime: async function(id) {
      let url = this.api.doschedulingtime;
      if (this.cycle == 0) {
        var data = {
          cycle: this.cycle,
          month: id
        };
      } else {
        var data = {
          cycle: this.cycle,
          week: id
        };
      }
      const res = await this.$http.post(url, data);
      this.form.end_day = res.data.data.end;
      this.form.start_day = res.data.data.start;
      this.dateArr = res.data.data.day;
      this.loading = false;
    },
    changeDate(val) {
      this.loading = true;
      this.tableData = [];
      this.works = [];
      this.isShow = false;
      this.isSave = false;
      this.fetchTime(val);
    },
    beginPlan() {
      if(!this.form.scheme_id){
          this.$alert(this.message.chooseWork, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        return;
      }if(!this.form.user_ids){
          this.$alert(this.message.chooseWorkEmp, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        return;
      }
      this.names = [];
      this.tableData = [];
      this.works = [];
      for (let i = 0; i < this.form.user_ids.length; i++) {
        for (let k = 0; k < this.nurses.length; k++) {
          if (this.nurses[k].id == this.form.user_ids[i]) {
            this.names.push(this.nurses[k].name);
            break;
          }
        }
      }
      for (let n = 0; n < this.dateArr.length; n++) {
        var data = {
          date: this.dateArr[n],
          planLists: this.planLists,
          users: []
        };
        for (let m = 0; m < this.names.length; m++) {
          var user = {
            id: this.form.user_ids[m],
            work: this.form.type
          };
          data.users.push(user);
        }
        this.tableData.push(data);
        this.works.push(data);
      }
      this.userIds = this.form.user_ids;
      this.isShow = true;
      this.isSave = true;
      if (this.detail) {
        this.isSave = false;
      }
    }
  },
  computed: mapState(["addHGPB"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
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
  margin-left: -550px;
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
.addHGPB {
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
.shifter{
  width: 120px;
  height: 20px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  background-color: grey;
}
.successor{
  width: 120px;
  height: 20px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  background-color: #ff6469;
}
</style>