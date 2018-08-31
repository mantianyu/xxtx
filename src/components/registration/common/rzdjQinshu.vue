<template>
  <div>
      <el-table
        :data="tableDataQS"
        style="width: 100%"
        stripe>
        <el-table-column
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="relation"
          label="与老人关系">
          <template slot-scope="scope">
            <p>{{ relation[scope.row.relation] }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_guardian"
          label="是否监护人">
          <template slot-scope="scope">
            <p>{{ scope.row.is_guardian == 0 ? '否' : '是' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="联系地址">
        </el-table-column>
        <el-table-column
          prop="active"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delRelate(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye">
        <div class="caozuo">
          <el-button type="info" plain @click="showAdd(0)">新增</el-button>
        </div>
        <div style="display: flex;margin-right: 20px;float: right;">
          <el-button type="primary" size="small" @click="JdrzqsManageList(1)">首页</el-button>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
          <el-button type="primary" size="small" @click="JdrzqsManageList(last_page)">末页</el-button>
        </div>
      </div>
      <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
        <el-button type="info" size="medium" @click="back">上一步</el-button>
        <el-button type="danger" size="medium" style="margin-left: 30px;" @click="next">保存</el-button>
      </div>
      <v-relation :erid="erid" :elderId="elderid" :relation="relation"></v-relation>
  </div>
</template>

<script>
  import vRelation from './addRelation.vue'

	export default {
		props: ["elderDetail", "id", "noRegist"],
	    data() {
	      return {
          total: 0,
          last_page: 0,
          tableDataQS: [],
          erid: 0,
          elderid: 0,
          relation: [],
	      }
	    },
      components:{
        vRelation
      },
	    watch:{
	    	elderDetail(){
          if(this.elderDetail.length == 0){
            this.$parent.$parent.$parent.$parent.loadingFalse();
          }else{
            this.elderid = this.elderDetail.elderid;
            this.JdrzqsManageList(this.elderid, 1);
          }
	    	},
        id(){
          if(this.id != 0){
            this.elderid = this.id;
            this.JdrzqsManageList(this.elderid, 1);
          }
        }
	    },
      mounted(){
        this.fetchRelation();
      },
	    methods: {
        handleCurrentChange(val) {
          this.JdrzqsManageList(this.elderid, val);
        },
        JdrzqsManageList: async function(id, val){
          let url = this.api.elderrelativelist + '?page=' + val;
          let data = {
            'elderid': id
          };
          const res = await this.$http.post(url,data);
          if(res.data.status_code == 200){
            this.tableDataQS = [];
            this.tableDataQS = res.data.data;
            this.total = res.data.total;
            this.last_page = res.data.last_page;
            this.erid = 0;
          }
        },
        showAdd(scope) {
          this.$store.dispatch('addRelationTrue');
          if(scope == 0){
            this.erid = 0;
          }else{
            this.erid = scope.id;
          }
        },
        delRelate: async function(scope){
          let url = this.api.delelderrelative;
          var data = {
            'erid': scope.id
          }
          const res = await this.$http.post(url,data);
          if(res.data.status_code == 200){
            this.JdrzqsManageList(this.elderid, 1);
          }else{
            this.$alert(res.data.data, '', {
              confirmButtonText: this.message.confirm,
              callback: action => {
                
              }
            });
          }
        },
	      next() {
          if(this.noRegist){
            this.$parent.$parent.$parent.$parent.detailEmpty();
            this.$parent.$parent.$parent.$parent.hideEdit();
          }else{
            this.$parent.$parent.$parent.$parent.showNewHealth();
          }
		    },
		    back(){
		      this.$parent.$parent.$parent.$parent.showNewInfo();
		    },
        clean(){
            this.erid = 0;
        },
        fetchRelation: async function(){
          let url = this.api.data;
          var data = {
            'group': this.data.BEADHOUSE_FAMILY_ELATION
          }
          const res = await this.$http.post(url,data);
          this.relation = res.data.data;
          this.$nextTick(()=>{
              this.$parent.$parent.$parent.$parent.loadingFalse();
          })
        }
	    }
	  }
</script>

<style scoped>
	span{
		white-space: normal;
	}
  .fenye{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }
</style>
