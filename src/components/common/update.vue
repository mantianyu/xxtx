<template>
	<div class="update" v-show="update">
		<el-container class="pop" v-loading="loading">
			<el-header style="height: auto;">
        <div class="pop-top">
          <h5>更新日志</h5>
          <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
        </div>
			</el-header>
			<el-main style="height: 88%;position: relative;">
				<el-scrollbar class="scrollbar" style="width: 100%;height: 100%;overflow-x: hidden;position: absolute;left: 0;top: 0;">
            <div class="qxz">
                <el-table
                    v-loading="loading"
                    ref="multipleTable"
                    :data="updateData"
                    stripe
                    style="width: 100%">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <p v-html="htmlDecode(scope.row.comment)"></p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="版本号"
                        prop="version">
                    </el-table-column>
                    <el-table-column
                        label="版本标题"
                        prop="title">
                    </el-table-column>
                    <el-table-column
                        label="发布日期"
                        prop="date">
                    </el-table-column>
                </el-table>
            </div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props:["updateData"],
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    
  },
  methods: {
    hideEditFalse(){
        this.$store.dispatch("updateFalse");
    },
    htmlDecode(text) {
      var temp = document.createElement("div");
      temp.innerHTML = text;
      var output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    }
  },
  computed: mapState(["update"])
};
</script>

<style scoped>
.pop {
  display: block;
  width: 690px;
  height: 420px;
  margin: auto;
  z-index: 300;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 3px 18px #999;
  position: fixed;
  top: 50%;
  margin-top: -210px;
  left: 50%;
  margin-left: -345px;
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
.update {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.divflex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.find form {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>