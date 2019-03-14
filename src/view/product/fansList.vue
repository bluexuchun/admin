<template>
    <Card>
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            粉丝列表
        </p>
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
                title: 'UID',
                key: 'uid',
                width: 70,
                align: 'center',
            }, {
                title: '粉丝昵称',
                key: 'nickname',
                width: 200,
                align: 'center',
            }, {
                title: '粉丝头像',
                key: 'avatar',
                width: 150,
                align: 'center',
                render:(h,params) => {
                    return h('div',[
                        h('Avatar',{
                            props:{
                                src:params.row.avatar
                            }
                        })
                    ])
                }
            }, {
                title: '签到次数',
                key: 'sign',
                width: 200,
                align: 'center',
            }, {
                title: '完成任务次数',
                key: 'task_number',
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
                                        name: 'fansdetail',
                                        params: {
                                            bid: _this.id,
                                            id: params.row.uid
                                        }
                                    });
                                }
                            }
                        }, '详情')
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
            Utils.ajax.post('api.php?entry=sys&c=business&a=fans&do=fansList', {
                    token: _this.token,
                    page: _this.page,
                    bid:_this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data.record)) {
                            if (!refresh) {
                                rs.data.record.map((v,i) => {
                                    if(v.member){
                                        _this.lists.push({
                                            uid:v.uid,
                                            sign:v.sign,
                                            task_number:v.task_number,
                                            createtime:v.createtime,
                                            nickname:v.member.nickname,
                                            avatar:v.member.avatar
                                        });
                                    }
                                })
                                _this.page++;
                            } else {
                                _this.lists = [];
                                rs.data.record.map((v,i) => {
                                    if(v.member){
                                        _this.lists.push({
                                            uid:v.uid,
                                            sign:v.sign,
                                            task_number:v.task_number,
                                            createtime:v.createtime,
                                            nickname:v.member.nickname,
                                            avatar:v.member.avatar
                                        });
                                    }
                                })
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
