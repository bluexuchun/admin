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
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                粉丝
            </p>
            <Row slot="extra">
                <Input v-model="keyword" icon="search" @on-change="search" placeholder="标题" style="width: 200px" />
            </Row>
            <Row>
                <Table :height="height" :loading="loading" border :columns="fansLists" :data="lists"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="total" :current="1" @on-change="changePage"></Page>
                    </div>
                </div>
            </Row>
        </Card>
    </div>
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
            activity_id: this.$route.params.activity_id,
            account_id: this.$route.params.account_id,
            lottery_id: this.$route.params.lottery_id,
            loading: false,
            total: 0,
            height: 0,
            fansLists: [{
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
                title: '序号',
                key: 'uid',
                width: 80,
                align: 'center'
            }, {
                title: '昵称',
                key: 'nickname',
                width: 120
            }, {
                title: '头像',
                key: 'avatar',
                width: 70,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            trigger: "hover",
                            placement: 'left'
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
                title: '操作',
                key: 'action',
                width: 160,
                align: 'center',
                render: (h, params) => {
                    let _this = this;
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    _this.deleteBanner(params.row.uid);
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
        loadList(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=activity_fans&a=list&do=getList', {
                    token: _this.token,
                    activity_id: _this.activity_id,
                    account_id: _this.account_id,
                    lottery_id: _this.lottery_id,
                    page: _this.page,
                    keyword: _this.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (refresh) {
                            _this.lists = [];
                        }
                        _this.lists.push(...rs.data.lists);
                        if (!is.empty(rs.data.lists)) {
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
        search() {
            let _this = this;
            _this.lists = [];
            _this.page = 1;
            _this.loadList(1);
        },
        changePage(page) {
            let _this = this;
            _this.loading = true;
            return new Promise(resolve => {
                _this.page = page;
                _this.loadList(1);
                resolve();
            });
        },
        deleteBanner(uid) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该粉丝?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=banner&a=list&do=delete', {
                            token: _this.token,
                            uid: uid
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.lists = [];
                                _this.page = 1;
                                _this.loadList(1);
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
    },
    mounted() {
        let _this = this;
        _this.$nextTick(function() {
            let height = document.body.clientHeight - 310;
            _this.height = height;
            _this.page = 1;
            _this.loadList(1);
        })
    }
}
</script>
