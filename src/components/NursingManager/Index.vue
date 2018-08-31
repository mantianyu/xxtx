<template>
    <el-scrollbar class="scrollbar" style="height: 100%">
      <div class="arrange">
        <h6 class="main_Top_tit">本周排班方案</h6>
        <span class="time">时间：{{ startTime }}-{{ endTime }}</span>        
        <el-table :data="tableData" style="width: 96%;margin:20px;">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="星期一" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[0]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）（{{ work.status == 1 ? '常规' : '替班' }}）</div>
              </template>
            </el-table-column>
            <el-table-column label="星期二" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[1]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）（{{ work.status == 1 ? '常规' : '替班' }}）</div>
              </template>
            </el-table-column>
            <el-table-column label="星期三" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[2]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）（{{ work.status == 1 ? '常规' : '替班' }}）</div>
              </template>
            </el-table-column>
            <el-table-column label="星期四" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[3]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）（{{ work.status == 1 ? '常规' : '替班' }}）</div>
              </template>
            </el-table-column>
            <el-table-column label="星期五" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[4]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）（{{ work.status == 1 ? '常规' : '替班' }}）</div>
              </template>
            </el-table-column>
            <el-table-column label="星期六" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[5]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）（{{ work.status == 1 ? '常规' : '替班' }}）</div>
              </template>
            </el-table-column>
            <el-table-column label="星期日" width="245">
              <template slot-scope="scope">
                <div v-for="(work, key) in scope.row.data[6]" :key="key" v-bind:class="[work.status == 1 ? 'own' : 'other']">{{work.name}}（{{ work.start_time.substring(0,5) }} ～ {{ work.end_time.substring(0,5) }}）</div>
              </template>
            </el-table-column>
        </el-table>
      </div>
	  
    </el-scrollbar>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      startTime: "",
      endTime: ""
    };
  },
  watch: {},
  mounted() {
    this.fetchScheme();
  },
  methods: {
    fetchScheme: async function(){
      let url = this.api.weeklyscheme;
      let data = {};
      const res = await this.$http.post(url, data);
      this.tableData = res.data.data.data;
      this.startTime = res.data.data.week_start;
      this.endTime = res.data.data.week_end;
    }
  },
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
.time {
  float: right;
  font-size: 11px;
  color: #666;
  margin: 20px 20px 0 0;
}
.arrange {
  background-color: #fff;
  height: 700px;
  width: 97%;
  float: left;
  margin: 20px;
}
.own{
  width: 235px;
  height: 40px;
  background-color: #11d0c1;
  padding-left: 15px;
  padding-right: 15px;
  color: #fff;
  line-height: 40px;
  border-radius: 10px;
  margin-top: 10px;
}
.other{
  width: 235px;
  height: 40px;
  background-color: #a3b9ed;
  padding-left: 15px;
  padding-right: 15px;
  color: #fff;
  line-height: 40px;
  border-radius: 10px;
  margin-top: 10px;
}
</style>
