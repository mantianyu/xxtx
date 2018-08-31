<template>
	<div class="addActive" v-show="addActive">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
	        <div class="pop-top">
	            <h5>添加活动</h5>
	            <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
	        </div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
	        <div class="qxz">
	        	<el-form :rules="rules" ref="form" :model="form" label-width="120px" class="demo-ruleForm">
        		   	<el-form-item label="活动名称:" prop="name">
				    	<el-input v-bind:disabled="isActive" v-model="form.name"></el-input>
				  	</el-form-item>
				  	<el-form-item label="活动主题:" prop="subject">
				    	<el-input v-bind:disabled="isActive" v-model="form.subject"></el-input>
				  	</el-form-item>
				  	<el-form-item label="活动地址:" prop="address">
				    	<el-input v-bind:disabled="isActive" v-model="form.address"></el-input>
				  	</el-form-item>
					<el-form-item label="活动类型:" prop="type">
					    <el-select v-bind:disabled="isActive" v-model="form.type" clearable placeholder="请选择活动类型">
					      	<el-option v-for="(active, key) in activeType" :label="active" :key="key" :value="key * 1"></el-option>
					    </el-select>
					</el-form-item>
				  	<el-form-item label="活动组织人:" prop="organizer">
				    	<el-input v-bind:disabled="isActive" v-model="form.organizer"></el-input>
				  	</el-form-item>
				  	<el-form-item label="联系电话:" prop="phone">
				    	<el-input v-bind:disabled="isActive" v-model="form.phone"></el-input>
				  	</el-form-item>
				  	<el-form-item label="活动时间:" prop="time">
				      	<el-date-picker v-bind:disabled="isActive" type="date" placeholder="选择日期" v-model="form.time"></el-date-picker>
				  	</el-form-item>
        		   	<el-form-item label="活动介绍:" prop="introduction">
				    	<el-input v-bind:disabled="isActive" type="textarea" v-model="form.introduction"></el-input>
				  	</el-form-item>
				  	<el-form-item label="图片:">
						<el-upload
						  class="upload-demo"
						  :action="this.api.uploadcareactivities"
						  :with-credentials="true"
						  :headers="{'Authorization': 'Bearer ' + token}"
						  :on-preview="handlePreview"
						  :on-remove="handleRemove"
						  :on-success="handleSuccess"
						  :file-list="fileList"
						  v-bind:disabled="isActive"
						  list-type="picture">
						  <el-button size="small" type="primary">点击上传</el-button>
						  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
				  	</el-form-item>
        		   	<el-form-item label="添加老人:">
				    	<el-button v-bind:disabled="isActive" type="info" plain size="mini" @click="addElders">添加</el-button>
				  	</el-form-item>
				  	<el-form-item label="参加老人:" prop="elders">
				    	<el-select v-bind:disabled="isActive" v-model="form.elders" filterable multiple clearable placeholder="参加老人" style="width: 580px;">
					      	<el-option v-for="(elder, key) in elders" :label="elder.old_name" :value="elder.elder_id" :key="key"></el-option>
					    </el-select>
				  	</el-form-item>
	                <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
	                	<el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
	                    <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button>
	                </div>
				</el-form>
	        </div>
				</el-scrollbar>
			</el-main>
		</el-container>
	   	<v-elders :builds="builds"></v-elders>
	</div>
</template>

<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";
import vElders from "./addElders.vue";

export default {
  props: ["activeType", "activeId", "elders"],
  data() {
    let phoneCheck = (rule, value, callback) => {
      if(value === ""){
        return callback(new Error(this.message.pleaseInputPhone));
      } else if (value < 0) {
         callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        subject: "",
        address: "",
        type: "",
        organizer: "",
        phone: "",
        time: "" + new Date(),
        introduction: "",
        elders: []
      },
      rules: {
        name: [{ required: true, message: this.message.pleaseInputActive, trigger: "blur" }],
        subject: [
          { required: true, message: this.message.pleaseInputActiveTheme, trigger: "blur" }
        ],
        address: [
          { required: true, message: this.message.pleaseInputActiveAddress, trigger: "blur" }
        ],
        type: [
          { required: true, message: this.message.pleaseChoiceActiveType, trigger: "change" }
        ],
        organizer: [
          { required: true, message: this.message.pleaseInputActiveOrganizer, trigger: "blur" }
        ],
        phone: [
           { required: true, validator: phoneCheck, trigger: "blur" }
        ],
        time: [
          { required: true, message: this.message.pleaseChoiceActiveTime, trigger: "change" }
        ],
        introduction: [
          { required: true, message: this.message.pleaseInputActiveIntro, trigger: "blur" }
        ],
        elders: [
          { required: true, message: this.message.pleaseChoiceJoinElder, trigger: "change" }
        ]
      },
      fileList: [],
      token: "",
      builds: [],
      loading: false,
      bLoading: false
    };
  },
  components: {
    vElders
  },
  watch: {
    activeId() {
      if (this.activeId == 0) {
      } else {
        this.fetchDetail(this.activeId);
      }
    },
    accessToken(){
      this.token = this.accessToken;
    }
  },
  mounted() {
		this.token = this.accessToken;
    this.fetchBuild();
  },
  methods: {
    fetchBuild: async function() {
      let url = this.api.buildingcodelist;
      var data = {};
      const res = await this.$http.post(url, data);
      this.builds = res.data.data;
    },
    handleSuccess(response, file, fileList) {
      var image = {
        name: file.name,
        url: response.data
      };
      this.fileList.push(image);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bLoading = true;
          if (this.activeId == 0) {
            var pics = [];
            for (let i = 0; i < this.fileList.length; i++) {
              var pic = {
                name: this.fileList[i].name,
                url: this.fileList[i].url
              };
              pics.push(pic);
            }
            var data = {
              name: this.form.name,
              subject: this.form.subject,
              address: this.form.address,
              type: this.form.type,
              organizer: this.form.organizer,
              phone: this.form.phone,
              time: Date.parse(new Date(this.form.time)) / 1000,
              introduction: this.form.introduction,
              pic: pics,
              employee_id: localEvent.StorageGetter("empId"),
              elders: this.form.elders
            };
            this.saveRecipe(data);
          } else {
            var pics = [];
            for (let i = 0; i < this.fileList.length; i++) {
              var pic = {
                name: this.fileList[i].name,
                url: this.fileList[i].url
              };
              pics.push(pic);
            }
            var data = {
              id: this.activeId,
              name: this.form.name,
              subject: this.form.subject,
              address: this.form.address,
              type: this.form.type,
              organizer: this.form.organizer,
              phone: this.form.phone,
              time: Date.parse(new Date(this.form.time)) / 1000,
              introduction: this.form.introduction,
              pic: pics,
              employee_id: localEvent.StorageGetter("empId"),
              elders: this.form.elders
            };
            this.saveRecipe(data);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    hideEditFalse() {
      this.$store.dispatch("addActiveFalse");
      this.$refs["form"].resetFields();
      this.fileList = [];
      this.join = [];
      this.$parent.clean();
    },
    fetchDetail: async function(id) {
      this.loading = true;
      let url = this.api.careactivitiesdetail;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.form.name = res.data.data.name;
          this.form.subject = res.data.data.subject;
          this.form.address = res.data.data.address;
          this.form.type = res.data.data.type;
          this.form.organizer = res.data.data.organizer;
          this.form.phone = res.data.data.phone;
          this.form.time = res.data.data.time;
          this.form.introduction = res.data.data.introduction;
          this.fileList = res.data.data.pics;
          this.form.elders = res.data.data.elders;
          this.$nextTick(() => {
            this.loading = false;
          });
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.loading = false;
              this.hideEditFalse();
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
            this.hideEditFalse();
          }
        });
      }
    },
    saveRecipe: async function(data) {
      let url = this.api.addcareactivities;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          if (this.activeId == 0) {
            this.$notify({
              title: this.message.success,
              message: this.message.addSuccess,
              type: "success"
            });
          } else {
            this.$notify({
              title: this.message.success,
              message: this.message.changeSuccess,
              type: "success"
            });
          } 
          this.$parent.fetchList(1);
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
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.bLoading = false;
          }
        });
      }
    },
    addElders() {
      this.$store.dispatch("addEldersTrue");
    },
    getJoin(data) {
      this.form.elders = data;
    }
  },
  computed: mapState(["addActive", "isActive", "accessToken"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 520px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  overflow-y: auto;
  position: fixed;
  top: 50%;
  margin-top: -260px;
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
.addActive {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>