<template>
    <el-container style="height: 100%;background: #ffffff;">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
                <h5>服务统计</h5>
                <div class="find">
                    <el-form :model="ruleForm" size="small" label-width="100px" ref="ruleForm" :inline="true" @submit.native.prevent>
                        <el-form-item label="老人:" prop="elder">
                            <el-select v-model="ruleForm.elder_id" clearable filterable placeholder="请选择老人" style="width: 140px;" size="small">
                                <el-option @input="changeelder()"
                                v-for="(eld, key) in eldArr"
                                :key="key"
                                :label="eld.name"
                                :value="eld.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="margin-left: 10px">
                            <div style="margin-left: 10px;float: left">
                                <el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-header>
        <el-main>
            <v-service :searchData="searchData"></v-service>
        </el-main>
    </el-container>
</template>

<script>
import vService from "./common/FWTJTable.vue"

export default {
    data () {
        return {
            ruleForm: {
                elder_id: '',
            },
            eldArr: [],
            searchData: {}
        }
    },
    components:{
	    vService
    },
    mounted(){
        this.changeelder();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	var data = {
                            'elder_id': this.ruleForm.elder_id,
                        }
		            	this.searchData = data;
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });
        },
        changeelder: async function(){
            let url = this.api.gettaskelders;
            let data = {};
            const res = await this.$http.post(url, data);
            this.eldArr = res.data.data;
        },
    }
}
</script>

<style scoped>
.top-tit {
  padding: 20px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}
.top-tit h5 {
  color: #ff8777;
  font-weight: normal;
  float: left;
  line-height: 30px;
  margin: 0;
  font-size: 18px;
}
.demo-ruleForm {
  display: flex;
}

.find form {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
