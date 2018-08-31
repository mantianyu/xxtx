<template>
  <div>
    <div style="border-bottom: 1px solid #ddd;">
      <h5 style="color: #ff8777;margin-left: 20px;padding-top: 20px;margin-bottom: 20px;">物资类别</h5>
    </div>
    <div style="display: flex;justify-content: flex-end;margin-right: 20px;">
      <el-button type="text" size="small" @click="showAdd(0)">添加</el-button>
      <el-button type="text" size="small" @click="showAdd(1)">修改</el-button>
      <el-button type="text" size="small" @click="delList">删除</el-button>
    </div>
    <el-radio-group v-model="checkedNum" style="display: flex;flex-direction: column;" @change="changeList">
      <el-radio style="margin-left: 15px;margin-top: 5px;" :label="int0">物资类别</el-radio>
      <el-radio v-for="(type, key) in data" :key="key" :label="type.id" style="margin-left: 30px;margin-top: 5px;">{{type.name}}</el-radio>
    </el-radio-group>
    <v-wztype :typeId="typeId"></v-wztype>
  </div>
</template>
<script>
import vWztype from "./addWZType.vue";

export default {
  data() {
    return {
      data: [],
      typeId: 0,
      checkedNum: 0,
      int0: 0
    };
  },
  components: {
    vWztype
  },
  mounted() {
    this.fetchList();
    this.checkedNum = this.$route.params.id * 1;
  },
  methods: {
    changeList() {
      this.$router.push({
        path: "/rcsw/wzsz/wzszt/" + this.checkedNum
      });
    },
    fetchList: async function() {
      let url = this.api.getgoodscategorylist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.data = res.data.data;
    },
    delList() {
      if (this.checkedNum == 0) {
        this.$alert(this.message.noChoiceSort, "", {
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
            this.delProList();
          })
          .catch(() => {});
      }
    },
    delProList: async function() {
      let url = this.api.delgoodscategory;
      var data = {
        id: this.checkedNum
      };
      const res = await this.$http.post(url, data);
      if (res.data.status_code == 200) {
        this.fetchList();
        this.checkedNum = 0;
        this.$router.push({ path: "/rcsw/wzsz/wzszt/0" });
      } else {
        this.$alert(res.data.data, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    showAdd(val) {
      if (val === 1) {
        if (this.checkedNum != 0) {
          this.typeId = this.checkedNum;
          this.$store.dispatch("addWZLBTrue");
        } else {
          this.$alert(this.message.noChoiceSort, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {}
          });
        }
      } else {
        this.typeId = 0;
        this.$store.dispatch("addWZLBTrue");
      }
    },
    clean() {
      this.typeId = 0;
    }
  }
};
</script>