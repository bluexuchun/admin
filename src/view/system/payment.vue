<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="paymentForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">余额优先支付设置</p>
                    <FormItem label="余额支付" style="width:60%;">
                        <RadioGroup v-model="credit.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否优先使用用户的余额进行支付</p>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">支付宝无线支付设置</p>
                    <FormItem label="支付宝无线支付" style="width:60%;">
                        <Row>
                            <Col>您的支付宝账号必须支持手机网页即时到账接口, 才能使用手机支付功能, <a href="https://b.alipay.com/order/productDetail.htm?productId=2013080604609688" target="_blank">申请及详情请查看这里</a>.</Col>
                        </Row>
                        <RadioGroup v-model="alipay.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用支付宝无线支付</p>
                    </FormItem>
                    <div v-if="alipay.switch == 1">
                        <FormItem label="收款支付宝账号" style="width:60%;">
                            <Input v-model="alipay.account"></Input>
                            <p>如果开启兑换或交易功能，请填写真实有效的支付宝账号，用于收取用户以现金兑换交易积分的相关款项。如账号无效或安全码有误，将导致用户支付后无法正确对其积分账户自动充值，或进行正常的交易对其积分账户自动充值，或进行正常的交易。 如您没有支付宝帐号，<a href="https://memberprod.alipay.com/account/reg/enterpriseIndex.htm" target="_blank">请点击这里注册</a></p>
                        </FormItem>
                        <FormItem label="合作者身份" style="width:60%;">
                            <Input v-model="alipay.partner"></Input>
                            <p>支付宝签约用户请在此处填写支付宝分配给您的合作者身份，签约用户的手续费按照您与支付宝官方的签约协议为准。
                                <br>如果您还未签约，<a href="https://memberprod.alipay.com/account/reg/enterpriseIndex.htm" target="_blank">请点击这里签约</a>；如果已签约,<a href="https://b.alipay.com/order/pidKey.htm?pid=2088501719138773&amp;product=fastpay" target="_blank">请点击这里获取PID、Key</a>;如果在签约时出现合同模板冲突，请咨询0571-88158090</p>
                        </FormItem>
                        <FormItem label="校验密钥" style="width:60%;">
                            <Input v-model="alipay.secret"></Input>
                            <p>支付宝签约用户可以在此处填写支付宝分配给您的交易安全校验码，此校验码您可以到支付宝官方的商家服务功能处查看</p>
                        </FormItem>
                    </div>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">百付宝支付设置</p>
                    <FormItem label="百付宝支付" style="width:60%;">
                        <RadioGroup v-model="baifubao.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用百付宝支付</p>
                    </FormItem>
                    <div v-if="baifubao.switch == 1">
                        <FormItem label="商户号" style="width:60%;">
                            <Input v-model="baifubao.mchid"></Input>
                        </FormItem>
                        <FormItem label="商户支付密钥" style="width:60%;">
                            <Input v-model="baifubao.signkey"></Input>
                        </FormItem>
                    </div>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信公众号支付设置</p>
                    <FormItem label="微信公众号支付" style="width:60%;">
                        <Row>
                            <Col>你必须向微信公众平台提交企业信息以及银行账户资料，审核通过并签约后才能使用微信支付功能 <a href="https://mp.weixin.qq.com/paymch/readtemplate?t=mp/business/faq_tmpl" target="_blank">申请及详情请查看这里</a>.</Col>
                            <Col>
                            <p>注意你的php后台访问地址一定不要写错了，这里我们用访问地址代替下面说明中出现的链接，申请微信支付的接口说明如下：</p>
                            <br>
                            <h4>JS API网页支付参数</h4>
                            <p>支付授权目录: {{host}}/payment/wechat/</p>
                            <p>共享收货地址: 选择"是"</p>
                            </Col>
                        </Row>
                        <RadioGroup v-model="wechat_client.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用微信公众号支付</p>
                    </FormItem>
                    <div v-if="wechat_client.switch == 1">
                        <FormItem label="支付账号" style="width:60%;">
                            <Input v-model="wechat_client.account"></Input>
                        </FormItem>
                        <FormItem label="身份标识(appid)" style="width:60%;">
                            <Input v-model="wechat_client.appid"></Input>
                        </FormItem>
                        <FormItem label="身份密钥(appsecret)" style="width:60%;">
                            <Input v-model="wechat_client.appsecret"></Input>
                        </FormItem>
                        <FormItem label="微信支付商户号(MchId)" style="width:60%;">
                            <Input v-model="wechat_client.mchid"></Input>
                            <p>公众号支付请求中用于加密的密钥Key</p>
                        </FormItem>
                        <FormItem label="商户支付密钥(API密钥)" style="width:60%;">
                            <Input v-model="wechat_client.apikey">
                            <span slot="append" @click="createToken('wechat_client')">生成新的</span>
                            </Input>
                            <p>此值需要手动在腾讯商户后台API密钥保持一致</p>
                        </FormItem>
                    </div>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">APP微信支付设置</p>
                    <FormItem label="APP微信支付" style="width:60%;">
                        <Row>
                            <Col>你必须向微信公众平台提交企业信息以及银行账户资料，审核通过并签约后才能使用APP微信支付功能 <a href="https://mp.weixin.qq.com/paymch/readtemplate?t=mp/business/faq_tmpl" target="_blank">申请及详情请查看这里</a>.</Col>
                        </Row>
                        <RadioGroup v-model="wechat_app.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用APP微信支付</p>
                    </FormItem>
                    <div v-if="wechat_app.switch == 1">
                        <FormItem label="身份标识(appid)" style="width:60%;">
                            <Input v-model="wechat_app.appid"></Input>
                        </FormItem>
                        <FormItem label="身份密钥(appsecret)" style="width:60%;">
                            <Input v-model="wechat_app.appsecret"></Input>
                        </FormItem>
                        <FormItem label="APP微信支付商户号(MchId)" style="width:60%;">
                            <Input v-model="wechat_app.mchid"></Input>
                            <p>APP微信支付请求中用于加密的密钥Key</p>
                        </FormItem>
                        <FormItem label="商户支付密钥(API密钥)" style="width:60%;">
                            <Input v-model="wechat_app.apikey">
                            <span slot="append" @click="createToken('wechat_app')">生成新的</span>
                            </Input>
                            <p>此值需要手动在腾讯商户后台API密钥保持一致</p>
                        </FormItem>
                    </div>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信小程序支付设置</p>
                    <FormItem label="微信小程序支付" style="width:60%;">
                        <Row>
                            <Col>你必须向微信公众平台提交企业信息以及银行账户资料，审核通过并签约后才能使用微信小程序支付功能 <a href="https://mp.weixin.qq.com/paymch/readtemplate?t=mp/business/faq_tmpl" target="_blank">申请及详情请查看这里</a>.</Col>
                        </Row>
                        <RadioGroup v-model="wechat_mina.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用微信小程序支付</p>
                    </FormItem>
                    <div v-if="wechat_mina.switch == 1">
                        <FormItem label="身份标识(appid)" style="width:60%;">
                            <Input v-model="wechat_mina.appid"></Input>
                        </FormItem>
                        <FormItem label="身份密钥(appsecret)" style="width:60%;">
                            <Input v-model="wechat_mina.appsecret"></Input>
                        </FormItem>
                        <FormItem label="微信小程序支付商户号(MchId)" style="width:60%;">
                            <Input v-model="wechat_mina.mchid"></Input>
                            <p>微信小程序支付请求中用于加密的密钥Key</p>
                        </FormItem>
                        <FormItem label="商户支付密钥(API密钥)" style="width:60%;">
                            <Input v-model="wechat_mina.apikey">
                            <span slot="append" @click="createToken('wechat_mina')">生成新的</span>
                            </Input>
                            <p>此值需要手动在腾讯商户后台API密钥保持一致</p>
                        </FormItem>
                    </div>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信扫码支付设置</p>
                    <FormItem label="微信扫码支付" style="width:60%;">
                        <Row>
                            <Col>你必须向微信公众平台提交企业信息以及银行账户资料，审核通过并签约后才能使用微信扫码支付功能 <a href="https://mp.weixin.qq.com/paymch/readtemplate?t=mp/business/faq_tmpl" target="_blank">申请及详情请查看这里</a>.</Col>
                            <Col>
                            <br>
                            <h4>JS API网页扫码支付参数</h4>
                            <p>扫码回调链接: {{host}}/payment/wechat/notify.php</p>
                            </Col>
                        </Row>
                        <RadioGroup v-model="wechat_web.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用微信扫码支付</p>
                    </FormItem>
                    <div v-if="wechat_web.switch == 1">
                        <FormItem label="身份标识(appid)" style="width:60%;">
                            <Input v-model="wechat_web.appid"></Input>
                        </FormItem>
                        <FormItem label="身份密钥(appsecret)" style="width:60%;">
                            <Input v-model="wechat_web.appsecret"></Input>
                        </FormItem>
                        <FormItem label="微信扫码支付商户号(MchId)" style="width:60%;">
                            <Input v-model="wechat_web.mchid"></Input>
                            <p>微信扫码支付请求中用于加密的密钥Key</p>
                        </FormItem>
                        <FormItem label="商户支付密钥(API密钥)" style="width:60%;">
                            <Input v-model="wechat_web.apikey">
                            <span slot="append" @click="createToken('wechat_web')">生成新的</span>
                            </Input>
                            <p>此值需要手动在腾讯商户后台API密钥保持一致</p>
                        </FormItem>
                    </div>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">微信支付PEM设置</p>
                    <FormItem label="微信支付PEM" style="width:60%;">
                        <RadioGroup v-model="wechat_pem.switch">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                        <p>是否使用微信支付PEM证书(请确保data目录必须是可写的,否则上传不成功)</p>
                    </FormItem>
                    <div v-if="wechat_pem.switch == 1">
                        <FormItem label="CERT证书(pem格式)" style="width:60%;">
                            <Input type="textarea" v-model="wechat_pem.signcert"></Input>
                            <p>下载证书 cert.zip 中的 apiclient_cert.pem。</p>
                        </FormItem>
                        <FormItem label="KEY证书(pem格式)" style="width:60%;">
                            <Input type="textarea" v-model="wechat_pem.signkey"></Input>
                            <p>下载证书 cert.zip 中的 apiclient_key.pem。</p>
                        </FormItem>
                    </div>
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
            host: '',
            delivery: {
                switch: 0
            },
            credit: {
                switch: 0
            },
            alipay: {
                switch: 0
            },
            baifubao: {
                switch: 0
            },
            wechat_client: {
                switch: 0
            },
            wechat_app: {
                switch: 0
            },
            wechat_mina: {
                switch: 0
            },
            wechat_web: {
                switch: 0
            },
            wechat_pem: {
                switch: 0
            }
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=payment&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.credit = data.data.credit || {};
                        _this.alipay = data.data.alipay || {};
                        _this.baifubao = data.data.baifubao || {};
                        _this.wechat_client = data.data.wechat_client || {};
                        _this.wechat_app = data.data.wechat_app || {};
                        _this.wechat_mina = data.data.wechat_mina || {};
                        _this.wechat_web = data.data.wechat_web || {};
                        _this.wechat_pem = data.data.wechat_pem || {};
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        createToken(type) {
            let _this = this;
            var letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var token = '';
            for (var i = 0; i < 32; i++) {
                var j = parseInt(Math.random() * (31 + 1));
                token += letters[j];
            }
            _this.$set(_this[type], 'apikey', token);
        },
        saveConfig() {
            let _this = this;
            console.log(_this.upload);
            Utils.ajax.post('api.php?entry=sys&c=system&a=payment&do=post', {
                    token: _this.token,
                    delivery: _this.delivery,
                    credit: _this.credit,
                    alipay: _this.alipay,
                    baifubao: _this.baifubao,
                    wechat_client: _this.wechat_client,
                    wechat_app: _this.wechat_app,
                    wechat_mina: _this.wechat_mina,
                    wechat_web: _this.wechat_web,
                    wechat_pem: _this.wechat_pem
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
        _this.host = document.location.protocol + '//' + window.location.host;
        _this.init();
    }
};
</script>
