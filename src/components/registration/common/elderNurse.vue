<template>
<div>
    <div>
			<div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
				<p style="font-size: 20px;">能力评估</p>
				<el-button type="danger" size="small" @click="showAbility">编辑</el-button>
			</div>
			<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 20px;">
				<p style="width: 100px;color: #606266; font-size: 14px;">评估原因：</p>
				<el-input disabled :value="reason"></el-input>
			</div>
			<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 20px;">
				<p style="width: 140px;color: #606266; font-size: 14px;">评估基准日期：</p>
				<el-input disabled :value="H_time"></el-input>
			</div>
			<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 20px;color: #606266; font-size: 14px;">
				<p>一级指标分值：</p>
				<div>
					日常生活活动：{{daily_living_activity_grade_score !== '' ? daily_living_activity_grade_score : '---'}} 级  &nbsp;&nbsp;&nbsp;精神状态：{{mental_state_grade_score !== '' ? mental_state_grade_score : '---'}} 级  &nbsp;&nbsp;&nbsp;感知觉与沟通：{{sensory_perception_communicate_grade_score !== '' ? sensory_perception_communicate_grade_score : '---'}} 级  &nbsp;&nbsp;&nbsp;社会参与：{{social_grade_score !== '' ? social_grade_score : '---'}} 级
				</div>
			</div>
			<div style="margin-bottom: 10px;display: flex;align-items: center;">
				<p style="width: 190px;color: #606266; font-size: 14px;">老人初步能力等级：</p>
				<el-input disabled :value="preliminary_capacity_assessment"></el-input>
			</div>
			<div style="margin-bottom: 10px;display: flex;margin-bottom: 30px;color: #606266; font-size: 14px;">
				<p>等级变更条框：</p>
				<div>
					1.有认知障碍/痴呆，精神疾病者，在原有能力级别上提高一个等级 <br>
					2.近30天内发生过2次及以上跌倒在原有能力级别上提高一个等级 <br>
					3.处于昏迷状态者，直接评定为重度失能 <br>
					4.若初步登记确定为 “3级重度失能”，则不考虑上述1-3中各情况
				</div>
			</div>
			<div style="margin-bottom: 10px;display: flex;align-items: center;">
				<p style="width: 190px;color: #606266; font-size: 14px;">老人最终能力等级：</p>
				<el-input disabled :value="final_garde_score"></el-input>
			</div>
		</div>
	<div>
		<div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
				<p style="margin-left: 60px;font-size: 20px;">护理信息</p>
				<div></div>
		</div>
		<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
	      <div style="display: flex;flex-wrap: wrap;">
	        <el-form-item label="护理级别:" prop="levelid">
	            <el-input v-model="form.levelid" disabled style="width: 200px;"></el-input>
	        </el-form-item>
	          <el-form-item label="级别说明:" prop="levelintroduction">
	            <el-input v-model="form.levelintroduction" disabled style="width: 200px;"></el-input>
	          </el-form-item>
	          <el-form-item label="护理级别费用:" prop="levelprice">
	            <el-input v-model="form.levelprice" disabled style="width: 200px;"></el-input>
	          </el-form-item>
	        </div>
	        <div>
				<el-table
				    ref="multipleTable"
				    :data="tableData"
				    style="width: 100%">
				    <el-table-column
				      prop="name"
				      label="项目名称">
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
				      <template slot-scope="scope">
				      	<p>{{modes[scope.row.price_mode]}}</p>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="任务类型">
				      <template slot-scope="scope">
				      	<p>{{scope.row.task_type == 0 ? '一般任务' : '关键任务'}}</p>
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
					<div style="display: flex;margin-right: 20px;"></div>
			    </div>
			</div>
		</el-form>
	</div>
	<v-ability v-if="elderAbility" :abilityDetail="abilityDetail" :elderId="elderId" :hid="hid"></v-ability>
</div>
</template>

<script>
import vAbility from "./elderAbility.vue";
import { mapState } from "vuex";

export default {
  props: ["elderId"],
  data() {
    return {
      form: {
        levelid: "",
        levelintroduction: "",
        levelprice: ""
      },
      rules: {},
      levelList: [],
      modes: [
        this.message.times,
        this.message.days,
        this.message.weeks,
        this.message.months,
        this.message.years
      ],
      tableData: [],
			months: [
				'1号',
				'2号',
				'3号',
				'4号',
				'5号',
				'6号',
				'7号',
				'8号',
				'9号',
				'10号',
				'11号',
				'12号',
				'13号',
				'14号',
				'15号',
				'16号',
				'17号',
				'18号',
				'19号',
				'20号',
				'21号',
				'22号',
				'23号',
				'24号',
				'25号',
				'26号',
				'27号',
				'28号',
				'29号',
				'30号',
				'31号',
			],
			weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
			dayTimes: [
				'06:00',
				'06:30',
				'07:00',
				'07:30',
				'08:00',
				'08:30',
				'09:00',
				'09:30',
				'10:00',
				'10:30',
				'11:00',
				'11:30',
				'12:00',
				'12:30',
				'13:00',
				'13:30',
				'14:00',
				'14:30',
				'15:00',
				'15:30',
				'16:00',
				'16:30',
				'17:00',
				'17:30',
				'18:00',
				'18:30',
				'19:00',
				'19:30',
				'20:00',
				'20:30',
				'21:00',
				'21:30',
				'22:00',
				'22:30',
				'23:00',
				'23:30',
				'00:00',
				'00:30',
				'01:00',
				'01:30',
				'02:00',
				'02:30',
				'03:00',
				'03:30',
				'04:00',
				'04:30',
				'05:00',
				'05:30',
			],
      reason: "",
      H_time: "",
      daily_living_activity_grade_score: "",
      mental_state_grade_score: "",
      sensory_perception_communicate_grade_score: "",
      social_grade_score: "",
      preliminary_capacity_assessment: "",
      final_garde_score: "",
      abilityDetail: [],
      hid: 0,
      modes: [
        this.message.times,
        this.message.days,
        this.message.weeks,
        this.message.months,
        this.message.years
      ]
    };
  },
  components: {
    vAbility
  },
  mounted() {
    this.fetchDetail();
    this.fetchNurse();
  },
  methods: {
    showAbility() {
      this.$store.dispatch("elderAbilityTrue");
    },
    fetchNurse: async function() {
      let url = this.api.geteldernursingscheme;
      let data = {
        elderid: this.elderId
      };
      const res = await this.$http.post(url, data);
      if (res.data.data.length != 0) {
        let nurseDetail = res.data.data;
        this.form.levelid = nurseDetail.name;
        this.form.levelintroduction = nurseDetail.introduction;
        this.form.levelprice = nurseDetail.price;
        for (let i = 0; i < nurseDetail.iteminfos.length; i++) {
          var nurse = {
            name: nurseDetail.iteminfos[i].iteminfo.name,
            type_name: nurseDetail.iteminfos[i].iteminfo.type_name,
            price: nurseDetail.iteminfos[i].iteminfo.price,
            price_mode: nurseDetail.iteminfos[i].iteminfo.price_mode,
            task_type: nurseDetail.iteminfos[i].iteminfo.task_type,
            days: nurseDetail.iteminfos[i].days,
            times: nurseDetail.iteminfos[i].times
          };
          this.tableData.push(nurse);
        }
      }
    },
    fetchDetail: async function() {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.elderhealthevaluations;
      let data = {
        elder_id: this.elderId
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.reason = res.data.data.reason;
        this.H_time = res.data.data.H_time;
        this.daily_living_activity_grade_score =
          res.data.data.daily_living_activity_grade_score;
        this.mental_state_grade_score = res.data.data.mental_state_grade_score;
        this.sensory_perception_communicate_grade_score =
          res.data.data.sensory_perception_communicate_grade_score;
        this.social_grade_score = res.data.data.social_grade_score;
        this.preliminary_capacity_assessment =
          res.data.data.preliminary_capacity_assessment;
        this.final_garde_score = res.data.data.final_garde_score;
        this.abilityDetail = res.data.data;
        this.hid = res.data.data.hid;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      } else {
        this.$parent.$parent.$parent.$parent.loadingFalse();
      }
    },
    saveAbility: async function(data) {
      let url = this.api.addelderHealth;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.daily_living_activity_grade_score =
            res.data.data.daily_living_activity_grade_score;
          this.mental_state_grade_score =
            res.data.data.mental_state_grade_score;
          this.sensory_perception_communicate_grade_score =
            res.data.data.sensory_perception_communicate_grade_score;
          this.social_grade_score = res.data.data.social_grade_score;
          this.preliminary_capacity_assessment =
            res.data.data.preliminary_capacity_assessment;
          this.final_garde_score = res.data.data.final_garde_score;
					this.$store.dispatch("elderAbilityFalse");
					this.fetchDetail();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
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
  computed: mapState(["elderAbility"])
};
</script>

<style>
</style>
