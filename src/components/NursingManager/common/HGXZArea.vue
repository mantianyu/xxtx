<template>
    <div>
      <el-tree
        :props="props"
        :data="areaData"
        node-key="id"
        ref="tree"
        show-checkbox
        :default-checked-keys="checkedId">
      </el-tree>
      <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
        <el-button type="info" size="medium" @click="goback">上一步</el-button>
        <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm">确认</el-button>
      </div>
    </div>
</template>

<script>
export default {
  props: ["groupId"],
  data() {
    return {
      props: {
        children: "children",
        label: "name"
      },
      areaData: [],
      checkedId: [],
      join: {
        build: [],
        floor: [],
        room: [],
        bed: []
      },
      bLoading: false
    };
  },
  watch: {},
  mounted() {
    this.fetchArea();
  },
  methods: {
    submitForm: async function() {
      this.bLoading = true;
      var checkedNodes = this.$refs.tree.getCheckedNodes();
      for (let i = 0; i < checkedNodes.length; i++) {
        if (checkedNodes[i].type == "build")
          this.join.build.push(checkedNodes[i].bid);
        else if (checkedNodes[i].type == "floor")
          this.join.floor.push(checkedNodes[i].fid);
        else if (checkedNodes[i].type == "room")
          this.join.room.push(checkedNodes[i].rid);
        else if (checkedNodes[i].type == "bed")
          this.join.bed.push(checkedNodes[i].bid);
      }
      let url = this.api.addnursesgrouparea;
      let data = {
        group_id: this.groupId,
        area: this.join
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code === 200) {
          this.bLoading = false;
          this.$parent.$parent.$parent.$parent.hideEditFalse();
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    fetchArea: async function() {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.getnursegroupareascope;
      let data = {
        group_id: this.groupId
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code === 200) {
        this.setArea(res.data.data);
        this.$nextTick(() => {
          this.$parent.$parent.$parent.$parent.loadingFalse();
        });
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.$parent.$parent.$parent.$parent.loadingFalse();
            this.$parent.$parent.$parent.$parent.hideEditFalse();
          }
        });
      }
    },
    setArea(build) {
      this.areaData = [];
      this.checkedId = [];
      for (let i = 0; i < build.length; i++) {
        var data = {
          id: ("1" + build[i].id) * 1,
          bid: build[i].id,
          name: build[i].label,
          type: "build",
          children: []
        };
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
    goback() {
      this.$parent.$parent.$parent.$parent.showTeam();
    }
  }
};
</script>

<style>
</style>
