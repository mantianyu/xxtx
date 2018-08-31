<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
			<h5>送餐记录</h5>
			<div class="find">
				<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
					<el-form-item label="送餐区域" prop="area_id">
						<el-select v-model="ruleForm.area_id" clearable placeholder="请选择送餐区域" size="small" style="width: 140px;">
								<el-option v-for="(area, key) in AreaLists" :label="area.name" :value="area.id" :key="key"></el-option>
					</el-select>
					</el-form-item>
					<el-form-item label="送餐人员" prop="delivery_man">
						<el-input type="text" v-model="ruleForm.delivery_man" size="small" auto-complete="off" style="width: 140px;"></el-input>
					</el-form-item>
					<el-form-item label="送餐时间" prop="start_time">
							<el-date-picker type="date" size="small" placeholder="选择日期" v-model="ruleForm.start_time" style="width: 160px;"></el-date-picker>
					</el-form-item>
							<b style="margin-left: 5px;margin-right: 5px;">~</b>
					<el-form-item label="" prop="end_time" label-width="0">
							<el-date-picker type="date" size="small" placeholder="选择日期" v-model="ruleForm.end_time" style="width: 160px;"></el-date-picker>
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
				<v-scjlt :searchData="searchData"></v-scjlt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VScjlt from "./common/SCJLTable.vue";

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
        area_id: "",
        delivery_man: "",
        start_time: "",
        end_time: ""
      },
      rules: {
				start_time: [
          { validator: startdate, trigger: 'change' }
        ],
				end_time: [
          { validator: enddate, trigger: 'change' }
        ],
			},
      searchData: {},
      AreaLists: []
    };
  },
  components: {
    VScjlt
  },
  mounted() {
    this.fetchAreaList();
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
            area_id: this.ruleForm.area_id,
            delivery_man: this.ruleForm.delivery_man,
            start_time: start_time,
            end_time: end_time
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchAreaList: async function() {
      let url = this.api.deliveryAreasList;
      var data = {};
      const res = await this.$http.post(url, data);
      this.AreaLists = res.data.data.data;
    }
  }
};
</script>

<style scoped>
.nlpg {
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