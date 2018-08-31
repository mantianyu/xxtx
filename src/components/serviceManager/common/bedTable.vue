<template>
	<div class="table">
		<el-button @click="goback" type="danger" size="small" style="position: absolute;top: 8px;right: 30px;z-index: 99;"><i class="el-icon-arrow-left el-icon--left">返回</i></el-button>
		<el-row class="roomtcj">
			<el-col :span="4" :offset="1">
				{{buildname}}{{roomname}}
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
		      prop="name"
		      label="床位名称">
		    </el-table-column>
		    <el-table-column
		      prop="number"
		      label="床位编号">
		    </el-table-column>
		    <el-table-column
		      prop="direction"
		      label="床位朝向">
		      <template slot-scope="scope">
		      	<p>{{directions[scope.row.direction]}}</p>
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="type_id"
		      label="床位类型">
		    </el-table-column>
		    <el-table-column
		      prop="nursing_type_id"
		      label="护理类型">
		    </el-table-column>
		    <el-table-column
		      prop="status"
		      label="床位状态">
		    </el-table-column>
		    <el-table-column
		      prop="room"
		      label="房间名称">
		    </el-table-column>
		    <el-table-column
		      prop="floor"
		      label="楼层名称">
		    </el-table-column>
		    <el-table-column
		      prop="buliding"
		      label="楼房名称">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showEedit(scope.row)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
				<el-button type="success" @click="showEedit(0)">新增</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" layout="prev, pager, next" :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
		</div>
		<v-abed :bedId="bedId" :lid="lid" :fid="fid" :rid="rid" :nursingType="careType" :directions="directions" :nurseProject="nurseProject" :bedType="bedType"></v-abed>
	</div>
</template>

<script>
import vAbed from "./addBed.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      bedId: 0,
      total: 0,
      last_page: 0,
      directions: [],
      nurseProject: [],
      bedType: [],
      lid: this.$route.params.lid,
      fid: this.$route.params.fid,
      rid: this.$route.params.rid,
      careType: [],
      loading: false,
      buildname: "",
      roomname: "",
      currentPage: 1
    };
  },
  created: function() {
    this.roomname =
      this.$route.query.roomname
        .replace(/-/, ">")
        .replace(/-/, "层>")
        .replace(/[^>]*/, "") + this.message.room;
    this.buildname = this.$route.query.buildname;
  },
  components: {
    vAbed
  },
  mounted() {
    this.fetchList(1);
    this.getDirection();
    this.getNurseProject();
    this.getBedType();
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
      let url = this.api.bedlist + "?page=" + val;
      var data = {
        rid: this.$route.params.rid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.bedId = 0;
          this.$nextTick(() => {
            this.loading = false;
            this.currentPage = val;
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
    deleteBed: async function(id) {
      let url = this.api.delbed;
      var data = {
        bid: id
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
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceBed, "", {
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
            let data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].id;
              data.push(id);
            }
            this.deleteBed(data);
          })
          .catch(() => {});
      }
    },
    showEedit(scope) {
      this.$store.dispatch("addBedTrue");
      if (scope == 0) {
        this.bedId = 0;
      } else {
        this.bedId = scope.id;
      }
    },
    clean() {
      this.bedId = 0;
    },
    getDirection: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_OBJECT_DIRECTION,
          this.data.HEALTH_SELF_CARE_ABILITY
        ]
      };
      console.log("data============", data);
      const res = await this.$http.post(url, data);
      console.log("resall====", res);
      this.directions = res.data.data[this.data.BEADHOUSE_OBJECT_DIRECTION];
      this.careType = res.data.data[this.data.HEALTH_SELF_CARE_ABILITY];
    },

    getBedType: async function(val) {
      let url = this.api.bednolist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.bedType = res.data.data;
    },
    getNurseProject: async function(val) {
      let url = this.api.nursingprojectlist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.nurseProject = res.data.data;
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

a {
  color: #ff8777;
}

.roomtcj {
  color: #ff8777;
  line-height: 45px;
  border-bottom: 1px solid rgb(224, 224, 224);
}
</style>