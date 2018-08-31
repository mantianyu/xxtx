<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
      <div class="top-tit">
          <h5>系统管理员</h5>
      </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <div>
          <v-manage></v-manage>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>
<script>
import vManage from "./Manage.vue";

export default {
  data() {
    return {};
  },
  components: {
    vManage
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
.ZHGL {
  background-color: #fff;
  min-height: 100%;
}
.top-tit {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}
.top-tit h5 {
  color: #ff8777;
  font-weight: normal;
  float: left;
  line-height: 30px;
  margin: 0;
  font-size: 18px;
}
</style>