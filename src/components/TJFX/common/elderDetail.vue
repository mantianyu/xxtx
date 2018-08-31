<template>
  <div class="elderEdit">
    <el-container class="pop" v-loading="loading">
      <el-header style="height: auto;">
        <div class="pop-top">
          <h5>老人信息详情</h5>
          <div style="position: absolute;display: flex;left: 140px;top: 10px;">
            <div :class="{'pop-title':true, 'poptitlebg': isInfo}" @click="showInfo">基本信息登记</div>
            <div :class="{'pop-title':true, 'poptitlebg': isJKDA}" @click="showJKDA">健康档案</div>
            <div :class="{'pop-title':true, 'poptitlebg': isHLPG}" @click="showHLPG">护理评估</div>
          </div>
          <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
        </div>
      </el-header>
      <el-main style="height: 92.7%;">
        <el-scrollbar class="scrollbar" style="width: 100%;height: 91%;overflow-x: hidden;position: absolute;left: 0;top: 0;margin-top: 50px;">
          <div class="qxz">
            <v-info
              v-if="isInfo"
              :elderDetail="elderDetail"
              :labour_capacity="labour"
              :blood_group="blood"
              :political_status="political"
              :profession="retired"
              :elder_type="elderType"
              :elderId="elderId"
              :marital_status="marital"
              :nationality="national"
              :living_status="living"
              :religion="religion"
              :education="education"
              :income_source="income"
              :medical_security="medical"
              :care="care" 
              :relation="relation"></v-info>
              <v-jkda
              v-if="isJKDA" 
              :elderId="elderId"></v-jkda>
              <v-hlpg
              v-if="isHLPG"
              :elderId="elderId"></v-hlpg>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vInfo from "./elderInfo.vue";
import vJkda from "./elderHealth.vue";
import vHlpg from "./elderNurse.vue";

export default {
  props: [
    "elderId",
    "national",
    "education",
    "religion",
    "marital",
    "living",
    "medical",
    "income",
    "labour",
    "blood",
    "political",
    "retired",
    "elderType",
    "care",
    "relation"
  ],
  data() {
    return {
      isInfo: true,
      isJKDA: false,
      isHLPG: false,
      elderDetail: [],
      loading: false
    };
  },
  components: {
    vInfo, vJkda, vHlpg
  },
  watch: {},
  mounted() {
    this.fetchDetail();
  },
  methods: {
    showInfo() {
      this.isInfo = true;
      this.isJKDA = false;
      this.isHLPG = false;
      this.fetchDetail();
    },
    showJKDA() {
      this.isInfo = false;
      this.isJKDA = true;
      this.isHLPG = false;
      this.fetchDetail();
    },
    showHLPG() {
      this.isInfo = false;
      this.isJKDA = false;
      this.isHLPG = true;
      this.fetchDetail();
    },
    fetchDetail: async function() {
      this.loading = true;
      let url = this.api.elderdetail;
      let data = {
        elder_id: this.elderId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.elderDetail = res.data.data;
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
    loadingFalse() {
      this.loading = false;
    },
    hideEditFalse() {
      this.$store.dispatch("elderEditFalse");
      this.$parent.fetchList(1);
      this.elderDetail = [];
    }
  }
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
  height: 700px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -350px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}
.qxz {
  padding: 40px;
  margin-top: 25px;
  padding-top: 0;
}
.pop-title {
  width: 120px;
  height: 30px;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  cursor: pointer;
}
.poptitlebg {
  background-color: #ff8777;
  color: #fff;
}
.elderEdit {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
