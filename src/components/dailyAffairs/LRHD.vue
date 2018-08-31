<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
			<div class="top-tit">
				<h5>老人活动</h5>
				<div class="find">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
						<el-form-item label="活动名" prop="name">
							<el-input type="text" v-model="ruleForm.name" size="small" auto-complete="off" style="width: 140px;"></el-input>
						</el-form-item>
						<el-form-item label="活动类型" prop="type">
							<el-select v-model="ruleForm.type" placeholder="请选择活动类型" clearable size="small" style="width: 140px;">
								<el-option v-for="(active, key) in activeType" :label="active" :value="key * 1" :key="key"></el-option>
							</el-select>
						</el-form-item>
            <el-form-item label="活动时间" prop="start_time" label-width="100px">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.start_time"></el-date-picker>
            </el-form-item>
                <b style="margin-left: 5px;margin-right: 5px;">~</b>
            <el-form-item label="" prop="end_time" label-width="0">
                <el-date-picker type="date" size="small" placeholder="选择日期" style="width: 160px;" v-model="ruleForm.end_time"></el-date-picker>
            </el-form-item>
						<div style="margin-left: 10px">
							<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
						</div>
					</el-form>
				</div>
			</div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
			<v-lrhdt :searchData="searchData" :activeType="activeType"></v-lrhdt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VLrhdt from "./common/LRHDTable.vue";

export default {
  data() {
    var startdate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.end_time)) <
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    var enddate = (rule, value, callback) => {
      if (
        Date.parse(new Date(this.ruleForm.start_time)) >
        Date.parse(new Date(value))
      ) {
        callback(new Error(this.message.EndTimeWarning));
      }
      callback();
    };
    return {
      ruleForm: {
        name: "",
        start_time: "",
        end_time: "",
        type: ""
      },
      rules: {
        start_time: [{ validator: startdate, trigger: "change" }],
        end_time: [{ validator: enddate, trigger: "change" }]
      },
      searchData: {},
      activeType: []
    };
  },
  components: {
    VLrhdt
  },
  mounted() {
    this.fetchActiveType();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var start_time;
          var end_time;
          if (
            this.ruleForm.start_time == "" ||
            this.ruleForm.start_time == null
          ) {
            start_time = "";
          } else {
            start_time = this.ruleForm.start_time.getTime() / 1000;
          }
          if (this.ruleForm.end_time == "" || this.ruleForm.end_time == null) {
            end_time = "";
          } else {
            end_time = this.ruleForm.end_time.getTime() / 1000;
          }
          var data = {
            name: this.ruleForm.name,
            start_time: start_time,
            end_time: end_time,
            type: this.ruleForm.type
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchActiveType: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_CARE_ACTIVITY_TYPE
      };
      const res = await this.$http.post(url, data);
      this.activeType = res.data.data;
    }
  }
};
</script>

<style scoped>
.lrhd {
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.el-form-item {
  margin-bottom: 0;
}
@media screen and (max-width: 1380px) {
  .find {
    display: flex;
    justify-content: flex-end;
  }
  .find form {
    width: 465px;
    justify-content: flex-start;
  }
}
</style>