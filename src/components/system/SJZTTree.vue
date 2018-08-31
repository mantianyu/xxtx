<template>
    <div style="margin-left: 30px;margin-top: 30px;">
        <el-tree
                :props="props"
                :load="loadNode"
                lazy
                accordion
                @node-click="handleNodeClick">
        </el-tree>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                props: {
                    label: 'name',
                    children: 'zones'
                },
            };
        },
        methods: {
            handleNodeClick(data) {
                this.$router.push({path: `/xtgl/sjzd/sjzdt/` + data.id, query:{ canAdd: data.can_add }});
            },
            loadNode: async function (node, resolve) {
                if (node.level === 0) {
                    let url = this.api.gettreelist;
                    var data = {
                        'parent': 0
                    }
                    const res = await this.$http.post(url, data);
                    let first = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        var data = {
                            'id': res.data.data[i].id,
                            'name': res.data.data[i].name,
                        }
                        first.push(data);
                    }
                    return resolve(first);
                }

                if (node.level > 1) return resolve([]);

                if (node.level === 1) {
                    var fid = node.data.id;
                    let url = this.api.gettreelist;
                    var data = {
                        'parent': fid
                    }
                    const res = await this.$http.post(url, data);
                    let second = [];
                    for (let i = 0; i < res.data.data.length; i++) {
                        var data = {
                            'id': res.data.data[i].id,
                            'name': res.data.data[i].name,
                            'can_add': res.data.data[i].can_add,
                        }
                        second.push(data);
                    }
                    return resolve(second);
                }
            }
        }
    };
</script>