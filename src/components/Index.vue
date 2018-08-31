<template>
  <el-container style="height: 100%;background: #f1f1f1;">
    <el-scrollbar class="scrollbar" style="height: 100%;position: absolute;">
      <el-header style="min-height: 60px;height: auto;background: #ffffff;position: relative;padding: 1px !important;">
        <div class="headerTop">
          <h6 class="main_Top_tit">相关数据</h6>
        </div>
        <div style="display: flex;justify-content: flex-start;margin: 35px 0 25px 35px;">
          <div class="KJgg">
            <router-link :to="{path: '/djgl/zylr'}">
              <img src="../../static/img/data1.png">
            </router-link>
            <div class="KJgg1">
              <p class="KJgg1_tit">老人人数（人）</p>
              <p class="KJgg1_con">{{ elder }}</p>
            </div>
          </div>
          <div class="KJgg">
            <router-link :to="{path: '/hlgl/nurse'}">
              <img src="../../static/img/data2.png">
            </router-link>
            <div class="KJgg1">
              <p class="KJgg1_tit">员工人数（人）</p>
              <p class="KJgg1_con">{{ employees }}</p>
            </div>
          </div>
        <div class="KJgg">
          <router-link :to="{path: '/fwgl/cwsz/buildt'}">
            <img src="../../static/img/data3.png">
          </router-link>
            <div class="KJgg1">
              <p class="KJgg1_tit">总床位数（张）</p>
              <p class="KJgg1_con">{{ bedcount }}</p>
            </div>
          </div>
        <div class="KJgg" style="width: 220px;">
            <img src="../../static/img/data4.png" style="cursor: default">
            <div class="KJgg1">
              <p class="KJgg1_tit">床位入住率（%）</p>
              <p class="KJgg1_con">{{ bedrate }}</p>
            </div>
          </div>
        </div>
      </el-header>
      <el-header style="min-height: 60px;height: auto;background: #ffffff;position: relative;margin-top: 20px;padding: 1px !important;">
        <div class="headerTop">
          <h6 class="main_Top_tit">今日事项</h6>
        </div>
        <div style="display: flex;justify-content: flex-start;margin: 35px 0 25px 35px;">
          <div class="JRsx" style="background: url(../../static/img/today1.png);">
            <p class="JRsx1_tit">今日入住</p>
            <p class="JRsx1_con">{{ checkin }}</p> 
          </div>
          <div class="JRsx" style="background: url(../../static/img/today2.png);">
            <p class="JRsx1_tit">今日外出</p>
            <p class="JRsx1_con">{{ out }}</p> 
          </div>
          <div class="JRsx" style="background: url(../../static/img/today3.png);">
            <p class="JRsx1_tit">今日探访</p>
            <p class="JRsx1_con">{{ visits }}</p> 
          </div>
          <!-- <div class="JRsx" style="background: url(../../static/img/today4.png);">
            <p class="JRsx1_tit">今日试住</p>
            <p class="JRsx1_con">102</p> 
          </div> -->
        </div>
      </el-header>
      <el-main style="padding-left: 0;padding-right: 0;">
        <div style="display: flex;align-items: center;justify-content: space-between;">
          <!-- <div class="mainTopLeft">
            <h6 class="main_Top_tit">本月老人状态</h6>
            <div style="margin-top: -60px;display: flex;justify-content: center;">
              <ve-pie :data="chartData" width="450px" height="300px" :legend-visible="false"></ve-pie>
            </div>
          </div> -->
          <div class="mainTopCenter">
            <h6 class="main_Top_tit">本月老人状态走势</h6>
              <ve-line :data="outInData" :judge-width="true" height="370px" :settings="chartSettings" :legend-visible="false" :grid="chartGrid"></ve-line>
          </div>
          <!-- <div class="mainTopRight">
            <h6 class="main_Top_tit">待办事务</h6>
            <div style="margin-top: 20px; display: flex;justify-content: center;">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column label="事务类型"></el-table-column>
                <el-table-column label="时间"></el-table-column>
                <el-table-column label="操作"></el-table-column>
              </el-table>
            </div>
          </div> -->
        </div>
        <div style="display: flex;align-items: center;justify-content: space-between;margin-top: 20px;">
          <div class="mainBottomLeft">
            <h6 class="main_Top_tit">护理等级统计</h6>
            <div style="margin-top: 20px; display: flex;justify-content: center;">
              <el-table :data="nurseLevelData" style="width: 100%">
                <el-table-column prop="level_id" label="护理类型"></el-table-column>
                <el-table-column prop="service_type" label="护理等级"></el-table-column>
                <el-table-column prop="count" label="选择人数"></el-table-column>
              </el-table>
            </div>
          </div>
          <!-- <div class="mainBottomCenter">
            <h6 class="main_Top_tit">财务出入账</h6>
            <div style="margin-top: 20px; display: flex;justify-content: center;">
              <el-table :data="tableData" style="width: 100%">
                <el-table-column label="月份"></el-table-column>
                <el-table-column label="收入"></el-table-column>
                <el-table-column label="支出"></el-table-column>
                <el-table-column label="盈余"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="mainBottomRight">
            <h6 class="main_Top_tit">小组护理情况</h6>
            <div style="margin-top: -30px;display: flex;justify-content: center;">
              <ve-histogram :data="chartData"  width="370px" height="370px" :legend-visible="false"></ve-histogram>
            </div>
          </div> -->
        </div>
      </el-main>
    </el-scrollbar>
</el-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    this.chartGrid = {
      right: 40
    }
    this.chartSettings = {
      labelMap: {
        'checkout': '出院',
        'checkin': '入住',
        'trycheck': '试住'
      },
    }
    return {
      promise: [],
      outInData: {
          columns: ['date', 'checkout', 'checkin', 'trycheck'],
          rows: []
        },
      nurseLevelData: [],
      checkin: 0,
      elder: 0,
      bedrate: 0,
      bedcount: 0,
      out: 0,
      employees: 0,
      visits: 0,
    };
  },
  watch: {},
  mounted() {
    this.fetchIndex();
    this.fetchOutIn();
    this.fetchNursingLevel();
  },
  methods: {
    fetchIndex: async function(){
      let url = this.api.indexinfo;
      let data = {};
      const res = await this.$http.post(url, data);
      this.elder = res.data.data.elder;
      this.checkin = res.data.data.checkin;
      this.bedrate = res.data.data.bedrate;
      this.bedcount = res.data.data.bedcount;
      this.out = res.data.data.out;
      this.employees = res.data.data.employees;
      this.visits = res.data.data.visits;
    },
    fetchOutIn: async function(){
      let url = this.api.eldercheckoutstatistics;
      let data = {};
      const res = await this.$http.post(url, data);
      this.outInData.rows = res.data.data;
    },
    fetchNursingLevel: async function(){
      let url = this.api.chekinnursinglevelstatis;
      let data = {};
      const res = await this.$http.post(url, data);
      this.nurseLevelData = res.data.data;
    }
  },
  computed: mapState(["sideData"])
};
</script>

<style scoped>
.headerTop {
  width: 100%;
}
.main_Top_tit {
  height: 15px;
  font-size: 16px;
  line-height: 16px;
  margin-left: 1%;
  color: #666666;
  padding-left: 20px;
  margin-top: 20px;
  border-left: 4px solid #f56c6c;
}

.KJgg {
  width: 206px;
  height: 78px;
  background: #fff;
  margin-right: 40px;
}
.KJgg img {
  float: left;
  display: block;
}
.KJgg .KJgg1 {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  float: left;
  margin-left: 30px;
}

.KJgg .KJgg1 .KJgg1_tit {
  font-size: 14px;
  text-align: center;
  line-height: 13px;
  color: #666;
}
.KJgg .KJgg1 .KJgg1_con {
  font-size: 30px;
  margin-top: 20px;
  line-height: 29px;
  color: #333;
}

.JRsx {
  width: 288px;
  height: 118px;
  color: #fff;
}
.JRsx .JRsx1_tit {
  font-size: 15px;
  margin: 30px 0 0 90px;
}
.JRsx .JRsx1_con {
  font-size: 30px;
  margin: 10px 0 0 90px;
}

.mainTopLeft {
  background-color: #fff;
  height: 360px;
  width: 29%;
  float: left;
}
.mainTopCenter {
  background-color: #fff;
  height: 360px;
  /* width: 33%; */
  width: 100%;
  float: left;
}
.mainTopRight {
  background-color: #fff;
  height: 360px;
  width: 36%;
  float: left;
}
.mainBottomLeft {
  background-color: #fff;
  height: 360px;
  /* width: 31%; */
  width: 100%;
  float: left;
}
.mainBottomCenter {
  background-color: #fff;
  height: 360px;
  width: 36%;
  float: left;
}
.mainBottomRight {
  background-color: #fff;
  height: 360px;
  width: 31%;
  float: left;
}
</style>
