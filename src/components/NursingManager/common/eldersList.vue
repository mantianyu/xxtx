<template>
	<div class="eldersList" v-show="eldersList">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>选择老人</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-tree
              :props="props"
              :data="areaData"
              node-key="id"
              ref="tree"
              show-checkbox
              :default-checked-keys="checkedId"
              :default-expanded-keys="expanded">
            </el-tree>
						<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: center;">
							<div>
								<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
								<el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="saveList">确认</el-button>
							</div>
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
  props: ["eldernlid", "care"],
  data() {
    return {
      props: {
        children: "children",
        label: "name"
      },
      areaData: [],
      checkedId: [],
      expanded: [],
      join: {
        build: [],
        floor: [],
        room: [],
        bed: []
      },
      loading: false,
      bLoading: false
    };
  },
  watch: {
    eldernlid() {
      if (this.eldernlid !== 0) {
        this.fetchList(1);
      }
    }
  },
  mounted() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectId = [];
      for (let i = 0; i < val.length; i++) {
        if (this.selectId.indexOf(val[i].id) == -1) {
          this.selectId.push(val[i].id);
        }
      }
    },
    handleCurrentChange(val) {
      this.fetchList(val);
    },
    hideEditFalse() {
      this.$store.dispatch("eldersListFalse");
      this.$parent.clean();
      this.areaData = [];
      this.selectId = [];
      this.join = {
        build: [],
        floor: [],
        room: [],
        bed: []
      };
    },
    fetchList: async function(val) {
      this.loading = true;
      let url = this.api.getnurseareascope + "?page=" + val;
      var data = {
        employee_id: this.eldernlid
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.setArea(res.data.data);
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    setArea(build) {
      this.areaData = [];
      this.checkedId = [];
      this.expanded = [];
      for (let i = 0; i < build.length; i++) {
        var data = {
          id: ("1" + build[i].id) * 1,
          bid: build[i].id,
          name: build[i].label,
          type: "build",
          children: []
        };
        this.expanded.push(("1" + build[i].id) * 1);
        if (build[i].children) {
          var floor = build[i].children;
          for (let k = 0; k < floor.length; k++) {
            data.children.push({
              id: ("2" + floor[k].id) * 1,
              fid: floor[k].id,
              name: floor[k].label,
              type: "floor",
              children: []
            });
            this.expanded.push(("2" + floor[k].id) * 1);
            if (floor[k].children) {
              var room = floor[k].children;
              for (let n = 0; n < room.length; n++) {
                data.children[k].children.push({
                  id: ("3" + room[n].id) * 1,
                  rid: room[n].id,
                  name: room[n].label,
                  type: "room",
                  children: []
                });
                this.expanded.push(("3" + room[n].id) * 1);
                if (room[n].children) {
                  var bed = room[n].children;
                  for (let m = 0; m < bed.length; m++) {
                    data.children[k].children[n].children.push({
                      id: ("4" + bed[m].id) * 1,
                      bid: bed[m].id,
                      name: bed[m].label,
                      type: "bed"
                    });
                    if (bed[m].checked === 1) {
                      this.checkedId.push(("4" + bed[m].id) * 1);
                    }
                  }
                }
              }
            }
          }
        }
        this.areaData.push(data);
      }
    },
    saveList: async function() {
      this.bLoading = true;
      var checkedNodes = this.$refs.tree.getCheckedNodes();
      for (let i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].type == "bed")
          this.join.bed.push(checkedNodes[i].bid);
      }
      let url = this.api.addnursesarea;
      var data = {
        areas: [
          {
            employee_id: this.eldernlid,
            area: this.join
          }
        ]
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.bLoading = false;
        this.hideEditFalse();
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    }
  },
  computed: mapState(["eldersList"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 500px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -250px;
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
.eldersList {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
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