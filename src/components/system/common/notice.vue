<template>
    <div class="notice">
        <div class="quill-editor-example">
            <quill-editor  v-model="form.content" class="content" style="padding: 0 100px 50px"></quill-editor>
            <el-button type="primary" @click="onSubmit" :loading="bLoading" style="margin-left: 47%;">保存</el-button>
        </div>
    </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
    data() {
        return {
            bLoading: false,
            form: {
                content: ''
            },
        }
    },
    components: {
        quillEditor
    },
    props: {
        detail: Object
    },
    watch: {
        detail(){
            this.form.content = this.detail.notice
        }
    },
    methods: {
      onSubmit(formName) {
          this.bLoading = true;
            var data = {
                notice: this.form.content
            };
            this.saveNotice(data);
      },
      saveNotice: async function(data) {
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
                this.$alert(this.message.timeOut, "", {
                confirmButtonText: this.message.confirm,
                callback: action => {
                    this.bLoading = false;
                }
                });
            }
      },
        
    }
}
</script>

<style scoped>
.notice {
    width: 100%;
    height: 100%;
}
.quill-editor-example{
    padding: 30px;
}
.quill-editor{
    max-height: 500px;
    overflow-y: auto;
}
</style>
