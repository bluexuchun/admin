<style>
.ivu-table .ivu-table-expanded-cell {
    padding: 0;
    background-color: #fff;
    border: 0;
}

.ivu-table .ivu-table-expanded-cell .ivu-table-wrapper {
    border: 0;
}
</style>
<template>
    <Card>
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            角色列表
        </p>
        <Row slot="extra">
            <Input v-model="keyword" icon="search" @on-change="search" placeholder="角色名称" style="width: 200px" />
            <Button type="primary" @click="editRole(0)" v-has="'add'">
                <Icon type="plus"></Icon>
                &nbsp;&nbsp;添加角色
            </Button>
        </Row>
        <Row class="margin-top-10 searchable-table-con1">
            <Table :height="height" :loading="loading" border :columns="columns" :data="lists"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="1" @on-change="changePage"></Page>
                </div>
            </div>
        </Row>
    </Card>
</template>
<script>
import Utils from '@/utils';
import is from 'is';
import store from '@/store';
export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            loading: false,
            total: 0,
            height: 0,
            columns: [{
                title: 'ID',
                key: 'id',
                width: 80,
                align: 'center',
            }, {
                title: '名称',
                key: 'title',
                width: 200,
                align: 'center',
            }, {
                title: '排序',
                key: 'displayorder',
                width: 200,
                align: 'center',
            }, {
                title: '操作',
                key: 'action',
                width: 200,
                align: 'center',
                render: (h, params) => {
                    let _this = this;
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'default',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    console.log(params);
                                    _this.$router.push({
                                        name: 'mc_member_role_edit',
                                        params: {
                                            id: params.row.id
                                        }
                                    });
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    _this.deleteRole(params.row.id);
                                }
                            }
                        }, '删除')
                    ]);
                }
            }],
            page: 1,
            lists: [],
            keyword: ''
        }
    },
    methods: {
        init() {

        },
        loadRole(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=role&do=getList', {
                    token: _this.token,
                    page: _this.page,
                    keyword: _this.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        console.log(rs);
                        if (!is.empty(rs.data.lists)) {
                            if (!refresh) {
                                _this.lists.push(...rs.data.lists);
                                _this.page++;
                            } else {
                                _this.lists = [];
                                _this.lists.push(...rs.data.lists);
                            }
                        }
                        _this.total = Number(rs.data.total);
                        _this.loading = false;
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        changePage(page) {
            let _this = this;
            _this.loading = true;
            return new Promise(resolve => {
                _this.page = page;
                _this.loadRole(1);
                resolve();
            });
        },
        remove(index) {
            let _this = this;
            _this.lists.splice(index, 1);
        },
        search() {
            let _this = this;
            _this.lists = [];
            _this.page = 1;
            _this.loadRole(1);
        },
        editRole(id) {
            let _this = this;
            _this.$router.push({
                name: 'mc_member_role_edit',
                params: {
                    id: id
                }
            });
        },
        deleteRole(id) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该角色?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=mc_member&a=role&do=delete', {
                            token: _this.token,
                            id: id
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.loadRole(1);
                                _this.$Message.success(rs.message);
                            } else {
                                _this.$Message.error(rs.message);
                            }
                        })
                        .catch((response) => {
                            _this.$Message.error('获取数据出错');
                        });
                },
                onCancel: () => {

                }
            });

        }
    },
    mounted() {
        let _this = this;
        _this.$nextTick(function() {
            let height = document.body.clientHeight - 310;
            _this.height = height;
            _this.init();
            _this.page = 1;
            _this.loadRole(1);
        })
    }
}
</script>
