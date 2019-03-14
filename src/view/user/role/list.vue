<template>
    <Card>
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            用户组列表
        </p>
        <Row>
            <Col span="21">
            <Input v-model="keyword" icon="search" @on-change="search" placeholder="请输入用户组名称搜索..." style="width: 200px" />
            </Col>
            <Col span="3">
            <Button type="primary" @click="editGroup(0)">
                <Icon type="plus" />&nbsp;&nbsp;添加用户组</Button>
            </Col>
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
            return this.$store.state.user.token
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
                title: '图片',
                key: 'thumb',
                width: 70,
                align: 'center',
                render: (h, params) => {
                    return h('Avatar', {
                        props: {
                            src: params.row.thumb
                        },
                        on: {
                            click: () => {

                            }
                        }
                    });
                }
            }, {
                title: '名称',
                key: 'title'
            }, {
                title: '简介',
                key: 'description'
            }, {
                title: '操作',
                key: 'action',
                width: 250,
                align: 'center',
                render: (h, params) => {
                    let _this = this
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
                                    _this.editGroup(params.row.id)
                                }
                            }
                        }, '编辑'),
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    _this.$router.push({
                                        name: 'user_role_permission',
                                        params: {
                                            id: params.row.id
                                        }
                                    })
                                }
                            }
                        }, '权限'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    _this.remove(params.index)
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
        loadGroup(refresh) {
            let _this = this
            Utils.ajax.post('api.php?entry=sys&c=role&a=list', {
                    token: _this.token,
                    page: _this.page,
                    keyword: _this.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data.lists)) {
                            if (!refresh) {
                                _this.lists = [];
                            }
                            _this.lists.push(...rs.data.lists);
                            _this.page++;
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
            let _this = this
            _this.loading = true;
            return new Promise(resolve => {
                _this.page = page;
                _this.loadGroup(1);
                resolve();
            });
        },
        remove(index) {
            let _this = this
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该用户组?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=role&a=list&do=delete', {
                            token: _this.token,
                            id: _this.lists[index].id
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.$Message.success(rs.message);
                                _this.lists.splice(index, 1);
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
        },
        search() {
            let _this = this
            _this.lists = [];
            _this.page = 1;
            _this.loadGroup(1);
        },
        editGroup(id) {
            let _this = this
            _this.$router.push({
                name: 'user_role_edit',
                params: {
                    id: id
                }
            });
        }
    },
    mounted() {
        let _this = this
        _this.$nextTick(function() {
            let height = document.body.clientHeight - 250;
            _this.height = height;
            _this.loadGroup(1);
        })
    }
}
</script>
