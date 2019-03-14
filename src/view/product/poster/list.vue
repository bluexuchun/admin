<style lang="less" scope>
@import '../../../assets/less/common.less';
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                海报
            </p>
            <Row slot="extra">
                <Button type="primary" @click.prevent="addPoster">
                    <Icon type="plus-round"></Icon>
                    &nbsp;&nbsp;添加新海报
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
    </div>
</template>
<script>
import Utils from '@/utils';
import is from 'is';
import store from '@/store';
let listVue;
export default {
    computed: {
        token() {
            return this.$store.state.app.token;
        }
    },
    data() {
        return {
            id: this.$route.params.id,
            loading: false,
            total: 0,
            height: 0,
            columns: [{
                title: '序号',
                key: 'id',
                width: 80,
                align: 'center'
            }, {
                title: '海报',
                key: 'poster',
                width: 70,
                align: 'center',
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            trigger: "hover",
                            placement: 'right'
                        }
                    }, [h('Avatar', {
                        props: {
                            src: params.row.poster
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
                                src: params.row.poster,
                                height: '230px'
                            }
                        })
                    ])]);
                }
            }, {
                title: '状态',
                key: 'status',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    let text = params.row.status == 1 ? '已选用' : '未选用';
                    return h('span', {
                        style: {
                            color: params.row.status == 1 ? 'red' : ''
                        },
                    }, text);
                }
            }, {
                title: '创建时间',
                key: 'createtimeText',
                width: 135,
                align: 'center',
            }, {
                title: '操作',
                key: 'action',
                width: 200,
                align: 'center',
                render: (h, params) => {
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
                                    listVue.$router.push({
                                        name: 'posterEdit',
                                        params: {
                                            id: params.row.id,
                                            gid: params.row.gid
                                        }
                                    });
                                }
                            }
                        }, '编辑'),
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
                                    listVue.selectPoster(params.row.id);
                                }
                            }
                        }, '选用'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    listVue.deletePoster(params.row.id);
                                }
                            }
                        }, '删除')
                    ]);
                }
            }],
            page: 1,
            lists: [],
            total: 0,
            keyword: ''
        }
    },
    created() {
        listVue = this;
    },
    methods: {
        addPoster() {
            listVue.$router.push({
                name: 'posterEdit',
                params: {
                    id: 0,
                    gid: listVue.id
                }
            });
        },
        loadPoster(refresh) {
            Utils.ajax.post('api.php?entry=sys&c=poster&a=list&do=getList', {
                    token: listVue.token,
                    id: listVue.id,
                    page: listVue.page,
                    keyword: listVue.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data.lists)) {
                            if (!refresh) {
                                listVue.lists.push(...rs.data.lists);
                                listVue.page++;
                            } else {
                                listVue.lists = [];
                                listVue.lists.push(...rs.data.lists);
                            }
                        }
                        listVue.total = Number(rs.data.total);
                        listVue.loading = false;
                    } else {
                        listVue.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    listVue.$Message.error('获取数据出错');
                });
        },
        search() {
            listVue.lists = [];
            listVue.page = 1;
            listVue.loadPoster(1);
        },
        changePage(page) {
            listVue.loading = true;
            return new Promise(resolve => {
                listVue.page = page;
                listVue.loadPoster(1);
                resolve();
            });
        },
        deletePoster(id) {
            listVue.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该海报?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=poster&a=list&do=delete', {
                            token: listVue.token,
                            id: id
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                listVue.loadPoster(1);
                                listVue.$Message.success(rs.message);
                            } else {
                                listVue.$Message.error(rs.message);
                            }
                        })
                        .catch((response) => {
                            listVue.$Message.error('获取数据出错');
                        });
                },
                onCancel: () => {

                }
            });
        },
        selectPoster(id) {
            listVue.$Modal.confirm({
                title: '提示',
                content: '<p>是否选用该海报?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=poster&a=list&do=select', {
                            token: listVue.token,
                            id: id,
                            gid: listVue.id
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                listVue.loadPoster(1);
                                listVue.$Message.success(rs.message);
                            } else {
                                listVue.$Message.error(rs.message);
                            }
                        })
                        .catch((response) => {
                            listVue.$Message.error('获取数据出错');
                        });
                },
                onCancel: () => {

                }
            });
        },
    },
    mounted() {
        listVue.$nextTick(function() {
            let height = document.body.clientHeight - 310;
            this.height = height;
            listVue.page = 1;
            listVue.loadPoster(1);
        })
    }
}
</script>
