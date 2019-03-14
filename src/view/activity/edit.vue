<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="lotteryForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">活动信息</p>
                    <FormItem label="排序" style="width:60%;">
                        <Input v-model="detail.displayorder"></Input>
                    </FormItem>
                    <FormItem label="状态" style="width:60%;">
                        <RadioGroup v-model="detail.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">禁用</Radio>
                        </RadioGroup>
                        <p>是否显示</p>
                    </FormItem>
                    <FormItem label="选择公众号" prop="accounts" style="width:60%;">
                        <Select v-model="detail.account_id" filterable remote :remote-method="accountSearch" :loading="loading">
                            <Option v-for="(option, index) in accounts" :value="option.id" :label="option.name" :key="index">{{option.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="选择活动" prop="lotteries" style="width:60%;">
                        <Select v-model="detail.lottery_id" filterable remote :remote-method="lotterySearch" :loading="loading">
                            <Option v-for="(option, index) in lotteries" :value="option.id" :label="option.title" :key="index">{{option.title}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="虚拟人气" style="width:60%;">
                        <Input v-model="detail.virtual_total"></Input>
                        <p>增加本次活动的虚拟人气，不计入抽奖</p>
                    </FormItem>
                    <FormItem label="参与活动成功模板消息ID" style="width:60%;">
                        <Input v-model="detail.join_template"></Input>
                        <p>参与活动成功模板消息ID，OPENTM206328709</p>
                    </FormItem>
                    <FormItem label="好友助力成功模板消息ID" style="width:60%;">
                        <Input v-model="detail.help_template"></Input>
                        <p>好友助力成功模板消息ID，OPENTM413995225</p>
                    </FormItem>
                    <FormItem label="抽奖结果模板消息ID" style="width:60%;">
                        <Input v-model="detail.open_template"></Input>
                        <p>抽奖结果模板消息ID，OPENTM412546576</p>
                    </FormItem>
                </Card>
                <FormItem style="margin-top:30px;">
                    <Button type="primary" @click="saveConfig">保存设置</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
        <Modal title="图片预览" v-model="visible">
            <img :src="previewUrl" v-if="visible" style="width: 100%">
        </Modal>
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
            id: this.$route.params.id,
            detail: {},
            previewUrl: '',
            visible: false,
            accounts: [],
            lotteries: [],
            loading: false,
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=activity&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.detail = rs.data.detail;
                        _this.accounts = rs.data.accounts;
                        _this.lotteries = rs.data.lotteries;
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        _onChange(e, type, index) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'image', e.target, function(data) {
                _this.$set(_this.detail, 'thumb', data.url);
            });
        },
        viewPicture() {
            let _this = this;
            _this.previewUrl = _this.detail.thumb;
            _this.visible = true;
        },
        removePicture() {
            let _this = this;
            _this.$set(_this.detail, 'thumb', '');
        },
        accountSearch(query) {
            let _this = this;
            if (query !== '') {
                Utils.ajax.post('api.php?entry=sys&c=activity&a=edit&do=account_search', {
                        token: _this.token,
                        query: query
                    })
                    .then((response) => {
                        let rs = response.data;
                        if (rs.status == 1) {
                            _this.accounts = rs.data;
                        } else {
                            _this.$Message.error(rs.message);
                        }
                    })
                    .catch((response) => {
                        _this.$Message.error('获取数据出错');
                    });
            } else {
                _this.accounts = [];
            }
        },
        lotterySearch(query) {
            let _this = this;
            if (is.empty(_this.detail.account_id)) {
                _this.$Message.error('请先选择公众号');
                return false;
            }
            if (query !== '') {
                Utils.ajax.post('api.php?entry=sys&c=activity&a=edit&do=lottery_search', {
                        token: _this.token,
                        query: query,
                        account_id: _this.detail.account_id
                    })
                    .then((response) => {
                        let rs = response.data;
                        if (rs.status == 1) {
                            _this.lotteries = rs.data;
                        } else {
                            _this.$Message.error(rs.message);
                        }
                    })
                    .catch((response) => {
                        _this.$Message.error('获取数据出错');
                    });
            } else {
                _this.lotteries = [];
            }
        },
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            Utils.ajax.post('api.php?entry=sys&c=activity&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    activity: _this.detail
                })
                .then((response) => {
                    _this.$Spin.hide();
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.$Message.success(rs.message);
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Spin.hide();
                    _this.$Message.error('获取数据出错');
                });
        }
    },
    mounted: function() {
        let _this = this;
        //_this.$nextTick(function() {
        _this.init();
        //});
    }
};
</script>
