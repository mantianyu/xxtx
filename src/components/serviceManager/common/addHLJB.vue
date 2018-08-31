<template>
	<div class="addHLJB" v-show="addHLJB">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>护理级别</h5>
	            <span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="级别名称:" prop="nlname">
									<el-input v-model="form.nlname" style="width: 200px;"></el-input>
								</el-form-item>
								<el-form-item label="护理对象" prop="servicetype">
									<el-select v-model="form.servicetype" clearable placeholder="请选择护理对象" style="width: 200px;">
										<el-option v-for="(care, key) in cares" :label="care+'老人'" :value="key * 1" :key="key"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="护理费用:" prop="nlprice">
									<el-input v-model="form.nlprice" style="width: 200px;" type="number">
										<template slot="append">元</template>
									</el-input>
								</el-form-item>
							</div>
							<el-form-item label="级别说明:" prop="explain">
								<el-input type="textarea" v-model="form.explain"></el-input>
							</el-form-item>
							<div>
								<el-table
									ref="multipleTable"
									:data="tableData"
									style="width: 100%"
									@selection-change="handleSelectionChange">
									<el-table-column
									type="selection"
									width="55">
									</el-table-column>
									<el-table-column
									prop="name"
									label="项目名称"
									min-width="140">
									</el-table-column>
									<el-table-column
									prop="type_name"
									label="所属类别">
									</el-table-column>
									<el-table-column
									prop="price"
									label="费用">
									</el-table-column>
									<el-table-column
									prop="price_mode"
									label="收费方式">
									</el-table-column>
									<el-table-column
									label="操作">
									<template slot-scope="scope">
										<el-button v-bind:disabled="selectId.indexOf(scope.row.id) == -1 || selectId.length == 0" type="text" size="small" @click="showEditPro(scope.row)">任务设置</el-button>
									</template>
									</el-table-column>
									<el-table-column
									label="任务类型">
									<template slot-scope="scope">
										<p>{{scope.row.type == 0 ? '一般任务' : scope.row.type == 1 ? '关键任务' : ''}}</p>
									</template>
									</el-table-column>
									<el-table-column
									prop="cycle"
									label="执行频次">
									<template slot-scope="scope">
										<p>{{scope.row.cycle == 1 ? '天任务' : scope.row.cycle == 2 ? '周任务' : scope.row.cycle == 3 ? '月任务' : ''}}</p>
									</template>
									</el-table-column>
									<el-table-column
									prop="days"
									label="执行日期">
									<template slot-scope="scope">
                    <p v-if="scope.row.cycle == 3" v-for="(day, key) in scope.row.days" :key="key">{{ months[day] }}</p>
                    <p v-if="scope.row.cycle == 2" v-for="(day, key) in scope.row.days" :key="key">{{ weeks[day] }}</p>
									</template>
									</el-table-column>
									<el-table-column
									prop="times"
									label="执行时间">
									<template slot-scope="scope">
                    <p v-for="(time, key) in scope.row.times" :key="key">{{ dayTimes[time] }}</p>
									</template>
									</el-table-column>
								</el-table>
								<div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
									<div></div>
									<div style="display: flex;margin-right: 20px;">
										<el-button type="primary" size="small" @click="fetchProject(1)">首页</el-button>
										<el-pagination
										background
										@current-change="handleCurrentChange"
								:current-page="currentPage"
										layout="prev, pager, next"
										:total="total">
										</el-pagination>
										<el-button type="primary" size="small" @click="fetchProject(last_page)">末页</el-button>
									</div>
								</div>
							</div>
							<div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
								<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
								<el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
							</div>
						</el-form>
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
		<v-project :projectId="projectId" :taskType="task_type" :cycle="cycle" :daysArr="days" :timesArr="times"></v-project>
	</div>
</template>

<script>
import { mapState } from "vuex";
import vProject from "./editProject.vue";

export default {
  props: ["cares", "nlid"],
  data() {
    return {
      form: {
        nlname: "",
        servicetype: "",
        nlprice: "",
        explain: ""
      },
      rules: {
        nlname: [
          {
            required: true,
            message: this.message.pleaseInputLevelName,
            trigger: "blur"
          }
        ],
        servicetype: [
          {
            required: true,
            message: this.message.pleaseChoiceNurseObj,
            trigger: "change"
          }
        ],
        nlprice: [
          {
            required: true,
            message: this.message.pleaseInputNurseCost,
            trigger: "blur"
          }
        ]
      },
      months: [
        "1号",
        "2号",
        "3号",
        "4号",
        "5号",
        "6号",
        "7号",
        "8号",
        "9号",
        "10号",
        "11号",
        "12号",
        "13号",
        "14号",
        "15号",
        "16号",
        "17号",
        "18号",
        "19号",
        "20号",
        "21号",
        "22号",
        "23号",
        "24号",
        "25号",
        "26号",
        "27号",
        "28号",
        "29号",
        "30号",
        "31号"
      ],
      weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周天"],
      dayTimes: [
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30"
      ],
      multipleSelection: [],
      tableData: [],
      total: 0,
      last_page: 0,
      projectId: 0,
      task_type: 0,
      selectId: [],
      cycle: 0,
      days: [],
      times: [],
      loading: false,
      currentPage: 1,
      bLoading: false,
      selectJB: []
    };
  },
  components: {
    vProject
  },
  watch: {
    nlid() {
      if (this.nlid == 0) {
        this.selectId = [];
      } else {
        this.fetchDetail(this.nlid);
        this.fetchProject(1);
      }
    },
    addHLJB() {
      this.fetchProject(1);
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchProject(val);
    },
    handleSelectionChange(val) {
      for(let i = 0; i < val.length; i++){
        let flag = true;
        for(let k = 0; k < this.selectJB.length; k++){
          if(val[i].id == this.selectJB[k].id){
            flag = false;
            break;
          }
        }
        if(flag){
          this.selectJB.push(val[i]);
        }
      }
      this.multipleSelection = val;
      this.selectId = [];
      for (let i = 0; i < val.length; i++) {
        this.selectId.push(val[i].id);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.nlid == 0) {
            var iteminfos = [];
            for (let i = 0; i < this.selectJB.length; i++) {
              if (!this.selectJB[i].nlsid) {
                var item = {
                  itemid: this.selectJB[i].id,
                  cycle: this.selectJB[i].cycle,
                  type: this.selectJB[i].type,
                  days: this.selectJB[i].days,
                  times: this.selectJB[i].times,
                  nlsid: 0
                };
                iteminfos.push(item);
              } else {
                var item = {
                  itemid: this.selectJB[i].id,
                  cycle: this.selectJB[i].cycle,
                  type: this.selectJB[i].type,
                  days: this.selectJB[i].days,
                  times: this.selectJB[i].times,
                  nlsid: 0
                };
                iteminfos.push(item);
              }
            }
            var data = {
              nlname: this.form.nlname,
              servicetype: this.form.servicetype,
              nlprice: this.form.nlprice,
              explain: this.form.explain,
              iteminfos: iteminfos
            };
            this.saveLevel(data);
          } else {
            var iteminfos = [];
            for (let i = 0; i < this.selectJB.length; i++) {
              if (!this.selectJB[i].nlsid) {
                var item = {
                  itemid: this.selectJB[i].id,
                  cycle: this.selectJB[i].cycle,
                  type: this.selectJB[i].type,
                  days: this.selectJB[i].days,
                  times: this.selectJB[i].times,
                  nlsid: 0
                };
                iteminfos.push(item);
              } else {
                var item = {
                  itemid: this.selectJB[i].id,
                  cycle: this.selectJB[i].cycle,
                  type: this.selectJB[i].type,
                  days: this.selectJB[i].days,
                  times: this.selectJB[i].times,
                  nlsid: this.selectJB[i].nlsid
                };
                iteminfos.push(item);
              }
            }
            var data = {
              nlid: this.nlid,
              nlname: this.form.nlname,
              servicetype: this.form.servicetype,
              nlprice: this.form.nlprice,
              explain: this.form.explain,
              iteminfos: iteminfos
            };
            this.saveLevel(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addHLJBFalse");
      this.$parent.clean();
      this.$refs["form"].resetFields();
      this.selectId = [];
    },
    fetchProject: async function(val) {
      this.loading = true;
      let url = this.api.nursingitemslist + "?page=" + val;
      var data = {
        level_id: this.nlid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].able === 1 || this.selectJB.indexOf(this.tableData[i].id) !== -1) {
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableData[i],
                  true
                );
              }
            }
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
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.nlevelinfo;
      var data = {
        nlid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.nlname = res.data.data.name;
          this.form.servicetype = res.data.data.servicetype;
          this.form.nlprice = res.data.data.price;
          this.form.explain = res.data.data.introduction;
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
    saveLevel: async function(data) {
      let url = this.api.nlevel;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.nlid == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addNurseRankSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeNurseRankSuccess,
              type: "success"
            });
          } 
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
    showEditPro(scope) {
      this.$store.dispatch("editProjectTrue");
      this.projectId = scope.id;
      this.task_type = scope.type;
      this.cycle = scope.cycle;
      if (scope.cycle) {
        if (scope.cycle.length == 0) {
          this.cycle = 0;
        }
      }
      this.days = scope.days;
      this.times = scope.times;
    },
    getProject(data) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].id == data.id) {
          this.tableData[i].cycle = data.cycle;
          this.tableData[i].days = data.days.sort(this.sortNumber);
          this.tableData[i].type = data.type;
          this.tableData[i].times = data.times.sort(this.sortNumber);
        }
      }
      for (let i = 0; i < this.selectJB.length; i++) {
        if (this.selectJB[i].id == data.id) {
          this.selectJB[i].cycle = data.cycle;
          this.selectJB[i].days = data.days.sort(this.sortNumber);
          this.selectJB[i].type = data.type;
          this.selectJB[i].times = data.times.sort(this.sortNumber);
        }
      }
    },
    sortNumber(a, b) {
      return a - b;
    },
    clean() {
      this.projectId = 0;
      this.cycle = 0;
      this.task_type = 0;
    }
  },
  computed: mapState(["addHLJB"])
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
  overflow-y: auto;
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
.addHLJB {
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
</style>