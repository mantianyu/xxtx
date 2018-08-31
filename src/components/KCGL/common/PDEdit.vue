<template>
	<div class="PDEdit" v-show="PDEdit">
		<el-container class="pop">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>详情</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 84%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
            <p style="text-align: center;color: #909399;font-weight: 500">仓库名称：{{repo}}({{check_date}})</p>
            <p style="text-align: center;color: #909399;font-weight: 500;margin-top: 10px;margin-bottom: 20px;">仓库管理人：{{manager}}</p>
						<el-table
              :data="tableData"
              stripe
              v-loading="loading"
              style="width: 100%">
              <el-table-column 
              type="index" 
              width="55">
              </el-table-column>
              <el-table-column
              prop="category"
              label="物资类别">
              </el-table-column>
              <el-table-column
              prop="goods"
              label="物资名称">
              </el-table-column>
              <el-table-column
              prop="specification"
              label="规格">
              </el-table-column>
              <el-table-column
              prop="supplier"
              label="生产厂商">
              </el-table-column>
              <el-table-column
              prop="sys_num"
              label="理论在库数量">
              </el-table-column>
              <el-table-column
              prop="check_num"
              label="实际在库数量">
              </el-table-column>
              <el-table-column
              prop="modified"
              label="结果">
              <template slot-scope="scope">
                <p v-bind:style="{'color': scope.row.modified === 0 ? '#606266':'red'}">{{ scope.row.modified === 0 ? '正常' : scope.row.modified === 1 ? '盘盈' : scope.row.modified === 2 ? '盘亏' : '' }}</p>
              </template>
              </el-table-column>
              <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.modified !== 0" type="text" size="small" @click="showEdit(scope.row)">详情</el-button>
              </template>
              </el-table-column>
            </el-table>
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
    <v-pdcheck :goods_id="goods_id"></v-pdcheck>
	</div>
</template>

<script>
import vPdcheck from "./PDCheck.vue";
import { mapState } from "vuex";

export default {
  props: ["Id", "repo", "check_date", "manager"],
  data() {
    return {
      tableData: [],
      loading: false,
      goods_id: 0
    };
  },
  components: {
    vPdcheck
  },
  watch: {
    Id() {
      if (this.Id !== 0) {
        this.fetchList();
      }
    }
  },
  mounted() {},
  methods: {
    hideEditFalse() {
      this.$store.dispatch("PDEditFalse");
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.viewinventorycheck;
      let data = {
        id: this.Id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = res.data.data;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.$store.dispatch("PDEditFalse");
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.$store.dispatch("PDEditFalse");
          }
        });
      }
    },
    showEdit(scope) {
      this.$store.dispatch("PDCheckTrue");
      this.goods_id = scope.id;
    }
  },
  computed: mapState(["PDEdit"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
  height: 680px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -340px;
  left: 50%;
  margin-left: -550px;
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
.PDEdit {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>