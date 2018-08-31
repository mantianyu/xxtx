<template>
  <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
        <div class="top-tit">
            <h5>物资调拨</h5>
            <div class="find">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                    <el-form-item label="申请仓库名称" prop="in_repo_id">
                    <el-select v-model="ruleForm.in_repo_id" clearable placeholder="请选择" size="small" style="width: 140px;">
                        <el-option v-for="(repo, key) in in_repo" :label="repo.name" :value="repo.id" :key="key"></el-option>
                    </el-select>
                    </el-form-item>
                    <div style="margin-left: 10px">
                        <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
        <v-wzdbt :searchData="searchData" :in_repo="in_repo" :out_repo="out_repo"></v-wzdbt>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import VWzdbt from "./common/WZDBTable.vue";

export default {
  data() {
    return {
      ruleForm: {
        in_repo_id: "",
      },
      rules: {},
      searchData: {},
      in_repo: [],
      out_repo: [],
    };
  },
  components: {
    VWzdbt
  },
  mounted() {
      this.fetchInComekv();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            in_repo_id: this.ruleForm.in_repo_id,
          };
          this.searchData = data;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    fetchInComekv: async function(){
      let url = this.api.getallotkv;
      let data = {};
      const res = await this.$http.post(url, data);
      this.in_repo = res.data.data.in_repo;
      this.out_repo = res.data.data.out_repo;
    },
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
</style>