<template>
    <el-container style="height: 100%;background: #ffffff;">
        <el-header style="min-height: 60px;height: auto;">
            <div class="top-tit">
                <h5>积分查看</h5>
                <div class="find">
					<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="护工:" prop="nurse">
                            <el-select v-model="ruleForm.nurse" clearable filterable placeholder="请选择护工" style="width: 140px;" size="small">
                                <el-option
                                v-for="(nur, key) in nurArr"
                                :key="key"
                                :label="nur"
                                :value="key * 1">
                                </el-option>
                            </el-select>
                        </el-form-item>
						<div style="margin-left: 10px">
							<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
						</div>
					</el-form>
				</div>
            </div>
        </el-header>
        <el-main style="position: relative;">
            <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
                <v-integral :searchData="searchData"></v-integral>     
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script>
import vIntegral from './common/JFCKTable.vue'

export default {
    data() {
        return {
            nurArr: [],
            ruleForm: {
                nurse: ''
            },
            searchData: {},
            rules: {},
            name: ''
        }
    },
    components:{
	    vIntegral
    },
    mounted(){
        this.changeEmp();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	var data = {
                            'nurse_id': this.ruleForm.nurse
		            	}
		            	this.searchData = data;
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });
        },
        changeEmp: async function(id){
            let url = this.api.getallemployeelist;
            let data = {};
            const res = await this.$http.post(url, data);
            this.nurArr = res.data.data;
        }
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
.demo-ruleForm{
  display: flex;
}
.find form{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.el-form-item{
  margin: 0;
}
</style>