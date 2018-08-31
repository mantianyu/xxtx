<template>
    <div class="contain">
        <el-scrollbar class="scrollbar" style="height: 100%;position: absolute;width: 100%;">
          <div style="display: flex;justify-content: space-between;">
            <div class="topLeft">
              <h6 class="main_Top_tit">护理级别统计</h6>
                <ve-ring :data="nurseLevelData" width="90%" height="400px" style="margin: 0 auto;margin-top: 20px;" :settings="nurseLevelSettings"></ve-ring>
            </div>
            <div class="topRight">
              <h6 class="main_Top_tit">体检统计</h6>
                <ve-histogram :data="healthData" width="90%" height="400px" style="margin: 0 auto;margin-top: 20px;" :settings="healthSettings" :yAxis="yAxis"></ve-histogram>
            </div>
          </div>
      
	  <!-- <div class="topRight">
        <h6 class="main_Top_tit">评估结果统计</h6>
        <div style="margin-top: 20px;display: flex;justify-content: center;">
          <ve-line :data="chartData" width="700px" height="400px" ></ve-line>
        </div>
      </div> -->
	  <!-- <div class="centerLeft">
        <h6 class="main_Top_tit">体检统计</h6>
        <div style="margin-top: 20px;display: flex;justify-content: center;">
          <ve-histogram :data="chartData" width="700px" height="400px" ></ve-histogram>
        </div>
      </div> -->
	  <!-- <div class="centerRight">
        <h6 class="main_Top_tit">用药类型统计</h6>
        <div style="margin-top: 20px;display: flex;justify-content: center;">
          <ve-line :data="chartData" width="470px" height="400px" ></ve-line>
        </div>
      </div> -->
	  <div class="bottom">
        <h6 class="main_Top_tit">床位类型统计</h6>
        <div style="margin-top: 20px;display: flex;justify-content: center;">
          <ve-bar :data="bedTypeData" width="90%" height="400px" :settings="bedTypeSettings" style="margin: 0 auto;margin-top: 20px;"></ve-bar>
        </div>
      </div>
    </el-scrollbar>
    </div>
</template>

<script>
import { mapState } from "vuex";
import VeLine from "v-charts/lib/line";

export default {
  data() {
    this.yAxis = {
        minInterval : 1,
    };
    this.nurseLevelSettings = {
      labelMap: {
        count: "数量"
      }
    };
    this.healthSettings = {
      labelMap: {
        count: "数量",
      }
    };
    return {
      promise: [],
      nurseLevelData: {
        columns: ["name", "count"],
        rows: []
      },
      healthData: {
        columns: ["date", "count"],
        rows: []
      },
      bedTypeData: {
        columns: [],
        rows: []
      },
      bedTypeSettings: {
        stack: {
          checkIn: [],
          appoint: []
        }
      }
    };
  },
  components: {
    VeLine
  },
  watch: {},
  mounted() {
    this.fetchNurseLevel();
    this.fetchHealth();
    this.fetchBedType();
  },
  methods: {
    fetchNurseLevel: async function() {
      let url = this.api.geteldernursinglevelstatistics;
      let data = {};
      const res = await this.$http.post(url, data);
      this.nurseLevelData.rows = res.data.data.data;
    },
    fetchHealth: async function() {
      let url = this.api.examinationstatis;
      let data = {};
      const res = await this.$http.post(url, data);
      this.healthData.rows = res.data.data;
    },
    fetchBedType: async function() {
      let url = this.api.weekbedtypestatis;
      let data = {};
      const res = await this.$http.post(url, data);
      this.bedTypeData.columns = res.data.data.type;
      this.bedTypeData.rows = res.data.data.data;
      this.bedTypeSettings.stack.checkin = res.data.data.checkin;
      this.bedTypeSettings.stack.appoint = res.data.data.appoint;
    }
  },
  computed: mapState(["sideData"])
};
</script>

<style scoped>
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
.contain {
  width: 100%;
  height: 100%;
  position: relative;
}
.topLeft {
  background-color: #fff;
  height: 480px;
  width: 40%;
  float: left;
}
.topRight {
  background-color: #fff;
  height: 480px;
  width: 58%;
  float: left;
}
.centerLeft {
  background-color: #fff;
  height: 480px;
  width: 57%;
  float: left;
}
.centerRight {
  background-color: #fff;
  height: 480px;
  width: 38%;
  float: left;
}
.bottom {
  background-color: #fff;
  height: 480px;
  width: 100%;
  float: left;
  margin-top: 20px;
}
</style>
