<template>
    <div class="contain">
        <el-scrollbar class="scrollbar" style="height: 96%;position: absolute;width: 99%;">
            <h6 class="main_Top_tit">网站地图</h6>
            <div class="firstTitle" v-for="(side, index, key) in sideData" :key="key">
                <div class="left">
                    {{ side.title }}
                </div>
                <div class="right">
                    <div v-for="(sideChild, index, key) in side.child" :key="key" style="display: flex;align-items: center;">
                        <span>{{ sideChild.title }}</span>
                        <ul>
                            <li v-for="(sideChildChild, index, key) in sideChild.child" :key="key"><router-link :to="{path: sideChildChild.url}">{{ sideChildChild.title }}</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-scrollbar>       
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {},
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
  background: #fff;
  overflow: hidden;
}
.firstTitle {
  width: 97%;
  margin: 40px auto 0 auto;
  border-bottom: 1px solid #e8ebf2;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}
.left {
  width: 100px;
  height: 50px;
  background: #616c88;
  border-radius: 6px;
  margin: 0 30px 0 25px;
  font-size: 16px;
  color: #fff;
  line-height: 50px;
  text-align: center;
  float: left;
}
.right {
  float: left;
}
.right span {
  display: block;
  width: 80px;
  height: 30px;
  border-radius: 6px;
  background: #e3e9f4;
  color: #78879c;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  float: left;
  clear: both;
  margin-top: 15px;
  margin-bottom: 15px;
}
.right ul {
  float: left;
  margin-left: 25px;
}
.right li {
  float: left;
  border-right: 1px solid #666;
  font-size: 12px;
  line-height: 12px;
  color: #666;
  text-align: center;
  padding-right: 5px;
  padding-left: 5px;
}
.right li a {
  color: #666;
}
.right li:last-child {
  border: 0;
}
</style>
