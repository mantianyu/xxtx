<template>
	<div class="table">
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
		      prop="name"
		      label="类型名称">
		    </el-table-column>
		    <el-table-column
		      prop="level"
		      label="事故等级">
		    </el-table-column>
		    <el-table-column
		      prop="contact"
		      label="联系人">
		    </el-table-column>
		    <el-table-column
		      prop="phone"
		      label="联系电话">
		    </el-table-column>
		    <el-table-column
		      prop="introduction"
		      label="类型描述">
		    </el-table-column>
		    <el-table-column
		      prop="contingency_plan"
		      label="处理预案">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
        <el-button type="success" @click="showAdd(0)">新增</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination
				  background
				  @current-change="handleCurrentChange"
					    :current-page="currentPage"
				  layout="prev, pager, next"
				  :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
	    </div>
	    <v-accident :accidentTypeId="accidentTypeId" :accident="accident"></v-accident>
	</div>
</template>

<script>
// oldVisitBackFlag: 控制显示离开时间  0 限时  1 不限时

import vAccident from "./addAccidentType.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      accidentTypeId: 0,
      total: 0,
      last_page: 0,
      accident: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vAccident
  },
  mounted() {
    this.fetchList(1);
    this.fetchAccident();
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
      let url = this.api.accidenttypelist + "?page=" + val;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.accidentTypeId = 0;
          this.$nextTick(function() {
            this.loading = false;
            this.currentPage = val;
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
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    deleteAccidentType: async function(id) {
      let url = this.api.accidenttypedel;
      var data = {
        typeid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteSuccess,
              type: "success"
            });
          this.fetchList(1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
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
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceTypeWarn, "", {
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
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].id;
              data.push(id);
            }
            this.deleteAccidentType(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addAccidentTypeTrue");
      if (scope != 0) {
        this.accidentTypeId = scope.id;
      } else {
        this.accidentTypeId = 0;
      }
    },
    clean() {
      this.accidentTypeId = 0;
    },
    fetchAccident: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_ACCIDENT_LEVEL
      };
      const res = await this.$http.post(url, data);
      this.accident = res.data.data;
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
</style>