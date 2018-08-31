<template>
	<div class="table">
		<el-button @click="goback" type="danger" size="small" style="position: absolute;top: 8px;right: 30px;z-index: 99;"><i class="el-icon-arrow-left el-icon--left">返回</i></el-button>
		<el-row class="roomtcj">
			<el-col :span="4" :offset="1">
				{{buildname}}
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
		      label="楼层名称">
		      	<template slot-scope="scope">
			        <router-link :to="{ path: '/fwgl/cwsz/roomt/'+lid+'/'+scope.row.id,query:{ buildname:buildname,floornum:scope.row.name}}">
	              		{{scope.row.name}}
	            	</router-link>
		        </template>
		    </el-table-column>
		    <el-table-column
		      prop="buliding_name"
		      label="楼房名称">
		    </el-table-column>
		    <el-table-column
		      prop="room_count"
		      label="房间数">
		    </el-table-column>
		    <el-table-column
		      prop="bed_count"
		      label="床位数">
		    </el-table-column>
		    <el-table-column
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showEedit(scope.row)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
				<el-button type="success" @click="showAdd">新增</el-button>
			</div>
			<div style="display: flex;margin-right: 20px;">
				<el-button type="primary" size="small" @click="fetchList(1)">首页</el-button>
				<el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" layout="prev, pager, next" :total="total">
				</el-pagination>
				<el-button type="primary" size="small" @click="fetchList(last_page)">末页</el-button>
			</div>
		</div>
		<v-efloor :floorId="floorId" :directions="directions" :nursingType="careType" :nurseProject="nurseProject" :bedType="bedType"></v-efloor>
		<v-afloor :lid="lid" :directions="directions" :nursingType="careType" :nurseProject="nurseProject" :bedType="bedType"></v-afloor>
	</div>
</template>

<script>
import vEfloor from "./floorEdit.vue";
import vAfloor from "./addFloor.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      floorId: 0,
      total: 0,
      last_page: 0,
      directions: [],
      nurseProject: [],
      bedType: [],
      lid: this.$route.params.lid,
      careType: [],
      loading: false,
      buildname: "",
      currentPage: 1
    };
  },
  created: function() {
    this.buildname = this.$route.query.buildname;
  },
  components: {
    vEfloor,
    vAfloor
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
      let url = this.api.floorlist + "?page=" + val;
      var data = {
        lid: this.$route.params.lid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.floorId = 0;
          this.$nextTick(() => {
            this.loading = false;
            this.currentPage = val;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
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
    deleteFloor: async function(id) {
      let url = this.api.delfloor;
      var data = {
        fid: id
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
        this.$alert(this.message.pleaseChoiceFloorNumber, "", {
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
            this.deleteFloor(data);
          })
          .catch(() => {});
      }
    },
    showEedit(scope) {
      this.$store.dispatch("floorEditTrue");
      this.floorId = scope.id;
    },
    clean() {
      this.floorId = 0;
    },
    showAdd() {
      this.$store.dispatch("addFloorTrue");
      this.floorId = 0;
    },
    getDirection: async function() {
      let url = this.api.data;
      var data = {
        group: [
          this.data.BEADHOUSE_OBJECT_DIRECTION,
          this.data.HEALTH_SELF_CARE_ABILITY
        ]
      };
      const res = await this.$http.post(url, data);
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

