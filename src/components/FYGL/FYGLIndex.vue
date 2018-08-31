<template>
  <el-container style="height: 100%;float: left;width: 100%;background: #ffffff;">
    <el-header>
      <div class="top-tit">
        <h5>费用管理</h5>
      </div>
    </el-header>
    <el-main style="margin-bottom: 4%;">
      <div class="column">
        <ul>
          <li v-for="(pro, key) in promise" :key="key">
            <router-link :to="{ path: pro.url}" style="color: #ffffff;">
              <img :src="pro.src">
              <span>{{pro.title}}</span>
            </router-link>
          </li>
          <!-- <li>
            <router-link :to="{ path: '/FYrzjf'}" style="color: #ffffff;">
              <img src="/static/img/Cost_rzjf.png">
              <span>入住缴费</span>
            </router-link>
          </li>
          <li>
              <img src="/static/img/Cost_tzjs.png">
              <span>退住结算</span>
          </li>
          <li>
            <router-link :to="{ path: '/fyfytz'}" style="color: #ffffff;">
              <img src="/static/img/Cost_fytz.png">
              <span>费用调整</span>
            </router-link>
          </li>
          <li>
            <img src="/static/img/Cost_xfdj.png">
            <span>消费登记</span>
          </li>
          <li>
            <img src="/static/img/Cost_jfdj.png">
            <span>交费登记</span>
          </li>
          <li>
            <img src="/static/img/Cost_qfgl.png">
            <span>欠费管理</span>
          </li>
          <li>
            <router-link :to="{ path: '/fyfylb'}" style="color: #ffffff;">
              <img src="/static/img/Cost_fylb.png">
              <span>费用类别</span>
            </router-link>
          </li>
          <li>
            <img src="/static/img/Cost_csfy.png">
            <span>初始费用</span>
          </li>
          <li>
            <router-link :to="{ path: '/fyfyls'}" style="color: #ffffff;">
              <img src="/static/img/Cost_fyls.png">
              <span>费用流水</span>
            </router-link>
          </li> -->
        </ul>
      </div>
    </el-main>
  </el-container>
</template>

<script>
    import { mapState } from 'vuex'
    
    export default {
      data() {
        return {
          promise: []
        };
      },
      watch:{
        sideData(){
          for(let i = 0; i < this.sideData.length; i++){
            if(this.sideData[i].title == this.message.costManage){
              this.promise = this.sideData[i].child;
            }
          }
        }
      },
      mounted(){
        for(let i = 0; i < this.sideData.length; i++){
          if(this.sideData[i].title == this.message.costManage){
            this.promise = this.sideData[i].child;
          }
        }
      },
      methods: {

      },
      computed: mapState([
          'sideData'
      ]),
    }
</script>

<style scoped>

  .top-tit{padding: 20px;border-bottom: 1px solid #ddd;overflow: hidden;}
  .top-tit h5{color: #ff8777;font-weight: normal;float: left;line-height: 30px;margin: 0;font-size: 18px}

  .column ul{
    width: 100%;
    float: left;
  }
  .column ul li{
    width: 18%;
    float: left;
    margin: 40px 1% 0;
    background: #3cc6d0;
    color: #fff;
    line-height: 100px;
    border-radius: 4px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .column ul li a{
    width: 100%;
    height: 100%;
  }
  .column ul li img{
    margin-right: 10%;
  }
</style>
