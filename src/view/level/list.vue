<template>
    <Card>
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            等级列表
        </p>
        <Row slot="extra">
            <Button type="primary" @click="editProduct(0)" v-if="lists.length < 9">
                <Icon type="ios-add"></Icon>添加等级
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
                title: '等级ID',
                key: 'grade_id',
                width: 80,
                align: 'center',
            }, {
                title: '等级名称',
                key: 'grade_name',
                width: 200,
                align: 'center',
            }, {
                title: '等级Icon',
                key: 'grade_photo',
                width: 200,
                align: 'center',
                render:(h,params) => {
                    return h('div',[
                        h('Avatar',{
                            props:{
                                src:params.row.grade_photo
                            }
                        })
                    ])
                }
            }, {
                title: '等级背景图',
                key: 'grade_bg',
                width: 200,
                align: 'center',
                render:(h,params) => {
                    return h('div',[
                        h('Avatar',{
                            props:{
                                shape:"square",
                                src:params.row.grade_bg
                            },
                            style:{
                                width:'100px',
                                height:'50px',
                                objectFit:'cover'
                            }
                        })
                    ])
                }
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
                                        name: 'level_edit',
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
            Utils.ajax.post('api.php?entry=sys&c=public&a=grade&do=display', {
                    token: _this.token
                })
                .then((response) => {
                    console.log(response)
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            if (!refresh) {
                                _this.lists.push(...rs.data);
                                _this.page++;
                            } else {
                                _this.lists = [];
                                _this.lists.push(...rs.data);
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
                name: 'level_edit',
                params: {
                    id: id
                }
            });
        },
        deleteProduct(id) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该等级?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=public&a=grade&do=grade_del', {
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
