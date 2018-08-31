<template>
	<div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 20px;">
			<p style="width: 100px;">老人姓名：</p>
			<el-input disabled :value="elder_name"></el-input>
		</div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 20px;">
			<p style="width: 100px;">身份证号：</p>
			<el-input disabled :value="id_number"></el-input>
		</div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 30px;">
			<p style="width: 100px;">所选标准：</p>
			<el-input disabled value="国家标准"></el-input>
		</div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;margin-bottom: 20px;">
			<p>一级指标分值：</p>
			<div>
				日常生活活动：{{daily_living_activity_grade_score !== '' ? daily_living_activity_grade_score : '---'}} 级  &nbsp;&nbsp;&nbsp;精神状态：{{mental_state_grade_score !== '' ? mental_state_grade_score : '---'}} 级  &nbsp;&nbsp;&nbsp;感知觉与沟通：{{sensory_perception_communicate_grade_score !== '' ? sensory_perception_communicate_grade_score : '---'}} 级  &nbsp;&nbsp;&nbsp;社会参与：{{social_grade_score !== '' ? social_grade_score : '---'}} 级
			</div>
		</div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;">
			<p style="width: 190px;">老人初步能力等级：</p>
			<el-input disabled :value="preliminary_capacity_assessment"></el-input>
		</div>
		<div style="margin-bottom: 10px;display: flex;margin-bottom: 30px;">
			<p>等级变更条框：</p>
			<div>
				1.有认知障碍/痴呆，精神疾病者，在原有能力级别上提高一个等级 <br>
				2.近30天内发生过2次及以上跌倒在原有能力级别上提高一个等级 <br>
				3.处于昏迷状态者，直接评定为重度失能 <br>
				4.若初步登记确定为 “3级重度失能”，则不考虑上述1-3中各情况
			</div>
		</div>
		<div style="margin-bottom: 10px;display: flex;align-items: center;">
			<p style="width: 190px;">老人最终能力等级：</p>
			<el-input disabled :value="final_garde_score"></el-input>
		</div>
        <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
            <el-button type="danger" size="medium" style="margin-left: 30px;" @click="hideEdit">关闭</el-button>
        </div>
	</div>
</template>

<script>
	export default {
		props: ['results', 'elderDetail'],
	    data() {
	      return {
	        preliminary_capacity_assessment: '',
			final_garde_score: '',
			elder_name: '',
			id_number: '',
			daily_living_activity_grade_score: '',
			mental_state_grade_score: '',
			social_grade_score: '',
			sensory_perception_communicate_grade_score: '',
	      }
	    },
	    watch:{
	    	results(){
				console.log(this.results)
	    		this.preliminary_capacity_assessment = this.results.preliminary_capacity_assessment;
	    		this.final_garde_score = this.results.final_garde_score;
	    		this.elder_name = this.results.elder_name;
	    		this.id_number = this.results.id_number;
	    		this.daily_living_activity_grade_score = this.results.daily_living_activity_grade_score;
	    		this.mental_state_grade_score = this.results.mental_state_grade_score;
	    		this.social_grade_score = this.results.social_grade_score;
	    		this.sensory_perception_communicate_grade_score = this.results.sensory_perception_communicate_grade_score;
	    	}
	    },
	    mounted(){
				console.log(this.elderDetail)
	    	if(this.results.length != 0){
	    		this.preliminary_capacity_assessment = this.results.preliminary_capacity_assessment;
	    		this.final_garde_score = this.results.final_garde_score;
	    		this.elder_name = this.results.elder_name;
	    		this.id_number = this.results.id_number;
	    		this.daily_living_activity_grade_score = this.results.daily_living_activity_grade_score;
	    		this.mental_state_grade_score = this.results.mental_state_grade_score;
	    		this.social_grade_score = this.results.social_grade_score;
	    		this.sensory_perception_communicate_grade_score = this.results.sensory_perception_communicate_grade_score;
	    	}else{
	    		this.preliminary_capacity_assessment = this.elderDetail.preliminary_capacity_assessment;
	    		this.final_garde_score = this.elderDetail.final_garde_score;
	    		this.elder_name = this.elderDetail.name;
	    		this.id_number = this.elderDetail.id_number;
	    		this.daily_living_activity_grade_score = this.elderDetail.daily_living_activity_grade_score;
	    		this.mental_state_grade_score = this.elderDetail.mental_state_grade_score;
	    		this.social_grade_score = this.elderDetail.social_grade_score;
	    		this.sensory_perception_communicate_grade_score = this.elderDetail.sensory_perception_communicate_grade_score;
	    	}
	    },
	    methods: {
		    hideEdit(){
		        this.$parent.$parent.$parent.$parent.hideEdit();
		    }
	    }
	  }
</script>
