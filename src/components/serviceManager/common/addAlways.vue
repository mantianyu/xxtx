<template>
	<div class="addAlways" v-show="addAlways">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
						<h5>常规用药登记</h5>
						<span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="时间:" prop="eat_time">
									<el-select v-model="form.eat_time" clearable placeholder="请选择时间" @change="changeElderOrTime">
											<el-option label="早" value="38"></el-option>
											<el-option label="中" value="39"></el-option>
											<el-option label="晚" value="41"></el-option>
									</el-select>
								</el-form-item>
										<el-form-item label="用药日期:" prop="time">
									<el-date-picker type="date" placeholder="选择用药日期" v-model="form.time"></el-date-picker>
								</el-form-item>
										<el-form-item label="老人姓名:" prop="elderid">
									<el-select v-model="form.elderid" filterable clearable placeholder="请选择老人" @change="changeElderOrTime">
											<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
									</el-select>
								</el-form-item>
							</div>
							<div v-if="isDrugList" style="margin-top: 20px;">
								<el-table
									v-loading="loading"
									:data="drugList"
									stripe
									style="width: 100%"
									@selection-change="handleSelectionChange">
									<el-table-column
										type="selection"
										width="55">
									</el-table-column>
									<el-table-column
										prop="drugname"
										label="药名">
									</el-table-column>
                  <el-table-column
                    prop="drugtime"
                    label="时间">
                  </el-table-column>
                  <el-table-column
                    prop="bednum"
                    label="频率">
                      <template slot-scope="scope">
                          <p>{{scope.row.frequencycount}}次/{{scope.row.frequencyday}}天</p>
                      </template>
                  </el-table-column>
                  <el-table-column
                    prop="bednum"
                    label="时间数量">
                      <template slot-scope="scope">
                          <p>早{{scope.row.earlynum}}中{{scope.row.middlenum}}晚{{scope.row.latenum}}</p>
                      </template>
                  </el-table-column>
								</el-table>
								<div style="margin-top: 30px;margin-left: 20px;margin-bottom: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: flex-end;">
									<div style="display: flex;margin-right: 20px;">
										<el-button type="primary" size="small" @click="fetchDrugList(1)">首页</el-button>
										<el-pagination
											background
											@current-change="handleCurrentChange"
									:current-page="currentPage"
											layout="prev, pager, next"
											:total="total">
										</el-pagination>
										<el-button type="primary" size="small" @click="fetchDrugList(last_page)">末页</el-button>
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
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["elders"],
  data() {
    return {
      form: {
        elderid: "",
        eat_time: "",
        time: "" + new Date()
      },
      rules: {
        elderid: [{ required: true, message: this.message.pleaseChoiceElder, trigger: "change" }],
        eat_time: [
          { required: true, message: this.message.pleaseChoiceTime, trigger: "change" }
        ],
        time: [{ required: true, message: this.message.pleaseChoiceMedicineDate, trigger: "change" }]
      },
      drugSpecifical: [],
      isDrugList: false,
      drugList: [],
      total: 0,
      last_page: 0,
      multipleSelection: [],
      loading: false,
      currentPage: 1,
      bLoading: false
    };
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchDrugList(val);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          var records = [];
          
          for (let i = 0; i < this.multipleSelection.length; i++) {
            var drugnum = 0;
            if (this.form.eat_time * 1 == 1) {
              drugnum = this.multipleSelection[i].earlynum;
            } else if (this.form.eat_time * 1 == 2) {
              drugnum = this.multipleSelection[i].middlenum;
            } else {
              drugnum = this.multipleSelection[i].latenum;
            }
            var record = {
              drugid: this.multipleSelection[i].drugid,
              drugnum: this.multipleSelection[i].total,
              maid: this.multipleSelection[i].maid
            };
            records.push(record);
          }
          var data = {
            elderid: this.form.elderid,
            timeid: this.form.eat_time * 1,
            starttime: Date.parse(new Date(this.form.time)) / 1000,
            isprovisionality: 0,
            records: records
          };
          this.saveDrugIn(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addAlwaysFalse");
      this.$refs["form"].resetFields();
      this.isDrugList = false;
      this.drugList = [];
    },
    saveDrugIn: async function(data) {
      let url = this.api.addmedicationrecord;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
            title: this.message.success,
            message: this.message.addAlwaysDrugSuccess,
            type: "success"
          });
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
    changeElderOrTime(val) {
      if (this.form.elderid != "" && this.form.eat_time != "") {
        this.isDrugList = true;
        this.fetchDrugList(1);
      }
    },
    fetchDrugList: async function(val) {
      this.loading = true;
      let url = this.api.eldersdministrationlist + "?page=" + val;
      var data = {
        elderid: this.form.elderid,
        timeeate: this.form.eat_time
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.drugList = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(() => {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
          }
        });
      }
    }
  },
  computed: mapState(["addAlways"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 520px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -260px;
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
.addAlways {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>