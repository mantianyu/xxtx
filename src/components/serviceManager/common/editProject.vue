<template>
	<div class="editProject" v-if="editProject">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>任务设置</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
							<div style="display: flex;flex-wrap: wrap;">
								<el-form-item label="执行频率:" prop="cycle">
									<el-radio-group v-model="form.cycle" @change="changeCycle">
									<el-radio :label="int3">月任务</el-radio>
									<el-radio :label="int2">周任务</el-radio>
									<el-radio :label="int1">天任务</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="任务类型" prop="type">
									<el-radio-group v-model="form.type">
									<el-radio :label="int0">一般任务</el-radio>
									<el-radio :label="int1">关键任务</el-radio>
									</el-radio-group>
								</el-form-item>
							</div>
							<el-form-item v-if="isMonths" label="选择日期:" prop="days">
								<el-checkbox-group v-model="form.days">
								<el-checkbox v-for="(month, index, key) in months" :label="index" :key="key" name="type" style="margin-left: 30px;">{{ month }}</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							<el-form-item v-if="isWeeks" label="选择星期:" prop="days">
								<el-checkbox-group v-model="form.days">
								<el-checkbox v-for="(week, index, key) in weeks" :label="index" :key="key" name="type" style="margin-left: 30px;">{{ week }}</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							<el-form-item v-if="isTimes" label="选择时间:" prop="times">
								<el-checkbox-group v-model="form.times">
								<el-checkbox v-for="(time, index, key) in times" :label="index" :key="key" name="type" style="margin-left: 30px;">{{ time }}</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							<div v-if="isTimes" class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
								<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
								<el-button type="danger" size="medium" style="margin-left: 30px;" @click="send">确认</el-button>
							</div>
						</el-form>
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["projectId", "taskType", "cycle", "daysArr", "timesArr"],
  data() {
    return {
      form: {
        cycle: "",
        type: this.taskType,
        days: [],
        times: []
      },
      rules: {
        nlname: [
          { required: true, message: this.message.pleaseChoiceExeFre, trigger: "change" }
        ],
        servicetype: [
          { required: true, message: this.message.pleaseChoiceTaskType, trigger: "change" }
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
      times: [
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
      int0: 0,
      int1: 1,
      int2: 2,
      int3: 3,
      isMonths: false,
      isWeeks: false,
      isTimes: false
    };
  },
  watch: {
    taskType() {
      this.form.type = this.taskType;
    },
    cycle() {
      this.form.cycle = this.cycle;
      this.changeCycle(this.cycle);
      this.form.days = this.daysArr;
      this.form.times = this.timesArr;
    },
    daysArr() {
      this.form.days = this.daysArr;
    },
    timesArr() {
      this.form.times = this.timesArr;
    }
  },
  mounted() {},
  methods: {
    hideEditFalse() {
      this.$store.dispatch("editProjectFalse");
      this.$parent.clean();
      this.form.cycle = "";
      this.form.type = this.taskType;
      this.form.days = [];
      this.form.times = [];
      this.isMonths = false;
      this.isWeeks = false;
      this.isTimes = false;
    },
    changeCycle(val) {
      this.form.days = [];
      this.form.times = [];
      if (val === 3) {
        this.isMonths = true;
        this.isWeeks = false;
        this.isTimes = true;
      } else if (val === 2) {
        this.isMonths = false;
        this.isWeeks = true;
        this.isTimes = true;
      } else if (val === 1) {
        this.isMonths = false;
        this.isWeeks = false;
        this.isTimes = true;
      }
    },
    send() {
      var data = {
        id: this.projectId,
        cycle: this.form.cycle,
        type: this.form.type,
        days: this.form.days,
        times: this.form.times
      };
      this.$parent.getProject(data);
      this.hideEditFalse();
    }
  },
  computed: mapState(["editProject"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 700px;
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
  margin-left: -350px;
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
.editProject {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 222;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>