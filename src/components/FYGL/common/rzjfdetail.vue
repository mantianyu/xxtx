<template>
  <div class="Detailrzjf" v-show="rzjfdetail">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
        <div class="pop-top">
          <h5>入住缴费详情</h5>
          <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
        </div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <div>
              <el-table
                :data="detailData"
                style="width: 100%">
                <el-table-column
                  prop="deposits"
                  label="押金">
                </el-table-column>
                <el-table-column
                  prop="arrearages"
                  label="其他费用">
                </el-table-column>
                <el-table-column
                  prop="remissions"
                  label="减免费用">
                </el-table-column>
                <el-table-column
                  prop="final_dues"
                  label="交费金额">
                </el-table-column>
                <el-table-column
                  prop="imprests"
                  label="预存金额">
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData1"
                style="width: 100%; margin-top: 20px;"
                v-if="tableData1.length != 0">
                <el-table-column
                  type="index"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="fee_name"
                  label="日常类别">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="收费金额(元)">
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData2"
                style="width: 100%; margin-top: 20px;"
                v-if="tableData2.length != 0">
                <el-table-column
                  type="index"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="fee_name"
                  label="月收类别">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="收费金额(元)">
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData3"
                style="width: 100%; margin-top: 20px;"
                v-if="tableData3.length != 0">
                <el-table-column
                  type="index"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="fee_name"
                  label="年收类别">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="收费金额(元)">
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData4"
                style="width: 100%; margin-top: 20px;"
                v-if="tableData4.length != 0">
                <el-table-column
                  type="index"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="fee_name"
                  label="特殊类别">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="收费金额(元)">
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData5"
                style="width: 100%; margin-top: 20px;"
                v-if="tableData5.length != 0">
                <el-table-column
                  type="index"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="fee_name"
                  label="押金类别">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="收费金额(元)">
                </el-table-column>
              </el-table>
              <el-table
                :data="tableData6"
                style="width: 100%; margin-top: 20px;"
                v-if="tableData6.length != 0">
                <el-table-column
                  type="index"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="fee_name"
                  label="阶段性收费类别">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="收费金额(元)">
                </el-table-column>
              </el-table>
            </div>
          </div>
				</el-scrollbar>
			</el-main>
		</el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["feeid"],
  data() {
    return {
      detailData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      tableData6: [],
      loading: false
    };
  },
  watch: {
    feeid() {
      this.fetchDetail(this.feeid);
    }
  },
  methods: {
    hideEditFalse() {
      this.$store.dispatch("rzjfDetailFalse");
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.feementdetail;
      var data = {
        fee_id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          var data = {
            remissions: res.data.data.remissions,
            arrearages: res.data.data.arrearages,
            final_dues: res.data.data.final_dues,
            deposits: res.data.data.deposits,
            imprests: res.data.data.imprests
          };
          this.detailData = [];
          this.detailData.push(data);
          var fee = res.data.data.fee;
          if (fee[1]) this.tableData1 = fee[1];
          if (fee[2]) this.tableData2 = fee[2];
          if (fee[3]) this.tableData3 = fee[3];
          if (fee[4]) this.tableData4 = fee[4];
          if (fee[5]) this.tableData5 = fee[5];
          if (fee[6]) this.tableData6 = fee[6];
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.loading = false;
          this.hideEditFalse();
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
    }
  },
  computed: mapState(["rzjfdetail"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 520px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -260px;
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
.Detailrzjf {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
