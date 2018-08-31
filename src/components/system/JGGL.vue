<template>
   <el-container style="height: 100%;background: #ffffff;">
    <el-header style="min-height: 60px;height: auto;">
		<div class="top-tit">
			<h5>价格管理 </h5>
			<!-- <div class="find">
				<el-form :model="ruleForm" size="small" label-width="100px" ref="ruleForm" :inline="true" >
					<el-form-item label="房间名称：" prop="name">
						<el-input v-model="ruleForm.name" style="width:140px" size="small" placeholder="房间名称"></el-input>
					</el-form-item> 
					<el-form-item style="margin-left: 10px">
						<div style="margin-left: 10px;float: left">
							<el-button type="danger" size="small" @click="submitForm('ruleForm')">查询</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div> -->
		</div>
    </el-header>
    <el-main style="position: relative;">
      <el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
		    <v-price :searchData="searchData"></v-price>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import vPrice from './common/JGGLTable.vue'

export default {
    data() {
        return {
            ruleForm: {},
            searchData: {}
        }
    },
    components: {
        vPrice
    },
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
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
