<template>
  <div>
    <div style="border-bottom: 1px solid #ddd;">
      <h5 style="color: #ff8777;margin-left: 20px;padding-top: 20px;margin-bottom: 20px;">护理项目类别</h5>
    </div>
    <div style="display: flex;justify-content: flex-end;margin-right: 20px;">
      <el-button type="text" size="small" @click="showAdd(0)">添加</el-button>
      <el-button type="text" size="small" @click="showAdd(1)">修改</el-button>
      <el-button type="text" size="small" @click="delNursProList">删除</el-button>
    </div>
    <el-radio-group v-model="checkedNum" style="display: flex;flex-direction: column;" @change="changeList">
      <el-radio style="margin-left: 15px;margin-top: 5px;" :label="int0">项目类别</el-radio>
      <el-radio v-for="(type, key) in data" :key="key" :label="type.id" style="margin-left: 30px;margin-top: 5px;">{{type.name}}</el-radio>
    </el-radio-group>
    <v-hlxm :typeId="typeId"></v-hlxm>
  </div>
</template>
<script>
  import vHlxm from './addHLXM.vue'

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
      vHlxm
    },
    mounted(){
      this.fetchNursProList();
      this.checkedNum = this.$route.params.pid * 1;
    },
    methods: {
      changeList(){
        this.$router.push({path: '/fwgl/hlxm/hlxmt/' + this.checkedNum});
      },
      fetchNursProList: async function(){
        let url = this.api.nursingprojectlist;
        var data = {};
        const res = await this.$http.post(url,data);
        this.data = [];
        for(let i = 0; i < res.data.data.length; i++){
          var data = {
            'id': res.data.data[i].id,
            'name': res.data.data[i].name,
          }
          this.data.push(data);
        }
        this.typeId = 0;
      },
      delNursProList(){
        if(this.checkedNum == 0){
          this.$alert(this.message.noSelectProType, '', {
            confirmButtonText: this.message.confirm,
            callback: action => {
              
            }
          });
        }else{
          this.$confirm(this.message.whetherDelete, '', {
            confirmButtonText: this.message.confirm,
              cancelButtonText: this.message.cancel,
              center: true
          }).then(() => {
            this.delProList();
          })
          .catch(() => {

          });
        }
      },
      delProList: async function(){
        let url = this.api.nursingprojectdel;
        var data = {
          'pid': this.checkedNum
        };
        const res = await this.$http.post(url,data);
        if(res.data.status_code == 200){
          this.$notify({
              title: this.message.success,
              message: this.message.deleteSortSuccess,
              type: "success"
            });
          this.fetchNursProList();
          this.checkedNum = 0;
          this.$router.push({path: '/fwgl/hlxm/hlxmt/0'});
        }else{
          this.$alert(res.data.data, '', {
            confirmButtonText: this.message.confirm,
            callback: action => {
              
            }
          });
        }
      },
      showAdd(val){
        if(val === 1){
          if(this.checkedNum != 0){
            this.typeId = this.checkedNum;
            this.$store.dispatch('addHLXMTrue');
          }else{
            this.$alert(this.message.noSelectProType, '', {
              confirmButtonText: this.message.confirm,
              callback: action => {
                
              }
            });
          }
        }else{
          this.typeId = 0;
          this.$store.dispatch('addHLXMTrue');
        }
      },
      clean(){
        this.typeId = 0;
      }
    }
  };
</script>