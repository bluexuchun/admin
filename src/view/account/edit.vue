<template>
    <div style="background:#fff;">
        <Form ref="accountForm" :label-width="150">
            <Tabs value="basic">
                <TabPane label="公众号设置" name="basic">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">基础信息</p>
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
                            <FormItem label="选择管理员" prop="managers" style="width:60%;">
                                <Select v-model="detail.managers" filterable clearable remote :remote-method="managerSearch" :loading="loading" multiple>
                                    <Option v-for="(option, index) in managers" :value="option.sys_uid" :label="option.realname + '-' + option.username" :key="index">{{option.realname}}-{{option.username}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="公众号名称" style="width:60%;">
                                <Input v-model="detail.name"></Input>
                                <p>填写公众号的账号名称</p>
                            </FormItem>
                            <FormItem label="微信号" style="width:60%;">
                                <Input v-model="detail.account"></Input>
                                <p>填写公众号的账号,一般为英文账号</p>
                            </FormItem>
                            <FormItem label="原始ID" style="width:60%;">
                                <Input v-model="detail.original"></Input>
                                <p>原始ID不能修改,请谨慎填写</p>
                            </FormItem>
                            <FormItem label="账号类型" prop="type" style="width:60%;">
                                <Select v-model="detail.type" filterable clearable>
                                    <Option :value="1">普通订阅号</Option>
                                    <Option :value="2">普通服务号</Option>
                                    <Option :value="3">认证订阅号</Option>
                                    <Option :value="4">认证服务号/认证媒体/政府订阅号</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="允许借用" style="width:60%;" v-if="detail.type == 4">
                                <RadioGroup v-model="detail.open">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                                <p>是否允许其他公众号借用权限</p>
                            </FormItem>
                            <FormItem label="LOGO">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="detail.logo">
                                    <template>
                                        <img :src="detail.logo">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="viewPicture('logo')"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="removePicture('logo')"></Icon>
                                        </div>
                                    </template>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!detail.logo">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'logo')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="二维码">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="detail.qrcode">
                                    <template>
                                        <img :src="detail.qrcode">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="viewPicture('qrcode')"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="removePicture('qrcode')"></Icon>
                                        </div>
                                    </template>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!detail.qrcode">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'qrcode')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="描述" style="width:60%;">
                                <Input type="textarea" :rows="5" v-model="detail.description"></Input>
                                <p>用于说明此公众号的功能及用途。</p>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">通讯信息</p>
                            <FormItem label="AppId" style="width:60%;">
                                <Input v-model="detail.appid"></Input>
                            </FormItem>
                            <FormItem label="AppSecret" style="width:60%;">
                                <Input v-model="detail.appsecret"></Input>
                            </FormItem>
                            <FormItem label="服务器地址(URL)" style="width:60%;">
                                <Input id="server" v-model="detail.server" :disabled="true" @click.native="copyToClipboard('server')"></Input>
                            </FormItem>
                            <FormItem label="令牌(Token)" style="width:60%;">
                                <Input id="token" v-model="detail.token" :disabled="true" @click.native="copyToClipboard('token')">
                                <span slot="append" @click="createToken('token')">生成新的</span>
                                </Input>
                                <p>点击“生成新的”后，记得公众号后台要随之更改</p>
                            </FormItem>
                            <FormItem label="消息加解密密钥(EncodingAESKey)" style="width:60%;">
                                <Input id="encodingaeskey" v-model="detail.encodingaeskey" :disabled="true" @click.native="copyToClipboard('encodingaeskey')">
                                <span slot="append" @click="createToken('encodingaeskey', 43)">生成新的</span>
                                </Input>
                                <p>点击“生成新的”后，记得公众号后台要随之更改</p>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">公众平台oAuth设置</p>
                            <FormItem label="选择公众号" prop="roles" style="width:60%;">
                                <Select v-model="detail.oauth_account" filterable clearable>
                                    <Option v-for="(option, index) in oauthAccounts" :value="option.id" :key="index">{{option.name}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="oAuth独立域名" style="width:60%;">
                                <Input v-model="detail.host"></Input>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">借用 JS 分享设置</p>
                            <FormItem label="选择公众号" prop="roles" style="width:60%;">
                                <Select v-model="detail.js_account" filterable clearable>
                                    <Option v-for="(option, index) in jsAccounts" :value="option.id" :key="index">{{option.name}}</Option>
                                </Select>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">上传js接口文件</p>
                            <FormItem label="js接口文件" style="width:60%;">
                                <Input type="text" :disabled="true" v-model="detail.jsfile">
                                <span slot="append">
                                    <input class="upload-file-input" type="file" @change="uploadJsFile($event)">
                                        <Icon type="ios-cloud-upload-outline" size="20"></Icon>
                                        点击上传文件
                                </span>
                                </Input>
                                <p>设置JS接口安全域名，需要上传的文件。</p>
                            </FormItem>
                        </Card>
                        <FormItem style="margin-top:30px;">
                            <Button type="primary" @click="saveConfig">保存设置</Button>
                        </FormItem>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="支付信息" name="payment">
                    <Row>
                        <Col>
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
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </Form>
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
            detail: [],
            previewUrl: '',
            visible: false,
            category: [],
            managers: [],
            oauthAccounts: [],
            jsAccounts: [],
            loading: false,
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
            Utils.ajax.post('api.php?entry=sys&c=account&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.detail = rs.data.detail;
                        _this.credit = _this.detail.credit || {};
                        _this.alipay = _this.detail.alipay || {};
                        _this.baifubao = _this.detail.baifubao || {};
                        _this.wechat_client = _this.detail.wechat_client || {};
                        _this.wechat_app = _this.detail.wechat_app || {};
                        _this.wechat_mina = _this.detail.wechat_mina || {};
                        _this.wechat_web = _this.detail.wechat_web || {};
                        _this.wechat_pem = _this.detail.wechat_pem || {};
                        _this.managers = rs.data.managers;
                        _this.oauthAccounts = rs.data.oauthAccounts;
                        _this.jsAccounts = rs.data.jsAccounts;
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
                _this.$set(_this.detail, type, data.url);
            });
        },
        viewPicture(type) {
            let _this = this;
            _this.previewUrl = _this.detail[type];
            _this.visible = true;
        },
        removePicture(type) {
            let _this = this;
            _this.$set(_this.detail, type, '');
        },
        managerSearch(query) {
            let _this = this;
            if (query !== '') {
                Utils.ajax.post('api.php?entry=sys&c=account&a=edit&do=manager_search', {
                        token: _this.token,
                        query: query
                    })
                    .then((response) => {
                        let rs = response.data;
                        if (rs.status == 1) {
                            _this.managers = rs.data;
                        } else {
                            _this.$Message.error(rs.message);
                        }
                    })
                    .catch((response) => {
                        _this.$Message.error('获取数据出错');
                    });
            } else {
                _this.managers = [];
            }
        },
        createToken(type, length = 32) {
            let _this = this;
            var letters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var token = '';
            for (var i = 0; i < length; i++) {
                var j = parseInt(Math.random() * (31 + 1));
                token += letters[j];
            }
            if (type == 'encodingaeskey') {
                _this.$set(_this.detail, 'encodingaeskey', token);
            } else if (type == 'token') {
                _this.$set(_this.detail, 'token', token);
            } else {
                _this.$set(_this[type], 'apikey', token);
            }
        },
        uploadJsFile(e) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'file', e.target, function(data) {
                _this.$set(_this.detail, 'jsfile', data.url);
            }, () => {}, 1, 'api.php?entry=sys&c=account&a=edit&do=upload_jsfile');
        },
        copyToClipboard(ele) {
            let _this = this;
            _this.$copyText(_this.detail[ele]).then(function(e) {
                console.log(e)
                _this.$Message.success("复制成功");
            }, function(e) {
                console.log(e)
                _this.$Message.error("复制失败");
            })
        },
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            Utils.ajax.post('api.php?entry=sys&c=account&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    account: _this.detail,
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
        _this.$nextTick(function() {
            _this.host = document.location.protocol + '//' + window.location.host;
            _this.init();
        });
    }
};
</script>
<style lang="less" scoped>
.upload-file-input {
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    font-size: 26px;
    width: 111px;
}
</style>
