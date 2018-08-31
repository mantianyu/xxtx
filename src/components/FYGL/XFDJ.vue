<template>
  <div class="xfdj">
    <el-tabs v-model="activeName" style="margin-left: 20px;margin-right: 20px;padding-top: 10px;">
      <el-tab-pane label="其他费用" name="first">
        <v-otherpay :elders="elders" :payType="payType"></v-otherpay>
      </el-tab-pane>
      <el-tab-pane label="水电费" name="second">
        <v-pay :elders="elders"></v-pay>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import vOtherpay from './common/addOtherPay.vue'
  import vPay from './common/addPay.vue'

  export default {
    data() {
      return {
        elders: [],
        activeName: 'first',
        payType: []
      };
    },
    components:{
      vOtherpay, vPay
    },
    mounted(){
      this.fetchElders();
      this.fetchPayType();
    },
    methods: {
      fetchElders: async function(){
        let url = this.api.getsearchelder;
        var data = {};
        const res = await this.$http.post(url,data);
        this.elders = res.data.data;
      },
      fetchPayType: async function(){
        let url = this.api.costtypelist;
        var data = {};
        const res = await this.$http.post(url,data);
        this.payType = res.data.data;
      }
    }
  };
</script>

<style scoped>
  .xfdj{
    background-color: #fff;
      min-height: 100%;
      position: relative;
  }
</style>