<template>
  <div class="consumeDetail" v-show="consumeDetail">
    <div class="pop">
          <div class="pop-top">
              <h5>账单调整</h5>
              <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
          </div>
          <div class="qxz">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="itemname"
                label="明细名称">
              </el-table-column>
              <el-table-column
                prop="date"
                label="明细时间">
              </el-table-column>
              <el-table-column
                prop="feeamount"
                label="明细价格">
              </el-table-column>
              <el-table-column
                prop="feediscount"
                label="折扣(元)">
                <template slot-scope="scope">
                  <el-input-number size="mini" v-bind:disabled="scope.row.dis" v-model="scope.row.feediscount" :controls="false" style="width: 70px;"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="discountapprover"
                label="折扣审批人">
                <template slot-scope="scope">
                  <el-input size="mini" v-bind:disabled="scope.row.dis" v-model="scope.row.discountapprover" style="width: 70px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="approvalnumber"
                label="审批单编号">
                <template slot-scope="scope">
                  <el-input size="mini" v-bind:disabled="scope.row.dis" v-model="scope.row.approvalnumber" style="width: 70px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.dis" type="text" size="small" @click="ifEdit(scope.$index)">调整</el-button>
                  <el-button v-if="!scope.row.dis" type="text" size="small" @click="editOk(scope.$index)">确认</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
      </div>
  </div>
</template>

<script>
import Vue from "vue";
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["detailId"],
  data() {
    return {
      tableData: []
    };
  },
  watch: {
    detailId() {
      this.fetchList(this.detailId);
    }
  },
  methods: {
    hideEditFalse() {
      this.$store.dispatch("consumeDetailFalse");
      this.$parent.clean();
      this.$parent.fetchList();
      this.tableData = [];
    },
    fetchList: async function(id) {
      let url = this.api.feedetaillist;
      var data = {
        listid: id
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.tableData = [];
        this.tableData = res.data.data;
      }
    },
    ifEdit(num) {
      this.tableData.forEach(function(data, index) {
        if (num == index) {
          Vue.set(data, "dis", false);
          Vue.set(data, "dis", false);
        }
      });
    },
    editOk(num) {
      var that = this;
      this.tableData.forEach(function(data, index) {
        if (num == index) {
          Vue.set(data, "dis", true);
          Vue.set(data, "dis", true);
          var bill = {
            fdid: data.fdid,
            fddiscount: data.feediscount,
            discountapprover: data.discountapprover,
            approvalnumber: data.approvalnumber
          };
          that.saveDetail(bill);
        }
      });
    },
    saveDetail: async function(data) {
      let url = this.api.improvefeedetail;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.fetchList(this.detailId);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: "确定",
            callback: action => {
              this.bLoading = false;
              this.fetchList(this.detailId);
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: "确定",
          callback: action => {
            this.bLoading = false;
            this.fetchList(this.detailId);
          }
        });
      }
    }
  },
  computed: mapState(["consumeDetail"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  max-height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -400px;
}
.pop-top {
  border-bottom: 1px #e5e5e5 solid;
  padding: 0 20px;
  overflow: hidden;
  background: #f2f2f2;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  position: fixed;
  width: 770px;
  z-index: 99;
}
.pop-top h5 {
  float: left;
  font-weight: normal;
  font-size: 16px;
  line-height: 50px;
  margin: 0;
}
.pop-top span {
  float: right;
  cursor: pointer;
  display: block;
  width: 12px;
  height: 12px;
  margin-top: 20px;
}
.qxz {
  padding: 40px;
  margin-top: 25px;
}
.consumeDetail {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2003;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>