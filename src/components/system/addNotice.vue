<template>
    <div class="addNotice">
        <div class="pop">
            <div class="pop-top">
                <h5>养老院公告</h5>
                <span class="pop-close" @click="hideEditFalse"><i class="el-icon-close"></i></span>
            </div>
            <div class="quill-editor-example">
                标题：<el-input v-model="form.title" style="width: 300px;margin-bottom: 20px"></el-input>
                <quill-editor  v-model="form.content" class="content"></quill-editor>
                <el-button @click="onSubmit" type="danger" :loading="bLoading" style="margin:20px 45%">发布</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

export default {
	data() {
		return {
			title: '',
			content: '',
			bLoading: false,
			form: {
				title: '',
				content: '',
			},
		};
	},
	components: {
		quillEditor,
	},
	methods: {
		onSubmit(formName) {
			if (this.form.title == '' || this.form.content == '') {
				this.$alert(this.message.addNotice, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.bLoading = false;
					},
				});
				return;
			} else {
				this.bLoading = true;
				var data = {
					title: this.form.title,
					content: this.form.content,
				};
				this.saveNotice(data);
			}
		},
		saveNotice: async function(data) {
			let url = this.api.addnotice;
			try {
				const res = await this.$http.post(url, data);
				if (res.data.status_code == 200) {
                    this.hideEditFalse();
                    this.$parent.$parent.fetchList();
					this.bLoading = false;
					this.form.title = "",
					this.form.content = ""
				} else {
					this.$alert(res.data.data, '', {
						confirmButtonText: this.message.confirm,
						center: true,
						callback: action => {
							this.bLoading = false;
						},
					});
				}
			} catch (error) {
				this.$alert(this.message.timeOut, '', {
					confirmButtonText: this.message.confirm,
					callback: action => {
						this.bLoading = false;
					},
				});
			}
		},
		hideEditFalse() {
			this.$parent.$parent.close();
		},
	},
};
</script>

<style scoped>
.pop {
	display: block;
	width: 800px;
	max-height: 575px;
	margin: auto;
	z-index: 130;
	border-radius: 6px;
	background-color: #fff;
	box-shadow: 0 3px 18px #999;
	overflow-y: auto;
}
.pop-top {
	border-bottom: 1px #e5e5e5 solid;
	padding: 0 20px;
	overflow: hidden;
	background: #f2f2f2;
	border-top-right-radius: 6px;
	border-top-left-radius: 6px;
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
.addNotice {
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
.quill-editor-example {
	padding: 30px;
	height: 450px;
}
.quill-editor {
	max-height: 350px;
	overflow-y: auto;
}
.content {
	height: 300px;
}
.content .ql-container {
	height: 230px;
}
</style>
