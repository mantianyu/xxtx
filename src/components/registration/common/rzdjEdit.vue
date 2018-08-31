<template>
  <div class="rzdjEdit" v-show="rzdjEdit">
    <el-container class="pop" v-loading="loading">
      <el-header style="height: auto;">
        <div class="pop-top">
          <h5>入住登记</h5>
          <div style="position: absolute;display: flex;left: 140px;top: 10px;">
            <div :class="{'pop-title':true, 'poptitlebg': isInfo}" @click="showInfo">基本信息登记</div>
            <div :class="{'pop-title':true, 'poptitlebg': isRelation}" @click="showRelation">家属信息登记</div>
            <div :class="{'pop-title':true, 'poptitlebg': isHealth}" @click="showHealth">健康信息登记</div>
            <div :class="{'pop-title':true, 'poptitlebg': isNurse}" @click="showNurse">护理任务设置</div>
            <div :class="{'pop-title':true, 'poptitlebg': isFoodbed}" @click="showFoodBed">餐饮床位选择</div>
            <div :class="{'pop-title':true, 'poptitlebg': isPayin}" v-if="status ?  status != 1 ? true : false : true" @click="showPayIn">入院缴费</div>
          </div>
          <span class="pop-close" @click="hideEdit"><i class="el-icon-close"></i></span>
        </div>
      </el-header>
      <el-main style="height: 91%;position: relative;">
        <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <v-info
              v-if="isInfo"
              :rzdjEdit="rzdjEdit"
              :elderList="elderList"
              :elderDetail="elderDetail"
              :labour_capacity="labour"
              :blood_group="blood"
              :political_status="political"
              :profession="retired"
              :elder_type="elderType"
              :checkid="checkinid"
              :marital_status="marital"
              :nationality="national"
              :living_status="living"
              :religion="religion"
              :education="education"
              :income_source="income"
              :medical_security="medical"
              :care="care"></v-info>
            <v-relation v-if="isRelation" :elderDetail="elderDetail" :id="id" :noRegist="noRegist"></v-relation>
            <v-health v-if="isHealth" :elderDetail="elderDetail" :care="care" :id="id" :checkin="checkin" :noHealth="noHealth"></v-health>
            <v-nurse v-if="isNurse" :elderDetail="elderDetail" :iscycw="iscycw" :status="status"></v-nurse>
            <v-foodbed v-if="isFoodbed" :elderDetail="elderDetail" :noNurseEatBed="noNurseEatBed" :checkin="checkin" :status="status" :selfcare="selfcare"></v-foodbed>
            <v-payin v-if="isPayin" :elderDetail="elderDetail" :checkin="checkin"></v-payin>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vInfo from "./rzdjElderInfo.vue";
import vRelation from "./rzdjQinshu.vue";
import vHealth from "./rzdjHealth.vue";
import vNurse from "./rzdjNurse.vue";
import vFoodbed from "./rzdjFoodBed.vue";
import vPayin from "./rzdjPayIn.vue";
import { mapState } from "vuex";

export default {
  props: [
    "checkinid",
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
    "isNew",
    "elderList",
    "status",
    "inStatus"
  ],
  data() {
    return {
      isInfo: true,
      isRelation: false,
      isHealth: false,
      isNurse: false,
      isFoodbed: false,
      isPayin: false,
      elderDetail: [],
      id: 0,
      checkin: 0,
      noRegist: false,
      noNurseEatBed: false,
      noHealth: false,
      loading: false,
      iscycw: false,
      isLevel: false,
      isFood: false,
      selfcare: 0
    };
  },
  components: {
    vInfo,
    vRelation,
    vHealth,
    vNurse,
    vFoodbed,
    vPayin
  },
  watch: {
    checkinid() {
      if (this.checkinid == 0) {
        this.elderDetail = [];
      } else {
        this.checkin = this.checkinid;
        this.fetchDetail(this.checkinid);
      }
    },
    inStatus(){
      if(!this.inStatus || this.inStatus === 1){
        this.showNewInfo();
      }else if(this.inStatus === 2){
        this.showNewHealth();
      }else if(this.inStatus === 3){
        this.showNewNurse();
      }else if(this.inStatus === 4){
        this.showNewPayIn();
      }
    }
  },
  methods: {
    showInfo() {
      if (this.checkin != 0) {
        this.isInfo = true;
        this.isRelation = false;
        this.isHealth = false;
        this.isNurse = false;
        this.isFoodbed = false;
        this.isPayin = false;
        this.fetchDetail(this.checkin);
      }
    },
    showRelation() {
      if (this.checkin != 0) {
        this.isInfo = false;
        this.isRelation = true;
        this.isHealth = false;
        this.isNurse = false;
        this.isFoodbed = false;
        this.isPayin = false;
        this.fetchDetail(this.checkin);
      }
    },
    showHealth() {
      if (this.checkin != 0) {
        this.isInfo = false;
        this.isRelation = false;
        this.isHealth = true;
        this.isNurse = false;
        this.isFoodbed = false;
        this.isPayin = false;
        this.fetchDetail(this.checkin);
      }
    },
    showNurse() {
      if (this.checkin != 0) {
        this.isInfo = false;
        this.isRelation = false;
        this.isHealth = false;
        this.isNurse = true;
        this.isFoodbed = false;
        this.isPayin = false;
        this.fetchDetail(this.checkin);
      }
    },
    showFoodBed() {
      if (this.isLevel) {
        if (this.checkin != 0) {
          this.isInfo = false;
          this.isRelation = false;
          this.isHealth = false;
          this.isNurse = false;
          this.isFoodbed = true;
          this.isPayin = false;
          this.fetchDetail(this.checkin);
        }
      }
    },
    showPayIn() {
      if (this.isFood) {
        if (this.checkin != 0) {
          this.isInfo = false;
          this.isRelation = false;
          this.isHealth = false;
          this.isNurse = false;
          this.isFoodbed = false;
          this.isPayin = true;
          this.fetchDetail(this.checkin);
        }
      }
    },
    showNewInfo() {
      this.isInfo = true;
      this.isRelation = false;
      this.isHealth = false;
      this.isNurse = false;
      this.isFoodbed = false;
      this.isPayin = false;
      if (this.checkin != 0) {
        this.fetchDetail(this.checkin);
      }
    },
    showNewRelation() {
      this.isInfo = false;
      this.isRelation = true;
      this.isHealth = false;
      this.isNurse = false;
      this.isFoodbed = false;
      this.isPayin = false;
      if (this.checkin != 0) {
        this.fetchDetail(this.checkin);
      }
    },
    showNewHealth() {
      this.isInfo = false;
      this.isRelation = false;
      this.isHealth = true;
      this.isNurse = false;
      this.isFoodbed = false;
      this.isPayin = false;
      if (this.checkin != 0) {
        this.fetchDetail(this.checkin);
      }
    },
    showNewNurse() {
      this.isInfo = false;
      this.isRelation = false;
      this.isHealth = false;
      this.isNurse = true;
      this.isFoodbed = false;
      this.isPayin = false;
      if (this.checkin != 0) {
        this.fetchDetail(this.checkin);
      }
    },
    showNewFoodBed() {
      this.isInfo = false;
      this.isRelation = false;
      this.isHealth = false;
      this.isNurse = false;
      this.isFoodbed = true;
      this.isPayin = false;
      if (this.checkin != 0) {
        this.fetchDetail(this.checkin);
      }
    },
    showNewPayIn() {
      this.isInfo = false;
      this.isRelation = false;
      this.isHealth = false;
      this.isNurse = false;
      this.isFoodbed = false;
      this.isPayin = true;
      if (this.checkin != 0) {
        this.fetchDetail(this.checkin);
      }
    },
    hideEdit() {
      this.$store.dispatch("rzdjEditFalse");
      this.$store.dispatch("checkinIdSave", 0);
      this.$parent.clean();
      this.elderDetail = [];
      this.results = [];
      this.id = 0;
      this.checkin = 0;
      this.isLevel = false;
      this.isFood = false;
      this.$nextTick(() => {
        this.showNewInfo();
      });
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.eldercheckininfo;
      var data = {
        checkid: id,
        new: this.isNew
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.elderDetail = res.data.data;
        this.selfcare = res.data.data.selfcare;
        if (res.data.data.level_id !== 0) {
          this.isLevel = true;
        }
        if (res.data.data.recipe_type_id !== 0) {
          this.isFood = true;
        }
      } else {
        this.loading = false;
      }
    },
    detailEmpty() {
      this.elderDetail = [];
      this.id = 0;
      this.checkin = 0;
      this.showNewInfo();
    },
    getId(id, checkinid, selfcare) {
      this.id = id;
      this.checkin = checkinid;
      this.selfcare = selfcare;
      this.$nextTick(function() {
        this.showNewRelation();
      });
    },
    loadingFalse() {
      this.loading = false;
    },
    isLevelTrue(val) {
      if (val !== 0) {
        this.isLevel = true;
      }
    },
    isFoodTrue(val) {
      if (val !== 0) {
        this.isFood = true;
      }
    }
  },
  computed: mapState(["rzdjEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -300px;
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
.rzdjEdit {
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
