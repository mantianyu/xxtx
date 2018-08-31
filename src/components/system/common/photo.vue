<template>
    <div ref="form">
      <div>
        <span>养老公寓图片：</span>
        <el-upload
          :action="this.api.uploademployeeimage"
          :headers="{'Authorization': 'Bearer ' + token}"
          list-type="picture-card"
          :file-list="form.images"
          :on-success="handleImages"
          :on-preview="setCover">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div>
        <span>建筑物图片：</span>
        <el-upload
          :action="this.api.uploademployeeimage"
          :headers="{'Authorization': 'Bearer ' + token}"
          list-type="picture-card"
          :file-list="form.building"
          :on-success="handleBuilding"
          :on-preview="setCover">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div>
        <span>室外环境图片：</span>
        <el-upload
          :action="this.api.uploademployeeimage"
          :headers="{'Authorization': 'Bearer ' + token}"
          list-type="picture-card"
          :file-list="form.outdoor"
          :on-success="handleOutdoor"
          :on-preview="setCover">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div>
        <span>房间类型图片：</span>
        <el-upload
          :action="this.api.uploademployeeimage"
          :headers="{'Authorization': 'Bearer ' + token}"
          list-type="picture-card"
          :file-list="form.home_type"
          :on-success="handleHometype"
          :on-preview="setCover">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div>
        <span>设施设备图片：</span>
        <el-upload
          :action="this.api.uploademployeeimage"
          :headers="{'Authorization': 'Bearer ' + token}"
          list-type="picture-card"
          :file-list="form.device"
          :on-success="handleDevice"
          :on-preview="setCover">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <el-button type="primary" @click="onSubmit" :loading="bLoading" style="margin-left: 47%; margin-top: 20px">保存</el-button>
    </div>
</template>


<script>
import localEvent from "@/utils/local";
import { mapState } from "vuex";

export default {
  data() {
    return {
      bLoading: false,
      form: {
        images: [],
        building: [],
        outdoor: [],
        home_type: [],
        device: []
      },
      token: ""
    };
  },
  watch: {
    detail() {
      if (this.detail.piclist) {
        let picArr = this.detail.piclist.split(",");
        let imagesArr = [];
        for (let i = 0; i < picArr.length; i++) {
          let data = {
            name: "name",
            url: picArr[i]
          };
          imagesArr.push(data);
        }
        this.form.images = imagesArr;
      } else {
        this.form.images = [];
      }

      if (this.detail.buildinglist) {
        let buildinglistArr = this.detail.buildinglist.split(",");
        let buildingArr = [];
        for (let i = 0; i < this.buildinglistArr.length; i ++){
          let data = {
            name: "name",
            url: buildinglistArr[i]
          };
          buildingArr.push(data);
        }
        this.form.building = buildingArr;
      } else {
        this.form.building = [];
      }

      if (this.detail.outdoorlist) {
        let outdoorlistArr = this.detail.outdoorlist.split(",");
        let outdoorArr = [];
        for(let i = 0; i < this.outdoorlistArr.length; i++){
          let data = {
            name: "name",
            url: outdoorlistArr[i]
          }
          outdoorArr.push(data);
        }
        this.form.outdoor = outdoorArr;
      } else {
        this.form.outdoor = [];
      }

      if (this.detail.hometypelist) {
        let hometypelistArr = this.detail.hometypelist.split(",");
        let homeArr = [];
        for(let i = 0; i < this.hometypelistArr.length; i++){
          let data = {
            name: "name",
            url: hometypelistArr[i]
          }
          homeArr.push(data)
        }
        this.form.home_type = homeArr;
      } else {
        this.form.home_type = [];
      }

      if (this.detail.devicelist) {
        let devicelistArr = this.detail.devicelist.split(",");
        let deviceArr = [];
        for(let i = 0; i < this.devicelistArr.length; i++){
          let data = {
            name: "name",
            url: devicelistArr[i]
          }
          deviceArr.push(data)
        }
        this.form.device = deviceArr;
      } else {
        this.form.device = [];
      }
    },
    accessToken() {
      this.token = this.accessToken;
    }
  },
  props: {
    detail: Object
  },
  mounted() {
    this.token = this.accessToken;
  },
  methods: {
    handleImages(response, file, fileList) {
      this.form.images = fileList;
    },
    handleBuilding(response, file, fileList) {
      this.form.building = fileList;
    },
    handleOutdoor(response, file, fileList) {
      this.form.outdoor = fileList;
    },
    handleHometype(response, file, fileList) {
      this.form.home_type = fileList;
    },
    handleDevice(response, file, fileList) {
      this.form.device = fileList;
    },
    onSubmit() {
      this.bLoading = true;
      let images = [];
      for (let i = 0; i < this.form.images.length; i++) {
        if (this.form.images[i].response) {
          images.push(this.form.images[i].response.data);
        } else {
          images.push(this.form.images[i].url);
        }
      }
      let building = [];
      for (let i = 0; i < this.form.building.length; i++) {
        if (this.form.building[i].response) {
          building.push(this.form.building[i].response.data);
        } else {
          building.push(this.form.building[i].url);
        }
      }
      let outdoor = [];
      for (let i = 0; i < this.form.outdoor.length; i++) {
        if (this.form.outdoor[i].response) {
          outdoor.push(this.form.outdoor[i].response.data);
        } else {
          outdoor.push(this.form.outdoor[i].url);
        }
      }
      let home_type = [];
      for (let i = 0; i < this.form.home_type.length; i++) {
        if (this.form.home_type[i].response) {
          home_type.push(this.form.home_type[i].response.data);
        } else {
          home_type.push(this.form.home_type[i].url);
        }
      }
      let device = [];
      for(let i = 0; i < this.form.device.length; i++) {
        if (this.form.device[i].response) {
          device.push(this.form.device[i].response.data);
        } else {
          device.push(this.form.device[i].url);
        }
      }
      let data = this.detail;
      data.images = images;
      data.building = building;
      data.outdoor = outdoor;
      data.home_type = home_type;
      data.device = device;
      console.log(data);
      this.savePhoto(data);
    },
    setCover(file) {
      if (file) {
        this.$confirm("是否将此照片设为封面?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = this.detail;
            data.litpic = file.response.data;
            this.savePhoto(data);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消成功"
            });
          });
      } else {
        return;
      }
    },
    savePhoto: async function(data) {
      let url = this.api.savehotelinfo;
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
              this.bLoading = false;
            }
          });
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
    }
  },
  computed: mapState(["accessToken"])
};
</script>

<style scoped>
</style>
