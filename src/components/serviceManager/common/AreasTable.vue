<template>
	<div class="table">
		<el-button @click="goback" type="danger" size="small" style="position: absolute;top: 12px;right: 50px;z-index: 99;"><i class="el-icon-arrow-left el-icon--left">返回</i></el-button>
		<el-row class="roomtcj">
			<el-col :span="3" :offset="1">
				{{qyname}}
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
		      prop="buildings_name"
		      label="楼栋名称">
		    </el-table-column>
		    <el-table-column
		      prop="floors_name"
		      label="楼层名称">
		    </el-table-column>
		    <el-table-column
		      prop="rooms_name"
		      label="房间名称">
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
				<el-button type="primary" size="small" @click="fetchList(0,1)">首页</el-button>
				<el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(0,last_page)">末页</el-button>
			</div>
		</div>
		<v-area :areasId="areasId" :builds="builds"></v-area>
	</div>
</template>

<script>
import vArea from "./addArea.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      areasId: 0,
      total: 0,
      last_page: 0,
      builds: [],
      loading: false,
      qyname: ""
    };
  },
  created: function() {
    this.qyname = this.$route.query.qyname;
  },
  components: {
    vArea
  },
  watch: {},
  mounted() {
    this.fetchList(1);
    this.fetchBuild();
  },
  methods: {
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.deliveryareaslists + "?page=" + val;
      var data = {
        area_id: this.$route.params.aid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.areasId = 0;
          this.$nextTick(function() {
            this.loading = false;
          });
        } else {
          this.loading = false;
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
    deleteArea: async function(id) {
      let url = this.api.deletemealdeliveryareas;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
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
          this.deleteArea(data);
        })
        .catch(() => {});
    },
    showAdd(scope) {
      this.$store.dispatch("addAreaTrue");
      if (scope != 0) {
        this.areasId = scope.id;
      } else {
        this.areasId = 0;
      }
    },
    goback: async function() {
      this.$router.go(-1);
    },
    clean() {
      this.areasId = 0;
    },
    fetchBuild: async function() {
      let url = this.api.buildingcodelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.builds = res.data.data;
    }
  }
};
</script>

<style scoped>
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

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
