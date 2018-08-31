<template>
    <div class="contain">
        <el-scrollbar class="scrollbar" style="height: 100%;position: absolute;width: 100%;">
            <div class="top">
                <h6 class="main_Top_tit">登记管理</h6>
                <div class="djgl">
                    <router-link :to="{path: 'djgl/zxdj'}">
                    <div style="background: url(../../../static/img/register1.png);margin-right: 36px;" >
                        <span>咨询登记</span>
                    </div>
                </router-link>
                <router-link :to="{path: 'djgl/yydj'}">
                    <div style="background: url(../../../static/img/register2.png);margin-right: 36px;">
                        <span>预约登记</span>
                    </div>
                </router-link>
                <div style="background: url(../../../static/img/register3.png)">
                    <span>试住登记</span>
                </div>
                <img src="../../../static/img/arrow1.png" style="width: 42px;height: 36px;margin: 29px 0 0 295px;">
                <img src="../../../static/img/arrow2.png" style="width: 27px;height: 52px;margin: 4px 0 0 120px;">
                <img src="../../../static/img/arrow3.png" style="width: 41px;height: 34px;margin: 30px 100px 0 120px;">
                <router-link :to="{path: 'djgl/rzdj'}">
                    <div style="background: url(../../../static/img/register4.png);margin-top: 36px">
                        <span>入住登记</span>
                    </div>
                </router-link>
                </div>
            </div>
            <div class="bottom">
                <h6 class="main_Top_tit">入住流程</h6>
                <div class="rzlc">
                    <div style="background: url(../../../static/img/flow1.png);">
                        <p>01</p>
                        <span>基本信息登记</span>
                    </div>
                    <div style="background: url(../../../static/img/flow2.png);">
                        <p>02</p>
                        <span>家属信息登记</span>
                    </div>
                    <div style="background: url(../../../static/img/flow3.png);">
                        <p>03</p>
                        <span>健康信息登记</span>
                    </div>
                    <div style="background: url(../../../static/img/flow4.png);">
                        <p>04</p>
                        <span>护理信息登记</span>
                    </div>
                    <div style="background: url(../../../static/img/flow5.png);margin-left: 210px;">
                        <p>05</p>
                        <span>餐饮床位选择</span>
                    </div>
                    <div style="background: url(../../../static/img/flow6.png);">
                        <p>06</p>
                        <span>入住缴费</span>
                    </div>
                </div>
            </div>   
        </el-scrollbar>   
    </div>
</template>

<script>
import { mapState } from "vuex";
import VeLine from "v-charts/lib/line";

export default {
  data() {
    return {
      promise: [],
	  tableData: []
    };
  },
  components: {
    VeLine
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {},
  computed: mapState(["sideData"])
};
</script>

<style scoped>
.main_Top_tit{
  height: 15px;
  font-size: 16px;
  line-height: 16px;
  margin-left: 1%;
  color: #666666;
  padding-left: 20px;
  margin-top: 20px;
  border-left: 4px solid #f56c6c;
}
.contain{
    background-color: #fff;
    width: 100%;
    height: 100%;
    position: relative;
}
.top{
  background-color: #fff;
  height: 480px;
  width: 100%;
  padding-top: 20px;
  margin-right: 20px;
}
.djgl {
    width: 940px;
    height: 330px;
    margin: 52px auto
}
.djgl div{
    width:288px;
    height: 118px;
    float: left;
    color: #fff;
    font-size: 16px;
}
.djgl div span{
    display: block;
    margin: 47px 0 0 156px
}
.djgl img{
    float: left;
}
.bottom{
  background-color: #fff;
  height: 270px;
  width: 100%;
  margin-right: 20px;   
}
.rzlc{
    margin: 43px auto;
    width: 900px;

}
.rzlc div{
    width: 226px;
    height: 54px;
    float: left;
    margin-right: -16px;
    margin-bottom: 30px;
    color: #fff;
}
.rzlc div p{
    font-size: 24px;
    float: left;
    margin-left: 53px;
    line-height: 50px;
}
.rzlc div span{
    font-size: 14px;
    float: left;
    margin-left: 13px;
    line-height: 54px;
}
</style>
