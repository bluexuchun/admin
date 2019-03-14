<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                财务管理
            </p>
            <Row slot="extra" :gutter="16">
                <Col span="15">
                <Input v-model="keyword" icon="search" @on-change="search" placeholder="请输入备注搜索..." />
                </Col>
                <Col span="6">
                <Button type="primary" @click="showModal = true">
                    <Icon type="gear-a"></Icon>
                    &nbsp;&nbsp;积分操作
                </Button>
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
        <Modal v-model="showModal" title="会员积分操作" @on-ok="changeCredit" @on-cancel="showModal = false">
            <Row>
                <Col span="12">
                <Col span="8">UID:</Col>
                <Col span="16">{{uid}}</Col>
                </Col>
                <Col span="12">
                <Col span="8">昵称:</Col>
                <Col span="16">{{userInfo.nickname}}</Col>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span="12">
                <Col span="8">手机:</Col>
                <Col span="16">{{userInfo.mobile}}</Col>
                </Col>
                <Col span="12">
                <Col span="8">姓名:</Col>
                <Col span="16">{{userInfo.realname}}</Col>
                </Col>
            </Row>
            <div v-for="(row, index) in creditNames">
                <br/>
                <Row>
                    <Col span="12">
                    <Col span="8">{{row.title}}:</Col>
                    <Col span="16">
                    <RadioGroup v-model="type[index]">
                        <Radio :label="1">
                            <span>增加</span>
                        </Radio>
                        <Radio :label="2">
                            <span>减少</span>
                        </Radio>
                    </RadioGroup>
                    </Col>
                    </Col>
                    <Col span="12">
                    <Input v-model="money[index]"></Input>
                    </Col>
                </Row>
            </div>
            <br/>
            <Row>
                <Col span="4">备注:</Col>
                <Col span="20">
                <Input v-model="remark" type="textarea"></Input>
                </Col>
            </Row>
        </Modal>
    </div>
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
            uid: 0,
            userInfo: {
                profile: []
            },
            creditNames: {},
            columns: [{
                title: 'ID',
                key: 'id',
                width: 80,
                align: 'center',
            }, {
                title: '类型',
                key: 'paytypeText',
                width: 150,
                align: 'center',
            }, {
                title: '现金',
                key: 'feeText',
                width: 150,
                align: 'center',
            }, {
                title: '积分数量',
                key: 'cashText',
                width: 150,
                align: 'center',
            }, {
                title: '收支类型',
                key: 'typeText',
                width: 150,
                align: 'center',
            }, {
                title: '操作时间',
                key: 'createtimeText',
                width: 150,
                align: 'center',
            }, {
                title: '备注',
                key: 'remark',
                align: 'center',
            }, ],
            page: 1,
            lists: [],
            keyword: '',
            showModal: false,
            type: {},
            money: {},
            remark: ''
        }
    },
    methods: {
        loadUser(refresh) {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=creditManage&do=getList', {
                    token: _this.token,
                    uid: _this.uid,
                    page: _this.page,
                    keyword: _this.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data.lists)) {
                            if (!refresh) {
                                _this.lists.push(...rs.data.lists);
                                _this.page++;
                            } else {
                                _this.lists = [];
                                _this.lists.push(...rs.data.lists);
                                console.log(rs.data.lists);
                            }
                        } else {
                            _this.$Message.error('没有更多数据啦');
                        }
                        _this.total = Number(rs.data.total);
                        _this.creditNames = rs.data.creditNames;
                        _this.userInfo = rs.data.userInfo;
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
                _this.loadUser(1);
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
            _this.loadUser(1);
        },
        changeCredit() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=creditManage&do=manage', {
                    token: _this.token,
                    uid: _this.uid,
                    type: _this.type,
                    money: _this.money,
                    remark: _this.remark
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.lists = [];
                        _this.page = 1;
                        _this.loadUser(1);
                        _this.$Message.success(rs.message);
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        }
    },
    mounted() {
        let _this = this;
        _this.uid = _this.$route.params.uid;
        _this.$nextTick(function() {
            let height = document.body.clientHeight - 250;
            _this.height = height;
            _this.loadUser(1);
        })
    }
}
</script>
