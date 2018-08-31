<template>
  <div class="abilityEdit" v-show="abilityEdit">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
        <div class="pop-top">
            <h5>能力评估</h5>
            <div style="position: absolute;display: flex;left: 140px;top: 10px;">
              <div :class="{'pop-title':true, 'poptitlebg': isInfo}" @click="showInfo">基本信息登记</div>
              <div :class="{'pop-title':true, 'poptitlebg': isAbility}" @click="showAbility">老人能力评估</div>
              <div :class="{'pop-title':true, 'poptitlebg': isResult}" @click="showResult">评估结果</div>
            </div>
            <span class="pop-close" @click="hideEdit"><i class="el-icon-close"></i></span>
        </div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <v-info v-if="isInfo" :elderDetail="elderDetail" :abilityId="abilityId" :national="national" :education="education" :religion="religion" :marital="marital" :living="living" :medical="medical" :income="income" :relation="relation" :elders="elders" :listId="listId" :main="main"></v-info>
            <v-ability v-if="isAbility" :elderDetail="elderDetail" :elderid="elderid" :hid="hid" :main="main"></v-ability>
            <v-result v-if="isResult" :elderDetail="elderDetail" :results="results"></v-result>
          </div>
				</el-scrollbar>
			</el-main>
		</el-container>
  </div>
</template>

<script>
import vInfo from "./baseElderInfo.vue";
import vAbility from "./elderAbility.vue";
import vResult from "./results.vue";
import { mapState } from "vuex";

export default {
  props: [
    "abilityId",
    "listId",
    "national",
    "education",
    "religion",
    "marital",
    "living",
    "medical",
    "income",
    "relation",
    "elders",
    "main"
  ],
  data() {
    return {
      isInfo: true,
      isAbility: false,
      isResult: false,
      elderDetail: [],
      results: [],
      elderid: 0,
      loading: false,
      hid: 0
    };
  },
  components: {
    vInfo,
    vAbility,
    vResult
  },
  watch: {
    abilityId() {
      if (this.abilityId == 0) {
        this.elderDetail = [];
      } else {
        this.fetchDetail();
        this.elderid = this.abilityId;
      }
    },
    listId(){
      if(this.listId !== 0){
        this.hid = this.listId;
      }
    }
  },
  methods: {
    showInfo() {
      if (this.abilityId != 0) {
        this.isInfo = true;
        this.isAbility = false;
        this.isResult = false;
        this.fetchDetail();
      }
    },
    showAbility() {
      if (this.abilityId != 0) {
        this.isInfo = false;
        this.isAbility = true;
        this.isResult = false;
        this.fetchDetail();
      }
    },
    showResult() {
      if (this.abilityId != 0) {
        this.isInfo = false;
        this.isAbility = false;
        this.isResult = true;
        this.fetchDetail();
      }
    },
    showNewInfo() {
      this.isInfo = true;
      this.isAbility = false;
      this.isResult = false;
      if (this.abilityId != 0) {
        this.fetchDetail();
      }
    },
    showNewAbility() {
      this.isInfo = false;
      this.isAbility = true;
      this.isResult = false;
      if (this.abilityId != 0) {
        this.fetchDetail();
      }
    },
    showNewResult() {
      this.isInfo = false;
      this.isAbility = false;
      this.isResult = true;
      if (this.abilityId != 0) {
        this.fetchDetail();
      }
    },
    hideEdit() {
      this.$store.dispatch("abilityEditFalse");
      this.$parent.clean();
      this.results = [];
      this.elderDetail = [];
      this.$nextTick(() => {
        this.showNewInfo();
      });
    },
    fetchDetail: async function() {
      this.loading = true;
      let url = this.api.detailability;
      var data = {
        id: this.listId,
        elderid: this.abilityId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.elderDetail = res.data.data;
          this.loading = false;
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEdit();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEdit();
          }
        });
      }
    },
    detailEmpty() {
      this.elderDetail = [];
      this.showNewInfo();
    },
    saveAbility: async function(data) {
      this.loading = true;
      let url = this.api.addelderHealth;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.results = res.data.data;
          this.$parent.fetchList(1);
          this.loading = false;
          this.showNewResult();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    getElderId(id, hid) {
      this.elderid = id;
      this.hid = hid;
    }
  },
  computed: mapState(["abilityEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 500px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -250px;
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
.abilityEdit {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
