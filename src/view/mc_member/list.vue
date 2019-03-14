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
            用户列表
        </p>
        <Row slot="extra">
            <Col>
            <Input v-model="keyword" icon="search" @on-change="search" placeholder="手机号码/邮箱/姓名/昵称" style="width: 200px" />
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
import expand from './list-expand.vue';
export default {
    components: {
        expand
    },
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
                title: '',
                type: 'expand',
                width: 30,
                render: (h, params) => {
                    let childrenArray = [];
                    childrenArray.push(params.row);
                    return h(expand, {
                        props: {
                            children: childrenArray
                        }
                    })
                }
            }, {
                title: 'ID',
                key: 'uid',
                width: 80,
                align: 'center',
            }, {
                title: '头像',
                key: 'avatar',
                width: 70,
                align: 'center',
                render: (h, params) => {
                    let _this = this;
                    return h('Poptip', {
                        props: {
                            trigger: "hover",
                            placement: 'right'
                        }
                    }, [h('Avatar', {
                        props: {
                            src: params.row.avatar
                        },
                        on: {
                            click: () => {

                            }
                        }
                    }), h('div', {
                        slot: 'content'
                    }, [
                        h('img', {
                            attrs: {
                                src: params.row.avatar,
                                height: '230px'
                            }
                        })
                    ])]);
                }
            }, {
                title: '昵称',
                key: 'nickname',
                width: 100,
                align: 'center',
            }, {
                title: '姓名',
                key: 'realname',
                width: 100,
                align: 'center',
            }, {
                title: '手机',
                key: 'mobile',
                width: 112,
                align: 'center',
            }, {
                title: '性别',
                key: 'gender',
                width: 70,
                align: 'center',
                render: (h, params) => {
                    return params.row.profile.genderText
                }
            }, {
                title: '黑名单',
                key: 'black',
                width: 90,
                align: 'center',
                render: (h, params) => {
                    if (params.row.black == 1) {
                        return h('div', {
                            style: {
                                color: 'red'
                            }
                        }, '是');
                    } else {
                        return '否';
                    }
                }
            }, {
                title: '注册时间',
                key: 'createtimeText',
                width: 135,
                align: 'center',
            }],
            page: 1,
            lists: [],
            keyword: ''
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=list&do=display', {
                    token: _this.token
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        for (let i in rs.data) {
                            _this.columns.push({
                                title: rs.data[i].title,
                                key: i,
                                width: 80,
                                align: 'center',
                            });
                        }
                        _this.columns.push({
                            title: '操作',
                            key: 'action',
                            width: 220,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
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
                                                _this.blackMember(params.row.uid);
                                            }
                                        }
                                    }, '拉黑'),
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
                                                    name: 'mc_member_edit',
                                                    params: {
                                                        uid: params.row.uid
                                                    }
                                                });
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
                                                    name: 'mc_member_credit_manage',
                                                    params: {
                                                        uid: params.row.uid
                                                    }
                                                });
                                            }
                                        }
                                    }, '财务'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                _this.deleteMember(params.row.uid);
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        });
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        loadMember(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=list&do=getList', {
                    token: _this.token,
                    page: _this.page,
                    keyword: _this.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data.lists)) {
                            if (refresh) {
                                _this.lists = [];
                            }

                            _this.lists.push(...rs.data.lists);

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
                _this.loadMember(1);
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
            _this.loadMember(1);
        },
        blackMember(uid) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否修改该用户黑名单状态?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=mc_member&a=list&do=black', {
                            token: _this.token,
                            uid: uid
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.loadMember(1);
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

        },
        deleteMember(uid) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该用户?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=mc_member&a=list&do=delete', {
                            token: _this.token,
                            uid: uid
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.loadMember(1);
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
            _this.loadMember(1);
        })
    }
}
</script>
