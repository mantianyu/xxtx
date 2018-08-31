<template>
  <div class="consume" v-show="consume">
		<el-container class="pop">
			<el-header style="height: auto;">
          <div class="pop-top">
              <h5>出院账单</h5>
              <span class="pop-close" style="margin-right: 20px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
          </div>
			</el-header>
			<el-main style="height: 91%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-table
            v-loading="loading"
              :data="tableData"
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="fee_name"
                label="费用类别">
              </el-table-column>
              <el-table-column
                prop="price"
                label="金额(元)">
              </el-table-column>
              <el-table-column
                prop="discount"
                label="折扣(元)">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="showDetail(scope.row)">调整</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
				</el-scrollbar>
			</el-main>
		</el-container>
      <v-detail :detailId="detailId"></v-detail>
  </div>
</template>

<script>
import Vue from "vue";
import localEvent from "@/utils/local";
import { mapState } from "vuex";
import vDetail from "./consumeDetail.vue";

export default {
  props: ["consumeId", "checkinid"],
  data() {
    return {
      tableData: [],
      detailId: 0,
      loading: false
    };
  },
  components: {
    vDetail
  },
  watch: {
    consumeId() {
      if (this.consumeId !== 0) {
        this.fetchList();
      }
    }
  },
  methods: {
    hideEditFalse() {
      this.$store.dispatch("consumeFalse");
      this.$parent.clean();
      this.$parent.fetchBills(this.checkinid);
      this.tableData = [];
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.checkoutfeelist;
      var data = {
        monthlybillid: this.consumeId
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data;
          this.detailId = 0;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    },
    showDetail(scope) {
      this.$store.dispatch("consumeDetailTrue");
      this.detailId = scope.id;
    },
    clean() {
      this.detailId = 0;
    }
  },
  computed: mapState(["consume"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 600px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
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
  padding-top: 0;
}
.consume {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2002;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>