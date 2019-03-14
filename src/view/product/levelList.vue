<template>
    <Card>
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            等级列表
        </p>
        <Row slot="extra">
            <Button type="primary" @click="editProduct(0)">
                <Icon type="ios-add"></Icon>添加任务
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
            id: this.$route.params.id,
            loading: false,
            total: 0,
            height: 0,
            columns: [{
                title: 'ID',
                key: 'id',
                width: 80,
                align: 'center',
            }, {
                title: '等级名称',
                key: 'grade_title',
                width: 200,
                align: 'center',
            }, {
                title: '等级介绍',
                key: 'description',
                width: 200,
                align: 'center',
            }, {
                title: '创建时间',
                key: 'createtime',
                width: 200,
                align: 'center'
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
                                        name: 'product_levelEdit',
                                        params: {
                                            id: params.row.id,
                                            pid: _this.id
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
                                    _this.deleteProduct(params.row.id);
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
        loadProduct(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=level&a=list&do=getList', {
                    token: _this.token,
                    page: _this.page,
                    keyword: _this.keyword,
                    id:_this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
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
                _this.loadProduct(1);
                resolve();
            });
        },
        remove(index) {
            this.lists.splice(index, 1);
        },
        search() {
            this.lists = [];
            this.page = 1;
            this.loadProduct(1);
        },
        editProduct(id) {
            let _this = this;
            _this.$router.push({
                name: 'product_levelEdit',
                params: { 
                    id:id,
                    pid:_this.id
                }
            });
        },
        deleteProduct(id) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该等级?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=level&a=list&do=delete', {
                            token: _this.token,
                            id: id
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.loadProduct(1);
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
            _this.loadProduct(1);
        })
    }
}
</script>
