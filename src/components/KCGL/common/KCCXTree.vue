<template>
  <div>
    <div style="border-bottom: 1px solid #ddd;">
      <h5 style="color: #ff8777;margin-left: 20px;padding-top: 20px;margin-bottom: 20px;">仓库</h5>
    </div>
    <el-radio-group v-model="checkedNum" style="display: flex;flex-direction: column;" @change="changeList">
      <el-radio style="margin-left: 15px;margin-top: 5px;" :label="int0">所有仓库</el-radio>
      <el-radio v-for="(type, key) in data" :key="key" :label="type.id" style="margin-left: 30px;margin-top: 5px;">{{type.name}}</el-radio>
    </el-radio-group>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: [],
        checkedNum: 0,
        int0: 0
      };
    },
    mounted(){
      this.fetchList();
      this.checkedNum = this.$route.params.id * 1;
    },
    methods: {
      changeList(){
        this.$router.push({path: '/rcsw/kccx/kccxt/' + this.checkedNum});
      },
      fetchList: async function(){
        let url = this.api.allrepository;
        var data = {};
        const res = await this.$http.post(url,data);
        this.data = res.data.data;
      }
    }
  };
</script>