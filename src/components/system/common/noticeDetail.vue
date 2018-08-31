<template>
	<div class="seeNotice">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
				<div class="pop-top">
					<h5>公告</h5>
					<span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
				</div>
			</el-header>
			<el-main style="height: 89%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
					<div class="qxz">
						<el-form :rules="rules" ref="form" :model="form" label-width="140px" class="demo-ruleForm">
              <div style="display: flex;flex-wrap: wrap;">
                <el-form-item label="标题:" prop="title">
                <el-input v-model="form.title" style="width: 200px" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="发布时间:" prop="send_time">
                <el-input v-model="form.send_time" style="width: 200px" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="发布人:" prop="sender">
                    <el-input v-model="form.sender" style="width: 200px" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="内容:" prop="content">
                  <el-scrollbar>
                  <div style="width: 540px; height: 260px;margin:0 auto" id="content"></div>
                  </el-scrollbar>
                </el-form-item>
              </div>
              <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
                <el-button type="info" size="medium" @click="hideEditFalse" style="z-index: 99">取消</el-button>
                <!-- <el-button type="danger" size="medium" :loading="bLoading" style="margin-left: 30px;" @click="submitForm('form')">确认</el-button> -->
              </div>
            </el-form>
		      </div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
export default {
  props: ["detail"],
  data() {
    return {
      form: {
        title: "",
        send_time: "",
        sender: "",
        content: "",
      },
      rules: {},
      loading: false,
      bLoading: false
    };
  },
  mounted() {
    if(this.detail){
      this.form.title = this.detail.title;
      this.form.send_time = this.detail.send_time;
      this.form.sender = this.detail.sender;
      this.form.content = this.detail.content;
    }
    var Content = document.getElementById("content");
    Content.innerHTML = this.form.content;
  },
  methods: {
    hideEditFalse() {
      this.$parent.$parent.seeContent = false;
    },
  }
};
</script>

<style scoped>
.pop {
  display: block;
  width: 800px;
  height: 640px;
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
.seeNotice {
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