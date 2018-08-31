<template>
  <div class="addHGXZ">
    <el-container class="pop" v-loading="loading">
      <el-header style="height: auto;">
        <div class="pop-top">
          <h5>添加护工小组</h5>
          <div style="position: absolute;display: flex;left: 140px;top: 10px;">
            <div :class="{'pop-title':true, 'poptitlebg': isTeam}" @click="showTeam">添加护工小组</div>
            <div :class="{'pop-title':true, 'poptitlebg': isArea}" @click="showArea">设置看护区域</div>
          </div>
          <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
        </div>
      </el-header>
      <el-main style="height: 92.7%;">
        <el-scrollbar class="scrollbar" style="width: 100%;height: 91%;overflow-x: hidden;position: absolute;left: 0;top: 0;margin-top: 50px;">
          <div class="qxz">
	          <v-info v-if="isTeam" :groupId="groupId"></v-info>
            <v-area v-if="isArea" :groupId="groupId"></v-area>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vInfo from "./HGXZInfo.vue";
import vArea from "./HGXZArea.vue";

export default {
  props: ["nlid"],
  data() {
    return {
      isTeam: true,
      isArea: false,
      loading: false,
      groupId: 0
    };
  },
  components: {
    vInfo,
    vArea
  },
  watch: {},
  mounted() {
    if (this.nlid !== 0) {
      this.groupId = this.nlid;
    }
  },
  methods: {
    showTeam() {
      if (this.groupId !== 0) {
        this.isTeam = true;
        this.isArea = false;
      }
    },
    showArea() {
      if (this.groupId !== 0) {
        this.isTeam = false;
        this.isArea = true;
      }
    },
    loadingFalse() {
      this.loading = false;
    },
    loadingTrue() {
      this.loading = true;
    },
    hideEditFalse() {
      this.$store.dispatch("addHGXZFalse");
    },
    getGroupId(id) {
      this.groupId = id;
    }
  }
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
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
.addHGXZ {
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
