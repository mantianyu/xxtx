<template>
    <el-scrollbar class="scrollbar" style="height: 100%">
      <div style="display: flex;justify-content: space-between;">
        <div class="topLeft">
          <h6 class="main_Top_tit">老人生日提醒</h6>
          <el-table :data="elderBirthData" style="width: 100%" height="315">
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="床位号" prop="bed_name"></el-table-column>
              <el-table-column label="生日时间" prop="birthday"></el-table-column>
              <el-table-column label="年龄" prop="age"></el-table-column>
          </el-table>
        </div>
        <div class="topRight">
          <h6 class="main_Top_tit">紧缺库存</h6>
          <el-table :data="goodsData" style="width: 100%" height="315">
              <el-table-column label="名称" prop="good_name"></el-table-column>
              <el-table-column label="所属库存" prop="repository_name"></el-table-column>
              <el-table-column label="现存量" prop="present_num"></el-table-column>
              <el-table-column label="状态" prop="status"></el-table-column>
          </el-table>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;">
        <div class="centerLeft">
            <h6 class="main_Top_tit">突发事件类型统计（本月）</h6>
              <ve-line :data="accidentTypeData" width="90%" height="370px" style="margin: 0 auto;" :legend-visible="false" :settings="accidentTypeSettings"></ve-line>
          </div>
        <div class="centerRight">
          <h6 class="main_Top_tit">突发事件老人统计（本月）</h6>
            <ve-histogram :data="accidentElderData" width="90%" height="370px" style="margin: 0 auto;" :legend-visible="false" :settings="accidentElderSettings"></ve-histogram>
        </div>
      </div>
    </el-scrollbar>
</template>

<script>
import { mapState } from "vuex";
import VeLine from "v-charts/lib/line";

export default {
  data() {
    this.accidentTypeSettings = {
      labelMap: {
        'count': '发生次数',
      },
    }
    this.accidentElderSettings = {
      labelMap: {
        'count': '发生次数',
      },
    }
    return {
      promise: [],
      accidentTypeData: {
        columns: ["type", "count"],
        rows: []
      },
      accidentElderData: {
        columns: ["elder_name", "count"],
        rows: []
      },
      elderBirthData: [],
	    goodsData: []
    };
  },
  components: {
    VeLine
  },
  watch: {

  },
  mounted() {
    this.fetchElderBirth();
    this.fetchAccidentType();
    this.fetchAccidentElder();
    this.fetchGoods();
  },
  methods: {
    fetchElderBirth: async function(){
      let url = this.api.getmonthelderbrithday;
      let data = {
        date: `${new Date().getFullYear()}-0${new Date().getMonth() + 1}`
      }
      const res = await this.$http.post(url, data);
      this.elderBirthData = res.data.data;
    },
    fetchAccidentType: async function(){
      let url = this.api.accidenttypestatis;
      let data = {};
      const res = await this.$http.post(url, data);
      this.accidentTypeData.rows = res.data.data;
    },
    fetchAccidentElder: async function(){
      let url = this.api.accidentstatis;
      let data = {};
      const res = await this.$http.post(url, data);
      this.accidentElderData.rows = res.data.data;
    },
    fetchGoods: async function(){
      let url = this.api.inventoryshortagestock;
      let data = {};
      const res = await this.$http.post(url, data);
      this.goodsData = res.data.data;
    }
  },
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
.topLeft{
  background-color: #fff;
  height: 350px;
  width: 49%;
  float: left;
  margin-right: 20px;
}
.topRight{
  background-color: #fff;
  height: 350px;
  width: 49%;
  float: left;
  margin-right: 20px;
}
.centerLeft{
  background-color: #fff;
  height: 390px;
  width: 49%;
  float: left;
  margin-right: 20px;
  margin-top: 20px;	
}
.centerRight{
  background-color: #fff;
  height: 390px;
  width: 49%;
  float: left;
  margin-right: 20px;
  margin-top: 20px;	
}
</style>
