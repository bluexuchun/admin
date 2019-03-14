<template>
    <div>
        <Card :bordered="false" :dis-hover="true">
            <p slot="title">权限设置</p>
            <Tree ref="tree" :data="permData" multiple></Tree>
            <Spin size="large" v-if="treeLoading"></Spin>
            <div class="btn-group">
                <Button @click="selectTreeAll">全选/反选</Button>
                <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
            </div>
        </Card>
    </div>
</template>
<script>
import Utils from '@/utils';
import store from '@/store';
import routers from '@/router/routers';
export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            id: 0,
            treeLoading: true,
            submitPermLoading: false,
            permData: [],
            selectPermList: [],
            selectAllFlag: false
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=role&a=permission&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let res = response.data;
                    if (res.status == 1) {
                        _this.checkPermTree(_this.permData, res.data.permissions);
                    } else {
                        _this.$Message.error(res.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });

        },
        getPermList() {
            let _this = this;
            _this.treeLoading = true;
            Utils.ajax.post('api.php?entry=sys&c=permission-manage&a=index&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    _this.treeLoading = false;
                    let res = response.data;
                    if (res.status == 1) {
                        _this.deleteDisableNode(res.data);
                        _this.permData = res.data;
                    } else {
                        _this.$Message.error(res.message);
                    }
                });
        },
        // 递归标记禁用节点
        deleteDisableNode(permData) {
            let that = this;
            permData.forEach(function(e) {
                if (e.status === -1) {
                    e.title = "[已禁用] " + e.title;
                    e.disabled = true;
                }
                if (e.children && e.children.length > 0) {
                    that.deleteDisableNode(e.children);
                }
            });
        },
        // 递归判断子节点
        checkPermTree(permData, rolePerms) {
            let that = this;
            permData.forEach(function(p) {
                if (that.hasPerm(p, rolePerms)) {
                    p.selected = true;
                } else {
                    p.selected = false;
                }
                if (p.children && p.children.length > 0) {
                    that.checkPermTree(p.children, rolePerms);
                }
            });
        },
        // 判断角色拥有的权限节点勾选
        hasPerm(p, rolePerms) {
            let flag = false;
            for (let i = 0; i < rolePerms.length; i++) {
                if (p.id === rolePerms[i].id) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                return true;
            }
            return false;
        },
        // 全选反选
        selectTreeAll() {
            this.selectAllFlag = !this.selectAllFlag;
            let select = this.selectAllFlag;
            this.selectedTreeAll(this.permData, select);
        },
        // 递归全选节点
        selectedTreeAll(permData, select) {
            let that = this;
            permData.forEach(function(e) {
                e.selected = select;
                if (e.children && e.children.length > 0) {
                    that.selectedTreeAll(e.children, select);
                }
            });
        },
        submitPermEdit() {
            let _this = this;
            _this.submitPermLoading = true;
            let permIds = "";
            let selectedNodes = _this.$refs.tree.getSelectedNodes();
            selectedNodes.forEach(function(e) {
                permIds += e.id + ",";
            });
            permIds = permIds.substring(0, permIds.length - 1);
            Utils.ajax.post('api.php?entry=sys&c=role&a=permission&do=edit', {
                    token: _this.token,
                    id: _this.id,
                    permIds: permIds
                })
                .then((response) => {
                    _this.submitPermLoading = false;
                    let data = response.data;
                    if (data.status == 1) {
                        Utils.updateUserInfo();
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.submitPermLoading = false;
                    _this.$Message.error('获取数据出错');
                });
        }
    },
    mounted() {
        let _this = this
        _this.$nextTick(async function() {
            _this.id = _this.$route.params.id;
            await _this.getPermList();
            await _this.init();
        });
    }
};
</script>
