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
                    label="楼房名称">
                <template slot-scope="scope">
                    <router-link  :to="{ path: '/fwgl/cwsz/floort/'+scope.row.id,query: {buildname:scope.row.name}}">
                        {{scope.row.name}}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="楼房编码" >
            </el-table-column>
            <el-table-column
                    prop="floor_count"
                    label="层数" >
            </el-table-column>
            <el-table-column
                    prop="room_count"
                    label="房间数">
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
        <v-ebuild :buildId="buildId"></v-ebuild>
        <v-abuild :directions="directions" :nursingType="careType" :bedType="bedType"></v-abuild>
    </div>
</template>

<script>
import vEbuild from "./buildEdit.vue";
import vAbuild from "./addBuild.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      buildId: 0,
      total: 0,
      last_page: 0,
      directions: [],
      careType: [],
      bedType: [],
      loading: false,
      currentPage: 1
    };
  },
  components: {
    vEbuild,
    vAbuild
  },
  mounted() {
    this.fetchList(1);
    this.getDirection();
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
      let url = this.api.buildinglist + "?page=" + val;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
          this.last_page = res.data.data.last_page;
          this.buildId = 0;
          this.$nextTick(() => {
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
    deleteBedType: async function(id) {
      let url = this.api.delbuilding;
      var data = {
        lid: id
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
        this.$alert(this.message.pleaseChoiceBuilding, "", {
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
            this.deleteBedType(data);
          })
          .catch(() => {});
      }
    },
    showEedit(scope) {
      this.$store.dispatch("buildEditTrue");
      this.buildId = scope.id;
    },
    clean() {
      this.buildId = 0;
    },
    showAdd() {
      this.$store.dispatch("addBuildTrue");
    },
    // getDirection: async function () {
    //     let url = this.api.data;
    //     var data = {
    //         'group': [this.data.BEADHOUSE_OBJECT_DIRECTION]
    //     }
    //     const res = await this.$http.post(url, data);
    //     console.log('res',res)

    //     this.directions = res.data.data
    //     console.log('this.directions===',this.directions)
    // },
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
</style>