<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="paymentForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <FormItem label="支付账号" style="width:60%;">
                        <Input v-model="AccessKeyId"></Input>
                        <p>请填写AccessKeyId, <a href="http://www.alidayu.com/center/application/list" target="_blank">点我注册.</a></p>
                    </FormItem>
                    <FormItem label="AccessKeySecret" style="width:60%;">
                        <Input v-model="AccessKeySecret"></Input>
                        <p>请填写AccessKeySecret, 注册成功后, 请在应用管理->应用列表->设置中查看AccessKeyId 和 AccessKeySecret.</p>
                    </FormItem>
                    <FormItem label="短信签名" style="width:60%;">
                        <Input max-lenght="10" v-model="signature"></Input>
                        <p>请填写短信签名(<strong>最多10个字符</strong>).</p>
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
            AccessKeyId: '',
            AccessKeySecret: '',
            signature: ''
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=sms&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.AccessKeyId = data.data.AccessKeyId;
                        _this.AccessKeySecret = data.data.AccessKeySecret;
                        _this.signature = data.data.signature;
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
            Utils.ajax.post('api.php?entry=sys&c=system&a=sms&do=post', {
                    token: _this.token,
                    AccessKeyId: _this.AccessKeyId,
                    AccessKeySecret: _this.AccessKeySecret,
                    signature: _this.signature
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
