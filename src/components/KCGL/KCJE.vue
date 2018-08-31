<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>库存金额</h5>
        </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <v-kcjet></v-kcjet>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VKcjet from "./common/KCJETable.vue";

export default {
  data() {
    return {
      
    };
  },
  components: {
    VKcjet
  },
  mounted() {
      
  },
  methods: {
    
  }
};
</script>

<style scoped>
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

.demo-ruleForm {
  display: flex;
}

.find form {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.el-form-item {
  margin-bottom: 0;
}
@media screen and (max-width: 1380px) {
  .find {
    display: flex;
    justify-content: flex-end;
  }
  .find form {
    width: 500px;
    justify-content: flex-start;
  }
}
</style>