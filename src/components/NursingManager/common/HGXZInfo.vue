<template>
    <div>
        <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
            <div style="display: flex;flex-wrap: wrap;">
              <el-form-item label="小组名称:" prop="ngname">
                  <el-input v-model="form.ngname" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="小组组长" prop="ngleader">
                  <el-select v-model="form.ngleader" clearable placeholder="请选择小组组长" style="width: 200px;" @change="selectLeader">
                      <el-option v-for="(nurse, key) in nurses" :label="nurse.name" :value="nurse.id" :key="key"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="选择护理员:" prop="ngmemberids">
                  <el-select v-model="form.ngmemberids" multiple clearable placeholder="请选择护理员" style="width: 520px;" @change="selectNurse">
                      <el-option v-for="(nurse, key) in nurses" :label="nurse.name" :value="nurse.id" :key="key"></el-option>
                  </el-select>
              </el-form-item>
            </div>
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                type="index"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="小组护工">
              </el-table-column>
              <el-table-column
                prop="id_number"
                label="身份证">
              </el-table-column>
              <el-table-column
                prop="gender"
                label="性别">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="联系方式">
              </el-table-column>
              <el-table-column
                prop="position"
                label="职务">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData, scope.row)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
                <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">下一步</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  props: ["groupId"],
  data() {
    return {
      form: {
        ngname: "",
        ngleader: "",
        ngmemberids: []
      },
      rules: {
        ngname: [
          {
            required: true,
            message: this.message.pleaseInputGroupName,
            trigger: "blur"
          }
        ],
        ngleader: [
          {
            required: true,
            message: this.message.pleaseChoiceGroupLeader,
            trigger: "change"
          }
        ]
      },
      nurses: [],
      tableData: [],
      loading: false,
      bLoading: false,
      leaderId: 0
    };
  },
  watch: {
    groupId() {
      if (this.groupId !== 0) {
        this.fetchDetail(this.groupId);
      }
    }
  },
  mounted() {
    this.fetchNurs();
    if (this.groupId !== 0) {
      this.fetchDetail(this.groupId);
    }
  },
  methods: {
    deleteRow(index, rows, row) {
      this.form.ngmemberids.splice(this.form.ngmemberids.indexOf(row.id), 1);
      if (this.form.ngleader === row.id) {
        this.form.ngleader = "";
      }
      rows.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.groupId == 0) {
            var data = {
              ngname: this.form.ngname,
              ngleader: this.form.ngleader,
              ngmemberids: this.form.ngmemberids
            };
            this.saveTeam(data);
          } else {
            var data = {
              nlid: this.groupId,
              ngname: this.form.ngname,
              ngleader: this.form.ngleader,
              ngmemberids: this.form.ngmemberids
            };
            this.saveTeam(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$parent.$parent.$parent.$parent.hideEditFalse();
    },
    fetchDetail: async function(id) {
      this.$parent.$parent.$parent.$parent.loadingTrue();
      let url = this.api.nwgroupinfo;
      var data = {
        nlid: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.ngname = res.data.data.nlname;
          this.form.ngleader = res.data.data.nlleader;
          var empList = res.data.data.memberinfo;
          for (let i = 0; i < empList.length; i++) {
            this.nurses.push(empList[i]);
            this.form.ngmemberids.push(empList[i].id);
          }
          this.$nextTick(() => {
            this.table();
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
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.$parent.$parent.$parent.$parent.loadingFalse();
            this.$parent.$parent.$parent.$parent.hideEditFalse();
          }
        });
      }
    },
    saveTeam: async function(data) {
      let url = this.api.nwgroup;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.bLoading = false;
          this.$parent.$parent.$parent.$parent.$parent.fetchList(1);
          this.$parent.$parent.$parent.$parent.getGroupId(
            res.data.data.group_id
          );
          this.$parent.$parent.$parent.$parent.showArea();
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
    fetchNurs: async function() {
      let url = this.api.getnurses;
      var data = {
        group: 0
      };
      const res = await this.$http.post(url, data);
      this.nurses = [];
      this.nurses = res.data.data;
    },
    selectLeader(val) {
      if (val) {
        if (this.form.ngmemberids.length === 0) {
          this.form.ngmemberids.push(val);
        } else {
          if (this.form.ngmemberids.indexOf(val) !== -1) {
            this.form.ngmemberids.splice(
              this.form.ngmemberids.indexOf(val),
              1,
              val
            );
          } else {
            this.form.ngmemberids.push(val);
          }
        }
        this.table();
      } else {
        this.form.ngmemberids.splice(this.form.ngmemberids.indexOf(val), 1);
        this.table();
      }
    },
    selectNurse(val) {
      let flag = true;
      for (let i = 0; i < val.length; i++) {
        if (this.form.ngleader === val[i]) {
          flag = false;
        }
      }
      if (flag) {
        this.form.ngleader = "";
      }
      this.table();
    },
    table() {
      this.tableData = [];
      for (let k = 0; k < this.form.ngmemberids.length; k++) {
        for (let i = 0; i < this.nurses.length; i++) {
          if (this.nurses[i].id === this.form.ngmemberids[k]) {
            this.tableData.push(this.nurses[i]);
            break;
          }
        }
      }
    }
  },
  computed: mapState(["addHGXZ"])
};
</script>
