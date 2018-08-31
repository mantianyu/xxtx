<template>
	<div class="PDRepo">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>仓库名称：{{ repoName }}</h5>
					<span class="pop-close" style="margin-right: 25px;" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 84%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-table
              :data="tableData"
              stripe
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
              label="系统数量">
              </el-table-column>
              <el-table-column
              prop="real_num"
              label="实盘数量">
              <template slot-scope="scope">
                  <el-input-number v-model="scope.row.real_num" size="mini" :min="0" label="请输入数量" :controls="false"></el-input-number>
              </template>
              </el-table-column>
            </el-table>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
              <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm">校对库存</el-button>
            </div>
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  data() {
    return {
      tableData: [],
      loading: false,
      repoName: "",
      bLoading: false
    };
  },
  watch: {},
  mounted() {
    if (this.repo_id !== 0) {
      this.fetchList(this.repo_id);
    }
  },
  methods: {
    submitForm() {
      this.bLoading = true;
      let data = {
        repo_id: this.repo_id,
        goods: this.tableData
      };
      this.proofread(data);
    },
    hideEditFalse() {
      this.$store.dispatch("PDRepoFalse");
    },
    fetchList: async function(Id) {
      this.loading = true;
      let url = this.api.getcheckgoodslist;
      let data = {
        id: Id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = res.data.data.goods;
          this.repoName = res.data.data.repo;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.$store.dispatch("PDRepoFalse");
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.$store.dispatch("PDRepoFalse");
          }
        });
      }
    },
    proofread: async function(data) {
      let url = this.api.getcheckgoodsorderlist;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (res.data.data.need_modify) {
            this.bLoading = false;
            this.$store.dispatch("PDChooseList", res.data.data.goods_list);
            this.$store.dispatch("PDChooseTrue");
          } else {
            this.savePDRepo();
          }
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.sysAbnormal, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    savePDRepo: async function() {
      let url = this.api.addinventorycheck;
      let data = {
        repo_id: this.repo_id,
        goods_list: []
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.hideEditFalse();
          this.bLoading = false;
          this.$store.dispatch("addKCPDFalse");
          this.$store.dispatch("repoId", 0);
          this.$parent.fetchList(1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.sysAbnormal, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    }
  },
  computed: mapState(["repo_id"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 1100px;
  height: 580px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -290px;
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
.PDRepo {
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