<template>
	<div class="elderAbility">
		<el-container class="pop">
			<el-header style="height: auto;">
                <div class="pop-top">
                    <h5>能力评估</h5>
                    <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
                </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                    <div class="qxz">
                        <el-form ref="form" :model="form" label-width="150px">
                            <el-tabs type="border-card" v-model="activeName">
                                <el-tab-pane label="疾病诊断" name="1" disabled>
                                    <el-form-item label="A.2.14.1 痴呆:">
                                        <el-radio-group v-model="form.dementia_score" style="display: flex;flex-direction: column;">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，轻度</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，中度</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;white-space: normal;">3分，重度</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="A.2.14.2 精神疾病:">
                                        <el-radio-group v-model="form.mental_disease_score" style="display: flex;flex-direction: column;">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，精神分裂症</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，双向情感障碍</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，偏执性精神障碍</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分，分裂情感性障碍</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，癫痫所致精神障碍</el-radio>
                                        <el-radio :label="6" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">6分，精神发育迟滞伴发精神障碍</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                                        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="handleBtnNext(1)">下一步</el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="近30天内意外事件" name="2" disabled>
                                    <el-form-item label="A.2.15.1 跌倒:">
                                        <el-radio-group v-model="form.fall_down_score" style="display: flex;flex-direction: column;">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，发生过1次</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，发生过2次</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，发生过3次及以上</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="A.2.15.2 走失:">
                                        <el-radio-group v-model="form.get_lost_score" style="display: flex;flex-direction: column;">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，发生过1次</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，发生过2次</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，发生过3次及以上</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="A.2.15.3 噎食:">
                                        <el-radio-group v-model="form.choke_score" style="display: flex;flex-direction: column;">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，发生过1次</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，发生过2次</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，发生过3次及以上</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="A.2.15.4 自杀:">
                                        <el-radio-group v-model="form.suicide_score" style="display: flex;flex-direction: column;">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，发生过1次</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，发生过2次</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，发生过3次及以上</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                                        <el-button type="info" size="medium" @click="handleBtnPrev(2)">上一步</el-button>
                                        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="handleBtnNext(2)">下一步</el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="日常生活活动" name="3" disabled>
                                    <el-form-item label="B.1.1 进食:">
                                        <el-radio-group v-model="form.eat_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，可独立进食（在合理的时间内独立进食准备好的食物）</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，需部分帮助（进食过程中需要一定帮助，如协助把持餐具）</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，需极大帮助或完全依赖他人，或有留置营养管</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.2 洗澡:">
                                        <el-radio-group v-model="form.bathe_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，准备好洗澡水后，可自己独立完成洗澡过程</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，在洗澡过程中需他人帮助</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.3 修饰:">
                                        <el-radio-group v-model="form.dress_up_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，可自己独立完成</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，需他人帮助</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.4 穿衣:">
                                        <el-radio-group v-model="form.dress_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，可独立完成</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，需部分帮助（能自己穿脱，但需他人帮助整理衣服，系扣/鞋带、拉拉链）</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，需极大帮助或完全依赖他人</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.5 大便控制:">
                                        <el-radio-group v-model="form.stool_control_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，可控制大便</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，偶尔失控（每周1次），或需要他人提示</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，完全失控</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.6 小便控制:">
                                        <el-radio-group v-model="form.urination_control_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，可控制小便</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，偶尔失控（每天小于1次，但每周大于1次），或需要他人提示</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，完全失控，或留置导尿管</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.7 如厕:">
                                        <el-radio-group v-model="form.go_to_bathroom_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，可独立完成</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，需部分帮助（需他人帮忙冲水或整理衣裤等）</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，需极大帮助或完全依赖他人</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.8 床椅转移:">
                                        <el-radio-group v-model="form.move_bed_chair_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="15" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">15分，可独立完成</el-radio>
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，需部分帮助（需他人搀扶或使用拐杖）</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，需极大帮助（较大程度上依赖他人搀扶和帮助）</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，完全依赖他人</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.9 平地行走:">
                                        <el-radio-group v-model="form.level_walking_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="15" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">15分，可独立在平地上行走45m</el-radio>
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，需部分帮助（因肢体残疾、平衡能力差、过度衰弱、视力等问题，在一定程度上需他人地搀扶或使用拐杖、助行器等辅助用具）</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，需极大帮助（因肢体残疾、平衡能力差、过度衰弱、视力等问题，在较大程度上依赖他人搀扶，或坐在轮椅上自行移动）</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，完全依赖他人</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.10 上下楼梯:">
                                        <el-radio-group v-model="form.stair_activity_score" style="display: flex;flex-direction: column;" @change="sumScore1()">
                                        <el-radio :label="10" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">10分，可独立上下楼梯（连续上下10-15个台阶）</el-radio>
                                        <el-radio :label="5" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">5分，需部分帮助（需他人搀扶，或扶着楼梯、使用拐杖等）</el-radio>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，需极大帮助或完全依赖他人</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.1.11 日常活动总分:">
                                        <el-input v-model="form.daily_living_activity_score" placeholder="上述10个项目得分之和" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item label="B.1 日常生活活动分级:">
                                        <el-radio-group v-model="form.daily_living_activity_grade_score" style="display: flex;flex-direction: column;" disabled>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0 能力完好：总分100分</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1 轻度受损：总分65-95分</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2 中度受损：总分45-60分</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3 重度受损：总分≤40分</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                                        <el-button type="info" size="medium" @click="handleBtnPrev(3)">上一步</el-button>
                                        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="handleBtnNext(3)">下一步</el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="精神状态" name="4" disabled>
                                    <el-form-item label="B.2.1 认知功能:">
                                        <el-radio-group v-model="form.cognitive_function_score" style="display: flex;flex-direction: column;" @change="sumScore2()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，画钟正确（画出一个闭锁圆，指针位置准确），且能回忆出2-3个词</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，画钟错误（画的圆不闭锁，或指针位置不准确），且能回忆出0-1个词</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，已确诊为认知障碍，如老年痴呆</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.2.2 攻击行为:">
                                        <el-radio-group v-model="form.aggressive_behavior_score" style="display: flex;flex-direction: column;" @change="sumScore2()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无身体攻击行为（如打/踢/推/咬/抓/摔东西）和语言攻击行为（如骂人、语言威胁、尖叫）</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，每月有几次身体攻击行为，或每周有几次语言攻击行为</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，每周有几次身体攻击行为，或每日有语言攻击行为</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.2.3 抑郁症状:">
                                        <el-radio-group v-model="form.depressive_symptoms_score" style="display: flex;flex-direction: column;" @change="sumScore2()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，情绪低落、不爱说话、不爱梳洗、不爱活动</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，有自杀念头或自杀行为</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.2.4 精神状态总分:">
                                        <el-input v-model="form.mental_state_score" placeholder="上述3个项目得分之和" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item label="B.2 精神状态分级:">
                                        <el-radio-group v-model="form.mental_state_grade_score" style="display: flex;flex-direction: column;" disabled>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0 能力完好：总分0分</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1 轻度受损：总分1分</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2 中度受损：总分2-3分</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3 重度受损：总分4-6分</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                                        <el-button type="info" size="medium" @click="handleBtnPrev(4)">上一步</el-button>
                                        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="handleBtnNext(4)">下一步</el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="感知觉与沟通" name="5" disabled>
                                    <el-form-item label="B.3.1 意识水平:">
                                        <el-radio-group v-model="form.consciousness_level_score" style="display: flex;flex-direction: column;" @change="sumScore3()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，神志清醒，对周围环境警觉</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，嗜睡，表现为睡眠状态过渡延长。当呼唤或推动其肢体可唤醒，并能进行正确的交谈或执行指令，停止刺激后又继续入睡</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，昏睡，一般的外界刺激不能使其觉醒，给予较强烈的刺激时可有短时的意识清醒，醒后可简短回答提问，当刺激减弱后又很快进入睡眠状态</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，已确诊为认知障碍，如老年痴呆</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.3.2 视力:">
                                        <el-radio-group v-model="form.vision_score" style="display: flex;flex-direction: column;" @change="sumScore3()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，能看清书报上的标准字体</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，能看清楚大字体，但看不清书报上的标准字体</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，视力有限，看不清报纸大标题，但能辨认物体</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，辨认物体有困难，但眼睛能跟随物体移动，只能看到光、颜色和形状</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分，没有视力，眼睛不能跟随物体移动</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.3.3 听力:">
                                        <el-radio-group v-model="form.hearing_score" style="display: flex;flex-direction: column;" @change="sumScore3()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，可正常交谈，能听到电视、电话、门铃的声音</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，在轻声说话或说话距离超过2米时听不清</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，正常交流有些困难，需要在安静的环境或大声说话才能听到</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，讲话者大声说话或说话很慢，才能部分听见</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分，完全听不见</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.3.4 沟通交流:">
                                        <el-radio-group v-model="form.communicate_score" style="display: flex;flex-direction: column;" @change="sumScore3()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分，无困难，能与他人正常沟通和交流</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分，能够表达自己的需要及理解别人的话，但需要增加时间或给予帮助</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分，表达需要或理解有困难，需频繁重复或简化口头表达</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分，不能表达需要或理解他人的话</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.3 感知觉与沟通分级:">
                                        <el-radio-group v-model="form.sensory_perception_communicate_grade_score" style="display: flex;flex-direction: column;" disabled>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0 能力完好：意识为0，且视力和听力评为0或1，沟通评为0</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1 轻度受损：意识为0，但视力或听力中至少一项评为2，或沟通评为1</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2 中度受损：意识为0，但视力或听力中至少一项评为3，或沟通评为2；或意识为1，视力或听力评定为3及以下，沟通评为2及以下</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3 重度受损：意识小于等于1，但视力或听力中至少一项评为4，或沟通评为3；或意识大于1</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                                        <el-button type="info" size="medium" @click="handleBtnPrev(5)">上一步</el-button>
                                        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="handleBtnNext(5)">下一步</el-button>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="社会参与" name="6" disabled>
                                    <el-form-item label="B.4.1 生活能力:">
                                        <el-radio-group v-model="form.viability_score" style="display: flex;flex-direction: column;" @change="sumScore4()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分， 除个人生活自理外（如饮食、洗漱、穿戴、二便），能料理家务（如做饭、洗衣）或当家管理事务</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分， 除个人生活自理外，能做家务，但欠好，家庭事务安排欠条理</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分， 个人生活能自理；只有在他人帮助下才能做些家务，但质量不好</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分， 个人基本生活事务能自理（如饮食、二便），在督促下可洗漱</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分， 个人基本生活事务（如饮食、二便）需要部分帮助或完全依赖他人帮助</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.4.2 工作能力:">
                                        <el-radio-group v-model="form.working_ability_score" style="display: flex;flex-direction: column;" @change="sumScore4()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分， 原来熟练的脑力工作或体力技巧性工作可照常进行</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分， 原来熟练的脑力工作或体力技巧性工作能力有所下降</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分， 原来熟练的脑力工作或体力技巧性工作不如以往，部分遗忘</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分， 对熟练工作只有一些片段保留，技能全部遗忘</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分， 对以往的知识或技能全部磨灭</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.4.3 时间/空间定向:">
                                        <el-radio-group v-model="form.space_time_cognition_score" style="display: flex;flex-direction: column;" @change="sumScore4()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分， 时间观念（年、月、日、时）清楚；可单独出远门，能很快掌握新环境的方位</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分， 时间观念有些下降，年、月、日、时清楚，但有时相差几天；可单独来往于进街，知道现住地的名称和方位，但不知回家路线</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分， 时间观念较差，年、月、日不清楚，可知上半年或下半年；只能单独在家附近行动，对现住地只知名称，不知道方位</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分， 时间观念较差，年、月、日不清楚，可知上午或下午；只能在左领右舍间串门，对现住地不知名称和方位</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分， 无时间观念；不能单独外出</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.4.4 人物定向:">
                                        <el-radio-group v-model="form.personnel_cognition_score" style="display: flex;flex-direction: column;" @change="sumScore4()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分， 知道周围人们的关系，知道祖孙、叔伯、姑姨、侄子侄女等称谓的意义；可分辨陌生人的大致年龄和身份，可用适当称呼</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分， 只知家中亲密近亲的关系，不会分辨陌生人的大致年龄，不能称呼陌生人</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分， 只能称呼家中人，或只能照样称呼，不知其关系，不辩辈份</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分， 只认识常同住的亲人，可称呼子女或孙子女，可辩熟人和生人</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分， 只认识保护人，不辩熟人和生人</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.4.5 社会交往能力:">
                                        <el-radio-group v-model="form.social_communication_ability_score" style="display: flex;flex-direction: column;" @change="sumScore4()">
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0分， 参与社会，在社会环境有一定的适应能力，待人接物恰当</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1分， 能适应单纯环境，主动接触人，初见面时难让人发现智力问题，不能理解隐喻语</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2分， 脱离社会，可被动接触，不会主动待人，表情不恰当</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3分， 勉强可与人交往，谈吐内容不清楚，表情不恰当</el-radio>
                                        <el-radio :label="4" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">4分， 难以与人接触</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="B.4.6 社会参与总分:">
                                        <el-input v-model="form.social_score" placeholder="上述5个项目得分之和" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item label="B.4 社会参与分级:">
                                        <el-radio-group v-model="form.social_grade_score" style="display: flex;flex-direction: column;" disabled>
                                        <el-radio :label="0" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">0 能力完好：总分0-2分</el-radio>
                                        <el-radio :label="1" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">1 轻度受损：总分3-7分</el-radio>
                                        <el-radio :label="2" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">2 中度受损：总分8-13分</el-radio>
                                        <el-radio :label="3" style="margin-left: 30px;margin-top: 5px;white-space: normal;line-height: 22px;">3 总分14-20分</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                                        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="submitForm('form')">查看评估结果</el-button>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
export default {
  props: ["abilityDetail", "elderId", "hid"],
  data() {
    return {
      form: {
        dementia_score: "",
        mental_disease_score: "",
        fall_down_score: "",
        get_lost_score: "",
        choke_score: "",
        suicide_score: "",
        eat_score: "",
        bathe_score: "",
        dress_up_score: "",
        dress_score: "",
        stool_control_score: "",
        urination_control_score: "",
        go_to_bathroom_score: "",
        move_bed_chair_score: "",
        level_walking_score: "",
        stair_activity_score: "",
        daily_living_activity_score: "",
        daily_living_activity_grade_score: "",
        cognitive_function_score: "",
        aggressive_behavior_score: "",
        depressive_symptoms_score: "",
        mental_state_score: "",
        mental_state_grade_score: "",
        consciousness_level_score: "",
        vision_score: "",
        hearing_score: "",
        communicate_score: "",
        sensory_perception_communicate_grade_score: "",
        viability_score: "",
        working_ability_score: "",
        space_time_cognition_score: "",
        personnel_cognition_score: "",
        social_communication_ability_score: "",
        social_score: "",
        social_grade_score: ""
      },
      activeName: "1"
    };
  },
  watch: {},
  mounted() {
    this.form.dementia_score = this.abilityDetail.dementia_score;
    this.form.mental_disease_score = this.abilityDetail.mental_disease_score;
    this.form.fall_down_score = this.abilityDetail.fall_down_score;
    this.form.get_lost_score = this.abilityDetail.get_lost_score;
    this.form.choke_score = this.abilityDetail.choke_score;
    this.form.suicide_score = this.abilityDetail.suicide_score;
    this.form.eat_score = this.abilityDetail.eat_score;
    this.form.bathe_score = this.abilityDetail.bathe_score;
    this.form.dress_up_score = this.abilityDetail.dress_up_score;
    this.form.dress_score = this.abilityDetail.dress_score;
    this.form.stool_control_score = this.abilityDetail.stool_control_score;
    this.form.urination_control_score = this.abilityDetail.urination_control_score;
    this.form.go_to_bathroom_score = this.abilityDetail.go_to_bathroom_score;
    this.form.move_bed_chair_score = this.abilityDetail.move_bed_chair_score;
    this.form.level_walking_score = this.abilityDetail.level_walking_score;
    this.form.stair_activity_score = this.abilityDetail.stair_activity_score;
    this.form.daily_living_activity_score = this.abilityDetail.daily_living_activity_score;
    this.form.daily_living_activity_grade_score = this.abilityDetail.daily_living_activity_grade_score;
    this.form.cognitive_function_score = this.abilityDetail.cognitive_function_score;
    this.form.aggressive_behavior_score = this.abilityDetail.aggressive_behavior_score;
    this.form.depressive_symptoms_score = this.abilityDetail.depressive_symptoms_score;
    this.form.mental_state_score = this.abilityDetail.mental_state_score;
    this.form.mental_state_grade_score = this.abilityDetail.mental_state_grade_score;
    this.form.consciousness_level_score = this.abilityDetail.consciousness_level_score;
    this.form.vision_score = this.abilityDetail.vision_score;
    this.form.hearing_score = this.abilityDetail.hearing_score;
    this.form.communicate_score = this.abilityDetail.communicate_score;
    this.form.sensory_perception_communicate_grade_score = this.abilityDetail.sensory_perception_communicate_grade_score;
    this.form.viability_score = this.abilityDetail.viability_score;
    this.form.working_ability_score = this.abilityDetail.working_ability_score;
    this.form.space_time_cognition_score = this.abilityDetail.space_time_cognition_score;
    this.form.personnel_cognition_score = this.abilityDetail.personnel_cognition_score;
    this.form.social_communication_ability_score = this.abilityDetail.social_communication_ability_score;
    this.form.social_score = this.abilityDetail.social_score;
    this.form.social_grade_score = this.abilityDetail.social_grade_score;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            hid: this.hid,
            elder_id: this.elderId,
            dementia_score: this.form.dementia_score,
            mental_disease_score: this.form.mental_disease_score,
            fall_down_score: this.form.fall_down_score,
            get_lost_score: this.form.get_lost_score,
            choke_score: this.form.choke_score,
            suicide_score: this.form.suicide_score,
            eat_score: this.form.eat_score,
            bathe_score: this.form.bathe_score,
            dress_up_score: this.form.dress_up_score,
            dress_score: this.form.dress_score,
            stool_control_score: this.form.stool_control_score,
            urination_control_score: this.form.urination_control_score,
            go_to_bathroom_score: this.form.go_to_bathroom_score,
            move_bed_chair_score: this.form.move_bed_chair_score,
            level_walking_score: this.form.level_walking_score,
            stair_activity_score: this.form.stair_activity_score,
            daily_living_activity_score: this.form.daily_living_activity_score,
            daily_living_activity_grade_score: this.form
              .daily_living_activity_grade_score,
            cognitive_function_score: this.form.cognitive_function_score,
            aggressive_behavior_score: this.form.aggressive_behavior_score,
            depressive_symptoms_score: this.form.depressive_symptoms_score,
            mental_state_score: this.form.mental_state_score,
            mental_state_grade_score: this.form.mental_state_grade_score,
            consciousness_level_score: this.form.consciousness_level_score,
            vision_score: this.form.vision_score,
            hearing_score: this.form.hearing_score,
            communicate_score: this.form.communicate_score,
            sensory_perception_communicate_grade_score: this.form
              .sensory_perception_communicate_grade_score,
            viability_score: this.form.viability_score,
            working_ability_score: this.form.working_ability_score,
            space_time_cognition_score: this.form.space_time_cognition_score,
            personnel_cognition_score: this.form.personnel_cognition_score,
            social_communication_ability_score: this.form
              .social_communication_ability_score,
            social_score: this.form.social_score,
            social_grade_score: this.form.social_grade_score
          };
          this.$parent.saveAbility(data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleBtnNext(n) {
      this.activeName = (n + 1).toString();
    },
    handleBtnPrev(n) {
      this.activeName = (n - 1).toString();
    },
    hideEdit() {
      this.$store.dispatch("abilityEditFalse");
      this.$parent.$parent.$parent.$parent.detailEmpty();
    },
    sumScore1() {
      if (
        this.form.eat_score !== "" &&
        this.form.bathe_score !== "" &&
        this.form.dress_up_score !== "" &&
        this.form.dress_score !== "" &&
        this.form.stool_control_score !== "" &&
        this.form.urination_control_score !== "" &&
        this.form.go_to_bathroom_score !== "" &&
        this.form.move_bed_chair_score !== "" &&
        this.form.level_walking_score !== "" &&
        this.form.stair_activity_score !== ""
      ) {
        var totalScore =
          this.form.eat_score * 1 +
          this.form.bathe_score * 1 +
          this.form.dress_up_score * 1 +
          this.form.dress_score * 1 +
          this.form.stool_control_score * 1 +
          this.form.urination_control_score * 1 +
          this.form.go_to_bathroom_score * 1 +
          this.form.move_bed_chair_score * 1 +
          this.form.level_walking_score * 1 +
          this.form.stair_activity_score * 1;
        this.form.daily_living_activity_score = totalScore;
        if (totalScore == 100) {
          this.form.daily_living_activity_grade_score = 0;
        } else if (totalScore >= 65 && totalScore <= 95) {
          this.form.daily_living_activity_grade_score = 1;
        } else if (totalScore >= 45 && totalScore <= 60) {
          this.form.daily_living_activity_grade_score = 2;
        } else {
          this.form.daily_living_activity_grade_score = 3;
        }
      }
    },
    sumScore2() {
      if (
        this.form.cognitive_function_score !== "" &&
        this.form.aggressive_behavior_score !== "" &&
        this.form.depressive_symptoms_score !== ""
      ) {
        var totalScore =
          this.form.cognitive_function_score * 1 +
          this.form.aggressive_behavior_score * 1 +
          this.form.depressive_symptoms_score * 1;
        this.form.mental_state_score = totalScore;
        if (totalScore == 0) {
          this.form.mental_state_grade_score = 0;
        } else if (totalScore == 1) {
          this.form.mental_state_grade_score = 1;
        } else if (totalScore >= 2 && totalScore <= 3) {
          this.form.mental_state_grade_score = 2;
        } else {
          this.form.mental_state_grade_score = 3;
        }
      }
    },
    sumScore3() {
      if (
        this.form.consciousness_level_score !== "" &&
        this.form.vision_score !== "" &&
        this.form.hearing_score !== "" &&
        this.form.communicate_score !== ""
      ) {
        if (
          this.form.consciousness_level_score == 0 &&
          this.form.communicate_score == 0 &&
          this.form.vision_score <= 1 &&
          this.form.hearing_score <= 1
        ) {
          this.form.sensory_perception_communicate_grade_score = 0;
        } else if (
          this.form.consciousness_level_score == 0 &&
          (this.form.vision_score == 2 ||
            this.form.hearing_score == 2 ||
            this.form.communicate_score == 1)
        ) {
          this.form.sensory_perception_communicate_grade_score = 1;
        } else if (
          (this.form.consciousness_level_score == 0 &&
            (this.form.vision_score == 3 ||
              this.form.hearing_score == 3 ||
              this.form.communicate_score == 2)) ||
          (this.form.consciousness_level_score == 1 &&
            (this.form.vision_score <= 3 || this.form.hearing_score <= 3) &&
            this.form.communicate_score <= 2)
        ) {
          this.form.sensory_perception_communicate_grade_score = 2;
        } else if (
          (this.form.consciousness_level_score <= 1 &&
            (this.form.vision_score == 4 ||
              this.form.hearing_score == 4 ||
              this.form.communicate_score == 3)) ||
          this.form.consciousness_level_score > 1
        ) {
          this.form.sensory_perception_communicate_grade_score = 3;
        }
      }
    },
    sumScore4() {
      if (
        this.form.viability_score !== "" &&
        this.form.working_ability_score !== "" &&
        this.form.space_time_cognition_score !== "" &&
        this.form.personnel_cognition_score !== "" &&
        this.form.social_communication_ability_score !== ""
      ) {
        var totalScore =
          this.form.viability_score * 1 +
          this.form.working_ability_score * 1 +
          this.form.space_time_cognition_score * 1 +
          this.form.personnel_cognition_score * 1 +
          this.form.social_communication_ability_score * 1;
        this.form.social_score = totalScore;
        if (totalScore >= 0 && totalScore <= 2) {
          this.form.social_grade_score = 0;
        } else if (totalScore >= 3 && totalScore <= 7) {
          this.form.social_grade_score = 1;
        } else if (totalScore >= 8 && totalScore <= 13) {
          this.form.social_grade_score = 2;
        } else {
          this.form.social_grade_score = 3;
        }
      }
    },
    hideEditFalse() {
      this.$store.dispatch("elderAbilityFalse");
    }
  }
};
</script>

<style scoped>
span {
  white-space: normal;
}
.pop {
  display: block;
  width: 800px;
  height: 570px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -285px;
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
.elderAbility {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
</style>