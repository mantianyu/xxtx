<template>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="优化标题：" prop="seotitle">
            <el-input v-model="form.seotitle" placeholder="请输入优化标题"></el-input>
        </el-form-item>
        <el-form-item label="Tag词：" prop="tagword">
            <el-input v-model="form.tagword" placeholder="请输入Tag词"></el-input>
        </el-form-item>
        <el-form-item label="关键词：" prop="keyword">
            <el-input v-model="form.keyword" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item label="页面描述：" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit('form')" style="margin-left: 47%">保存</el-button>
    </el-form>
</template>


<script>
  export default {
    data() {
      return {
          form: {
            seotitle: "",
            tagword: "",
            keyword: "",
            description: ""
          },
          rules: {
            seotitle: [{ required: true, message: "请输入优化标题", trigger: "blur" }],
            tagword: [{ required: true, message: "请输入Tag词", trigger: "blur" }],
            keyword: [{ required: true, message: "请输入关键词", trigger: "blur" }],
            description: [{ required: true, message: "请输入页面描述", trigger: "blur" }],
          }
      };
    },
    props: {
        detail: Object
    },
    watch: {
        detail(){
            this.form.seotitle = this.detail.seotitle;
            this.form.tagword = this.detail.tagword;
            this.form.keyword = this.detail.keyword;
            this.form.description = this.detail.description;
        }
    },
    methods: {
      onSubmit(formName){
          this.$refs[formName].validate(valid => {
              if(valid){
                  var data =  this.detail;
                  data.seotitle = this.form.seotitle;
                  data.tagword = this.form.tagword;
                  data.keyword = this.form.keyword;
                  data.description = this.form.description;
                  this.saveSet(data);
              } else {
                  console.log("error submit!!");
                  return false;
              }
          })
      },
      saveSet: async function(data){
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
                console.log(error)
            }
      }
    }
  }
</script>

<style scoped>

</style>
