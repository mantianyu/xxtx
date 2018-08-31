<template>
    <div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">用药数量</p>
                <div></div>
            </div>
            <el-table
                :data="tableDataYYSL"
                style="width: 100%"
                stripe>
                <el-table-column
                prop="drugname"
                label="药品名">
                </el-table-column>
                <el-table-column
                prop="count"
                label="药品数量">
                </el-table-column>
                <el-table-column
                prop="warncount"
                label="药品警告数量">
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
                <div style="display: flex;margin-right: 20px;">
                    <el-button type="primary" size="small" @click="fetchYYSL(1)">首页</el-button>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange1"
                        :current-page="currentPage1"
                        layout="prev, pager, next"
                        :total="total1">
                    </el-pagination>
                    <el-button type="primary" size="small" @click="fetchYYSL(last_page1)">末页</el-button>
                </div>
            </div>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">用药设置</p>
                <el-button type="danger" size="small" style="margin-right: 60px;" @click="showAdd">编辑</el-button>
            </div>
            <el-table
                :data="tableDataYYSZ"
                style="width: 100%">
                <el-table-column
                    prop="drugname"
                    label="药名">
                </el-table-column>
                <el-table-column
                    prop="drugtime"
                    label="时间">
                </el-table-column>
                <el-table-column
                    prop="bednum"
                    label="频率">
                    <template slot-scope="scope">
                        <p>{{scope.row.frequencycount}}次/{{scope.row.frequencyday}}天</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="bednum"
                    label="时间数量">
                    <template slot-scope="scope">
                        <p>早{{scope.row.earlynum}}中{{scope.row.middlenum}}晚{{scope.row.latenum}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteDrug(scope.row.maid,scope.$index, tableData)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
                <div style="display: flex;margin-right: 20px;">
                    <el-button type="primary" size="small" @click="fetchYYSZ(1)">首页</el-button>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange2"
                        :current-page="currentPage2"
                        layout="prev, pager, next"
                        :total="total2">
                    </el-pagination>
                    <el-button type="primary" size="small" @click="fetchYYSZ(last_page2)">末页</el-button>
                </div>
            </div>
        </div>
        <div>
            <div class="login-btn" style="margin-top: 20px;margin-bottom: 20px;display: flex;align-items:center;justify-content: space-between;">
                <p style="margin-left: 60px;font-size: 20px;">用药记录</p>
                <div></div>
            </div>
            <el-table
                :data="tableDataYYJL"
                style="width: 100%"
                stripe>
                <el-table-column
                prop="drugname"
                label="药品名">
                </el-table-column>
                <el-table-column
                prop="mtime"
                label="用药时间">
                </el-table-column>
                <el-table-column
                prop="isprovisionality"
                label="用药方式">
                <template slot-scope="scope">
                    <p>{{scope.row.isprovisionality == 0 ? '常规用药' : scope.row.isprovisionality == 1 ? '临时用药' : ''}}</p>
                </template>
                </el-table-column>
                <el-table-column
                prop="timeid"
                label="时间">
                <template slot-scope="scope">
                    <p>{{scope.row.timeid == 1 ? '早' : scope.row.timeid == 2 ? '中' : '晚'}}</p>
                </template>
                </el-table-column>
                <el-table-column
                prop="marcount"
                label="数量">
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
                <div></div>
                <div style="display: flex;margin-right: 20px;">
                    <el-button type="primary" size="small" @click="fetchYYJL(1)">首页</el-button>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange3"
                        :current-page="currentPage3"
                        layout="prev, pager, next"
                        :total="total3">
                    </el-pagination>
                    <el-button type="primary" size="small" @click="fetchYYJL(last_page3)">末页</el-button>
                </div>
            </div>
        </div>
	    <v-drugset v-if="addDrugSet" :elderId="elderId" :eatDrugTime="eatDrugTime" :noEdit="noEdit" :elders="elders" :elderBed="elderBed" :checkin_id="checkin_id" :status="status"></v-drugset>
    </div>
</template>

<script>
import vDrugset from "../../serviceManager/common/addDrugSet.vue";
import { mapState } from "vuex";

export default {
  props: ["elderId", "elderBed", "checkin_id"],
  data() {
    return {
      tableDataYYSL: [],
      total1: 0,
      last_page1: 0,
      currentPage1: 1,
      tableDataYYSZ: [],
      total2: 0,
      last_page2: 0,
      currentPage2: 1,
      tableDataYYJL: [],
      total3: 0,
      last_page3: 0,
      currentPage3: 1,
      eatDrugTime: [],
      noEdit: true,
      elders: [],
      status: 1
    };
  },
  components: {
    vDrugset
  },
  mounted(){
      this.fetchYYSL(1);
      this.fetchYYSZ(1);
      this.fetchYYJL(1);
      this.fetchDiseases();
      this.fetchElders();
  },
  methods: {
    handleCurrentChange1(val) {
      this.fetchYYSL(val);
    },
    handleCurrentChange2(val) {
      this.fetchYYSZ(val);
    },
    handleCurrentChange3(val) {
      this.fetchYYJL(val);
    },
    fetchYYSL: async function(val) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.elderdruglist + "?page=" + val;
      var data = {
        elderid: this.elderId,
        amount: 5
      };
      const res = await this.$http.post(url, data);
      this.tableDataYYSL = res.data.data.data;
      this.total1 = res.data.data.total;
      this.last_page1 = res.data.data.last_page;
      this.$nextTick(() => {
        this.currentPage1 = val;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      });
    },
    fetchYYSZ: async function(val) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.medicationsetlist + "?page=" + val;
      var data = {
        elderid: this.elderId,
        amount: 5
      };
      const res = await this.$http.post(url, data);
      this.tableDataYYSZ = res.data.data.data;
      this.total2 = res.data.data.total;
      this.last_page2 = res.data.data.last_page;
      this.$nextTick(() => {
        this.currentPage2 = val;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      });
    },
    fetchYYJL: async function(val) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.medicationrecordlist + "?page=" + val;
      var data = {
        elderid: this.elderId,
        amount: 5
      };
      const res = await this.$http.post(url, data);
      this.tableDataYYJL = res.data.data.data;
      this.total3 = res.data.data.total;
      this.last_page3 = res.data.data.last_page;
      this.$nextTick(() => {
        this.currentPage3 = val;
        this.$parent.$parent.$parent.$parent.loadingFalse();
      });
    },
    fetchDiseases: async function() {
      let url = this.api.data;
      var data = {
        group: [this.data.BEADHOUSE_MEDICATION_TIME]
      };
      const res = await this.$http.post(url, data);
      this.eatDrugTime = res.data.data;
    },
    fetchElders: async function() {
      let url = this.api.getsearchelder;
      var data = {};
      const res = await this.$http.post(url, data);
      this.elders = res.data.data;
    },
    showAdd(){
      this.$store.dispatch("addDrugSetTrue");
    }
  },
  computed: mapState(["addDrugSet"])
};
</script>

<style>
</style>
