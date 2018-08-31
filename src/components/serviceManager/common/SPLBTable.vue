<template>
	<div class="table">
		<el-table
			v-loading="loading"
		    :data="tableData"
		    stripe
		    style="width: 100%"
		    @selection-change="handleSelectionChange">
		    <el-table-column
		      type="selection"
		      width="55">
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="食谱类别名">
		      	<template slot-scope="scope">
			        <router-link :to="{ path: '/fwgl/spgl/spgl/'+scope.row.id,query:{splbname:scope.row.name}}">
	              		{{scope.row.name}}
	            	</router-link>
		        </template>
		    </el-table-column>
		    <el-table-column
		      prop="price"
		      label="金额">
		    </el-table-column>
		    <el-table-column
		      prop="introduction"
		      label="介绍">
		    </el-table-column>
		    <el-table-column
		      prop="suitable_meals"
		      label="类别详情">
		    </el-table-column>
		    <el-table-column
		      prop="address"
		      label="操作">
		      	<template slot-scope="scope">
		          	<el-button type="text" size="small" @click="showAdd(scope.row)">修改</el-button>
		        </template>
		    </el-table-column>
		</el-table>
		<div style="margin-top: 30px;margin-left: 20px;padding-bottom: 20px;display: flex;align-items: center;justify-content: space-between;">
			<div>
				<el-button type="danger" @click="delMore">删除</el-button>
        <el-button type="success" @click="showAdd(0)">新增</el-button>
			</div>
	    </div>
	    <v-recipetype :recipeTypeId="recipeTypeId" :mealName="mealName"></v-recipetype>
	</div>
</template>

<script>
import vRecipetype from "./addRecipeType.vue";

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      recipeTypeId: 0,
      total: 0,
      last_page: 0,
      loading: false,
      mealName: []
    };
  },
  components: {
    vRecipetype
  },
  watch: {},
  mounted() {
    this.fetchList();
    this.fetchMealName();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchList: async function() {
      this.loading = true;
      let url = this.api.recipeslist;
      var data = {};
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.tableData = [];
          this.tableData = res.data.data;
          this.recipeTypeId = 0;
          this.$nextTick(function() {
            this.loading = false;
          });
        } else {
          this.loading = false;
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            callback: action => {
            }
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {
            this.loading = false;
          }
        });
      }
    },
    deleteRecipeType: async function(id) {
      let url = this.api.deletetypes;
      var data = {
        id: id
      };
      try {
        const res = await this.$http.post(url, data);
        if (res.data.status_code == 200) {
          this.$notify({
              title: this.message.success,
              message: this.message.deleteRecipeSuccess,
              type: "success"
            });
          this.fetchList(1);
        } else {
          this.$alert(res.data.data, "", {
            confirmButtonText: this.message.confirm,
            center: true,
            callback: action => {}
          });
        }
      } catch (error) {
        this.$alert(this.message.timeOut, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      }
    },
    delMore() {
      if (this.multipleSelection.length == 0) {
        this.$alert(this.message.pleaseChoiceCategory, "", {
          confirmButtonText: this.message.confirm,
          callback: action => {}
        });
      } else {
        this.$confirm(this.message.whetherDelete, "", {
          confirmButtonText: this.message.confirm,
          cancelButtonText: this.message.cancel,
          center: true
        })
          .then(() => {
            var data = [];
            let id_arr = this.multipleSelection;
            for (let k = 0; k < id_arr.length; k++) {
              let id = id_arr[k].id;
              data.push(id);
            }
            this.deleteRecipeType(data);
          })
          .catch(() => {});
      }
    },
    showAdd(scope) {
      this.$store.dispatch("recipeTypeTrue");
      if (scope != 0) {
        this.recipeTypeId = scope.id;
      } else {
        this.recipeTypeId = 0;
      }
    },
    fetchMealName: async function() {
      let url = this.api.data;
      var data = {
        group: this.data.BEADHOUSE_MEAL_NAME
      };
      const res = await this.$http.post(url, data);
      this.mealName = res.data.data;
    }
  }
};
</script>

<style scoped>
.el-button--info.is-plain:focus,
.el-button--info.is-plain:hover {
  background: #ff8777;
  border-color: #ff8777;
}
a {
  color: #ff8777;
}
</style>