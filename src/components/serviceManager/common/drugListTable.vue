<template>
  <div class="table">
    <el-button @click="goback" type="danger" size="small" style="position: absolute;top: 8px;right: 50px;z-index: 99;"><i class="el-icon-arrow-left el-icon--left">返回</i></el-button>
    <el-row class="roomtcj">
			<el-col :span="5" :offset="1">
				{{lrname}}
			</el-col>
		</el-row>
    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="drugname"
          label="药品名">
        </el-table-column>
        <el-table-column
          prop="count"
          label="药品数量">
        </el-table-column>
        <el-table-column
          prop="surplus"
          label="剩余量">
        </el-table-column>
        <el-table-column
          prop="warncount"
          label="药品警告数量">
        </el-table-column>
    </el-table>
    <div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
      <div>
        <el-button type="danger" @click="refund">退缴</el-button>
      </div>
      <div style="display: flex;margin-right: 20px;">
        <el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
        </el-pagination>
        <el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      last_page: 0,
      multipleSelection: [],
      loading: false,
      lrname: ""
    };
  },
  created: function() {
    this.lrname = this.$route.query.lrname;
  },
  mounted() {
    this.fetchList(1);
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.elderdruglist + "?page=" + val;
      var data = {
        elderid: this.$route.params.elderid,
        safekeepingid: this.$route.params.safekeepingid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.$nextTick(function() {
            this.loading = false;
          });
        } else {
          this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    fetchRefund: async function(drugArr) {
      let url = this.api.deldrugsafekeeping;
      var data = {
        drugids: drugArr
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.fetchList(1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    refund() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceMedicineWarn, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherDelete, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            let id_arr = this.multipleSelection;
            let arr = [];
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].dsdid;
              arr.push(id);
            }
            this.fetchRefund(arr);
          })
          .catch(() => {});
      }
    },
    goback: async function() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}

.roomtcj {
  color: #ff8777;
  line-height: 50px;
  border-bottom: 1px solid rgb(224, 224, 224);
}
</style>