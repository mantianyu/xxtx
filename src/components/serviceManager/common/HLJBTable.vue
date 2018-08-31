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
		      label="护理级别名称">
		    </el-table-column>
		    <el-table-column
		      prop="levelprice"
		      label="护理费用">
		    </el-table-column>
		    <el-table-column
		      prop="levelintroduction"
		      label="级别说明">
		    </el-table-column>
		    <el-table-column
		      prop="servicetype"
		      label="服务对象">
		      <template slot-scope="scope">
		      	<p>{{care[scope.row.servicetype]}}老人</p>
		      </template>
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
				
			</div>
	    </div>
	    <v-hljb :nlid="nlid" :cares="care"></v-hljb>
	</div>
</template>

<script>
import vHljb from "./addHLJB.vue";

export default {
  data() {
    return {
      tableData: [],
      nlid: 0,
      multipleSelection: [],
      care: [],
      loading: false
    };
  },
  components: {
    vHljb
  },
  mounted() {
    this.fetchList(1);
    this.fetchCare();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.nlevellist + "?page=" + val;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data;
          this.nlid = 0;
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
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    deleteLevel: async function(id) {
      let url = this.api.nleveldel;
      var data = {
        nlid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
            title: this.message.success,
            message: this.message.deleteNurseRankSuccess,
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
        this.$alert(this.message.pleaseChoiceLevel, "", {
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
            this.deleteLevel(data);
		  })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("addHLJBTrue");
      if (scope != 0) {
        this.nlid = scope.id;
      } else {
        this.nlid = 0;
      }
    },
    fetchCare: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.HEALTH_SELF_CARE_ABILITY
      };
      const res = await this.$http.post(url, data);
      this.care = res.data.data;
    },
    clean() {
      this.nlid = 0;
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