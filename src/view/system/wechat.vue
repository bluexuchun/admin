<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="paymentForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信H5设置</p>
                    <FormItem label="公众号名称" style="width:60%;">
                        <Input v-model="wechat_client.name"></Input>
                    </FormItem>
                    <FormItem label="微信号" style="width:60%;">
                        <Input v-model="wechat_client.account"></Input>
                    </FormItem>
                    <FormItem label="AppId" style="width:60%;">
                        <Input v-model="wechat_client.appid"></Input>
                    </FormItem>
                    <FormItem label="AppSecret" style="width:60%;">
                        <Input v-model="wechat_client.appsecret"></Input>
                    </FormItem>
                    <FormItem label="借用授权URL" style="width:60%;">
                        <Input v-model="wechat_client.host"></Input>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信授权app登陆</p>
                    <FormItem label="APP名称" style="width:60%;">
                        <Input v-model="wechat_app.name"></Input>
                    </FormItem>
                    <FormItem label="AppId" style="width:60%;">
                        <Input v-model="wechat_app.appid"></Input>
                    </FormItem>
                    <FormItem label="AppSecret" style="width:60%;">
                        <Input v-model="wechat_app.appsecret"></Input>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信授权小程序登陆</p>
                    <FormItem label="小程序名称" style="width:60%;">
                        <Input v-model="wechat_mina.name"></Input>
                    </FormItem>
                    <FormItem label="AppId" style="width:60%;">
                        <Input v-model="wechat_mina.appid"></Input>
                    </FormItem>
                    <FormItem label="AppSecret" style="width:60%;">
                        <Input v-model="wechat_mina.appsecret"></Input>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信授权网站登陆</p>
                    <FormItem label="网站名称" style="width:60%;">
                        <Input v-model="wechat_web.name"></Input>
                    </FormItem>
                    <FormItem label="AppId" style="width:60%;">
                        <Input v-model="wechat_web.appid"></Input>
                    </FormItem>
                    <FormItem label="AppSecret" style="width:60%;">
                        <Input v-model="wechat_web.appsecret"></Input>
                    </FormItem>
                </Card>
                <FormItem>
                    <Button type="primary" @click="saveConfig">保存设置</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
import Utils from '@/utils';
import store from '@/store';

export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        },
        userInfo() {
            return this.$store.state.user.userInfo
        }
    },
    data() {
        return {
            wechat_client: {},
            wechat_app: {},
            wechat_mina: {},
            wechat_web: {}
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=wechat&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.wechat_client = data.data.wechat_client;
                        _this.wechat_app = data.data.wechat_app;
                        _this.wechat_mina = data.data.wechat_mina;
                        _this.wechat_web = data.data.wechat_web;
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        saveConfig() {
            let _this = this;
            console.log(_this.upload);
            Utils.ajax.post('api.php?entry=sys&c=system&a=wechat&do=post', {
                    token: _this.token,
                    wechat_client: _this.wechat_client,
                    wechat_app: _this.wechat_app,
                    wechat_mina: _this.wechat_mina,
                    wechat_web: _this.wechat_web
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        }
    },
    mounted() {
        let _this = this;
        _this.init();
    }
};
</script>
