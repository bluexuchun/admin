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
                活动
            </p>
            <Row slot="extra">
                <Input v-model="keyword" icon="search" @on-change="search" placeholder="标题" style="width: 200px" />
                <Button type="primary" @click.prevent="addActivity">
                    <Icon type="plus-round"></Icon>
                    &nbsp;&nbsp;添加活动
                </Button>
            </Row>
            <Row>
                <Table :height="height" :loading="loading" border :columns="activityLists" :data="lists"></Table>
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
            loading: false,
            total: 0,
            height: 0,
            activityLists: [{
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
                key: 'id',
                width: 80,
                align: 'center'
            }, {
                title: '标题',
                key: 'title',
                width: 200
            }, {
                title: '图片',
                key: 'thumb',
                width: 70,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            trigger: "hover",
                            placement: 'left'
                        }
                    }, [h('Avatar', {
                        props: {
                            src: params.row.thumb
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
                                src: params.row.thumb,
                                height: '230px'
                            }
                        })
                    ])]);
                }
            }, {
                title: '链接(请放在公众号内，粉丝访问后将标记为已关注)',
                key: 'link',
                width: 330,
            }, {
                title: '排序',
                key: 'displayorder',
                width: 100,
                align: 'center'
            }, {
                title: '状态',
                key: 'statusText',
                width: 80,
                align: 'center',
            }, {
                title: '操作',
                key: 'action',
                width: 300,
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
                                    _this.$router.push({
                                        name: 'activity_fans_list',
                                        params: {
                                            activity_id: params.row.id,
                                            account_id: params.row.account_id,
                                            lottery_id: params.row.lottery_id
                                        }
                                    });
                                }
                            }
                        }, '统计'),
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
                                    _this.$router.push({
                                        name: 'activity_store_list',
                                        params: {
                                            activity_id: params.row.id,
                                            account_id: params.row.account_id,
                                            lottery_id: params.row.lottery_id
                                        }
                                    });
                                }
                            }
                        }, '店铺'),
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
                                    _this.$router.push({
                                        name: 'activity_edit',
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
                            on: {
                                click: () => {
                                    _this.deleteActivity(params.row.id);
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
        addActivity() {
            let _this = this;
            _this.$router.push({
                name: 'activity_edit',
                params: {
                    id: 0
                }
            });
        },
        loadList(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=activity&a=list&do=getList', {
                    token: _this.token,
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
        deleteActivity(id) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该活动?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=activity&a=list&do=delete', {
                            token: _this.token,
                            id: id
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
