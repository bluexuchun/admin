<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                规则
            </p>
            <Row slot="extra">
                <Input v-model="keyword" icon="search" @on-change="search" placeholder="标题" style="width: 200px" />
                <Button type="primary" @click.prevent="addRule">
                    <Icon type="plus-round"></Icon>
                    &nbsp;&nbsp;添加规则
                </Button>
            </Row>
            <Row>
                <Table :height="height" :loading="loading" border :columns="rulesLists" :data="lists"></Table>
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

export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            account_id: this.$route.params.account_id,
            loading: false,
            total: 0,
            height: 0,
            rulesLists: [{
                title: '序号',
                key: 'id',
                width: 80,
                align: 'center'
            }, {
                title: '规则名称',
                key: 'name',
                width: 200
            }, {
                title: '排序',
                key: 'displayorder',
                width: 100,
                align: 'center'
            }, {
                title: '类型',
                key: 'typeText',
                width: 150,
                align: 'center',
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
                                type: 'default',
                                size: 'small'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    _this.$router.push({
                                        name: 'account_rule_edit',
                                        params: {
                                            account_id: params.row.account_id,
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
                                    _this.deleteRule(params.row.id);
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
        addRule() {
            let _this = this;
            _this.$router.push({
                name: 'account_rule_edit',
                params: {
                    account_id: _this.account_id,
                    id: 0
                }
            });
        },
        loadRule(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=account_rule&a=list&do=getList', {
                    token: _this.token,
                    account_id: _this.account_id,
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
            _this.loadRule(1);
        },
        changePage(page) {
            let _this = this;
            _this.loading = true;
            return new Promise(resolve => {
                _this.page = page;
                _this.loadRule(1);
                resolve();
            });
        },
        deleteRule(id) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '<p>是否删除该规则?</p>',
                onOk: () => {
                    Utils.ajax.post('api.php?entry=sys&c=account_rule&a=list&do=delete', {
                            token: _this.token,
                            id: id,
                            account_id: _this.account_id
                        })
                        .then((response) => {
                            let rs = response.data;
                            if (rs.status == 1) {
                                _this.lists = [];
                                _this.page = 1;
                                _this.loadRule(1);
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
            _this.loadRule(1);
        })
    }
}
</script>
