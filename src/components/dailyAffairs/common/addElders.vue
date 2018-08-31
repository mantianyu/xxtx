<template>
  <div class="addElders" v-if="addElders">
		<el-container class="pop">
			<el-header style="height: auto;">
          <div class="pop-top">
              <h5>添加老人</h5>
              <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
          </div>
			</el-header>
			<el-main style="height: 87%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
          <div class="qxz">
            <el-tree
              :props="props"
              :load="loadNode"
              node-key="id"
              ref="tree"
              lazy
              show-checkbox
              @check-change="handleCheckChange">
            </el-tree>
            <div class="login-btn" style="margin-top: 20px;display: flex;align-items:center;justify-content:center;border-top: 1px #E5E5E5 solid;padding-top: 28px;">
              <el-button type="info" size="medium" @click="hideEditFalse">取消</el-button>
                <el-button type="danger" size="medium" style="margin-left: 30px;" @click="getCheckedKeys">确认</el-button>
            </div>
          </div>
				</el-scrollbar>
			</el-main>
		</el-container>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props:['builds'],
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones'
        },
        floors: [],
        rooms: [],
        beds: [],
        join:{
          'build': [],
          'floor': [],
          'room': [],
          'elder':[]
        }
      };
    },
    mounted(){
      
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        if(data.type == 1){
          if(checked){
            this.join.build.push(data.id)
          }else{
            var arr = [];
            for(let i = 0; i < this.join.build.length; i++){
              if(this.join.build[i] != data.id){
                arr.push(this.join.build[i]);
              }
            }
            this.join.build = arr;
          }
        }
        if(data.type == 2){
          if(checked){
            this.join.floor.push(data.id)
          }else{
            var arr = [];
            for(let i = 0; i < this.join.floor.length; i++){
              if(this.join.floor[i] != data.id){
                arr.push(this.join.floor[i]);
              }
            }
            this.join.floor = arr;
          }
        }
        if(data.type == 3){
          if(checked){
            this.join.room.push(data.id)
          }else{
            var arr = [];
            for(let i = 0; i < this.join.room.length; i++){
              if(this.join.room[i] != data.id){
                arr.push(this.join.room[i]);
              }
            }
            this.join.room = arr;
          }
        }
        if(!data.type){
          if(checked){
            this.join.elder.push(data.id)
          }else{
            var arr = [];
            for(let i = 0; i < this.join.elder.length; i++){
              if(this.join.elder[i] != data.id){
                arr.push(this.join.elder[i]);
              }
            }
            this.join.elder = arr;
          }
        }
      },
      getCheckedKeys: async function() {
        let url = this.api.careactivitieselder;
        var data = {
          'elders': this.join
        }
        const res = await this.$http.post(url,data);
        this.$parent.getJoin(res.data.data);
        this.hideEditFalse();
      },
      loadNode: async function(node, resolve) {
        if (node.level === 0) {
          let builds = [];
          for(let i = 0; i < this.builds.length; i++){
            var build = {
              'id': this.builds[i].buildingid,
              'name': this.builds[i].buildingname,
              'type': 1
            }
            builds.push(build);
          }
          return resolve(builds);
        }
        if (node.level === 1){
          var bid = node.data.id;
          let url = this.api.floorcodelist;
          var data = {
            'lid': bid
          };
          const res = await this.$http.post(url,data);
          this.floors = res.data.data;
          this.$nextTick(function(){
            var data = [];
            for(let i = 0; i < this.floors.length; i++){
              var floor = {
                'id': this.floors[i].floorid,
                'name': this.floors[i].floorname,
                'type': 2
              }
              data.push(floor);
            }
            return resolve(data);
          });
        }
        if (node.level === 2){
          var fid = node.data.id;
          let url = this.api.roomcodelist;
          var data = {
            'fid': fid
          };
          const res = await this.$http.post(url,data);
          this.rooms = res.data.data;
          this.$nextTick(function(){
            var data = [];
            for(let i = 0; i < this.rooms.length; i++){
              var room = {
                'id': this.rooms[i].roomid,
                'name': this.rooms[i].roomname,
                'type': 3
              }
              data.push(room);
            }
            return resolve(data);
          });
        }
        if (node.level === 3){
          var rid = node.data.id;
          let url = this.api.bedcodelist;
          var data = {
            'rid': rid,
            'type_id': 1
          };
          const res = await this.$http.post(url,data);
          this.beds = res.data.data;
          this.$nextTick(function(){
            var data = [];
            for(let i = 0; i < this.beds.length; i++){
              if(this.beds[i].elder_id != ''){
                var bed = {
                  'id': this.beds[i].elder_id,
                  'name': this.beds[i].elder_name
                }
                data.push(bed);
              }
            }
            return resolve(data);
          });
        }
        if (node.level > 3){
            return resolve([]);
        }
      },
      hideEditFalse(){
        this.$store.dispatch('addEldersFalse');
        this.join = {
          'build': [],
          'floor': [],
          'room': [],
          'elder':[]
        };
      }
    },
    computed: mapState([
        'addElders'
    ]),
  };
</script>

<style scoped>
.pop {
  display: block;
  width: 260px;
  height: 420px;
  margin: auto;
  z-index: 130;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -210px;
  left: 50%;
  margin-left: -130px;
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
  .addElders{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.2);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .divflex{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>