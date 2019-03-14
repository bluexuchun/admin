<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">
                        <Icon type="pinpoint"></Icon>
                        站点信息
                    </p>
                    <FormItem label="中文站点名称" style="width:60%;">
                        <Input v-model="copyright.sitename_cn" />
                    </FormItem>
                    <FormItem label="英文站点名称" style="width:60%;">
                        <Input v-model="copyright.sitename_en" />
                    </FormItem>
                    <FormItem label="LOGO">
                        <div class="upload-list" style="width: 58px;height:58px;line-height: 58px;" v-if="copyright.logo">
                            <img :src="copyright.logo" width="58px" height="58px">
                            <div class="upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="viewPicture('logo')"></Icon>
                                <Icon type="ios-trash-outline" @click.native="removePicture('logo')"></Icon>
                            </div>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:58px;height:58px;line-height: 58px;" v-if="!copyright.logo">
                            <input type="file" style="display:none;" @change="_onChange($event,'logo')">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="LOGO_XS">
                        <div class="upload-list" style="width: 58px;height:58px;line-height: 58px;" v-if="copyright.logo_xs">
                            <img :src="copyright.logo_xs" width="58px" height="58px">
                            <div class="upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="viewPicture('logo_xs')"></Icon>
                                <Icon type="ios-trash-outline" @click.native="removePicture('logo_xs')"></Icon>
                            </div>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:58px;height:58px;line-height: 58px;" v-if="!copyright.logo_xs">
                            <input type="file" style="display:none;" @change="_onChange($event,'logo_xs')">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="二维码">
                        <div class="upload-list" style="width: 58px;height:58px;line-height: 58px;" v-if="copyright.qrcode">
                            <img :src="copyright.qrcode" width="58px" height="58px">
                            <div class="upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="viewPicture('qrcode')"></Icon>
                                <Icon type="ios-trash-outline" @click.native="removePicture('qrcode')"></Icon>
                            </div>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:58px;height:58px;line-height: 58px;" v-if="!copyright.qrcode">
                            <input type="file" style="display:none;" @change="_onChange($event,'qrcode')">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="小程序码">
                        <div class="upload-list" style="width: 58px;height:58px;line-height: 58px;" v-if="copyright.mina">
                            <img :src="copyright.mina" width="58px" height="58px">
                            <div class="upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="viewPicture('mina')"></Icon>
                                <Icon type="ios-trash-outline" @click.native="removePicture('mina')"></Icon>
                            </div>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:58px;height:58px;line-height: 58px;" v-if="!copyright.mina">
                            <input type="file" style="display:none;" @change="_onChange($event,'mina')">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="网站关键字" style="width:60%;">
                        <Input type="textarea" v-model="copyright.keywords" />
                        <p>网站关键字。</p>
                    </FormItem>
                    <FormItem label="网站描述" style="width:60%;">
                        <Input type="textarea" v-model="copyright.description" />
                        <p>网站描述。</p>
                    </FormItem>
                    <FormItem label="版权说明" style="width:60%;">
                        <editor id="editor1" v-model="copyright.footer"></editor>
                        <p>网站底部版权说明。</p>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">
                        <Icon type="pinpoint"></Icon>
                        其他设置
                    </p>
                    <FormItem label="顶部背景图">
                        <div class="upload-list" style="width: 58px;height:58px;line-height: 58px;" v-if="copyright.top_bg">
                            <img :src="copyright.top_bg" width="58px" height="58px">
                            <div class="upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="viewPicture('top_bg')"></Icon>
                                <Icon type="ios-trash-outline" @click.native="removePicture('top_bg')"></Icon>
                            </div>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:58px;height:58px;line-height: 58px;" v-if="!copyright.top_bg">
                            <input type="file" style="display:none;" @change="_onChange($event,'top_bg')">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="积分兑换比率" style="width:60%;">
                        <Input v-model="copyright.ratio" />
                        <p>多少积分兑换1元人民币。</p>
                    </FormItem>
                    <FormItem label="版本" style="width:60%;">
                        <Input v-model="copyright.version" />
                    </FormItem>
                    <FormItem label="联系人" style="width:60%;">
                        <Input v-model="copyright.linkman" />
                    </FormItem>
                    <FormItem label="联系QQ" style="width:60%;">
                        <Input v-model="copyright.qq" />
                    </FormItem>
                    <FormItem label="联系邮箱" style="width:60%;">
                        <Input v-model="copyright.email" />
                    </FormItem>
                    <FormItem label="客服热线" style="width:60%;">
                        <Input v-model="copyright.hotline" />
                    </FormItem>
                    <FormItem label="中文联系地址" style="width:60%;">
                        <Input v-model="copyright.address_cn" />
                    </FormItem>
                    <FormItem label="英文联系地址" style="width:60%;">
                        <Input v-model="copyright.address_en" />
                    </FormItem>
                    <FormItem label="关于我们" style="width:60%;">
                        <editor id="editor2" v-model="copyright.about"></editor>
                        <p>关于我们。</p>
                    </FormItem>
                    <FormItem label="用户协议" style="width:60%;">
                        <editor id="editor3" v-model="copyright.footer"></editor>
                        <p>用户协议。</p>
                    </FormItem>
                    <FormItem label="会员须知" style="width:60%;">
                        <editor id="editor4" v-model="copyright.vipInfo"></editor>
                        <p>VIP会员须知。</p>
                    </FormItem>
                    <FormItem label="会员升级须知" style="width:60%;">
                        <editor id="editor5" v-model="copyright.levelUpdateInfo"></editor>
                        <p>会员升级须知。</p>
                    </FormItem>
                    <FormItem v-for="(item, index) in copyright.links" :key="index" :label="'友情链接 ' + (index + 1)">
                        <Row>
                            <Col span="5">
                            <Input type="text" v-model="item.title" placeholder="链接名称"></Input>
                            </Col>
                            <Col span="5" offset="1">
                            <Input type="text" v-model="item.link" placeholder="链接URL"></Input>
                            </Col>
                            <Col span="5" offset="1">
                            <Input type="text" v-model="item.displayorder" placeholder="排序"></Input>
                            </Col>
                            <Col span="4" offset="1">
                            <Button type="ghost" @click="linkRemove(index)">删除</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Row>
                            <Col span="12">
                            <Button type="dashed" long @click="linkAdd" icon="md-add">增加</Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Card>
                <FormItem label="">
                    <Button @click="saveConfig" style="width:100px;" type="primary">提交</Button>
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
            previewUrl: '',
            visible: false,
            copyright: {
                links: []
            }
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=site&do=display', {
                    token: _this.token
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.copyright = rs.data || {
                                links: []
                            }
                            //_this.$set(_this.copyright, 'links', []);
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    console.log(response);
                    _this.$Message.error('获取数据出错');
                });
        },
        _onChange(e, type, index) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'image', e.target, function(data) {
                _this.$set(_this.copyright, type, data.url);
            });
        },
        viewPicture(type) {
            let _this = this;
            _this.previewUrl = _this.copyright[type];
            _this.visible = true;
        },
        removePicture(type) {
            let _this = this;
            _this.$set(_this.copyright, type, '');
        },
        linkAdd() {
            let _this = this;
            _this.copyright.links.push({
                title: '',
                link: ''
            });
        },
        linkRemove(index) {
            let _this = this;
            _this.copyright.links.splice(index, 1);
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=site&do=save', {
                    token: _this.token,
                    copyright: _this.copyright
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
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
    mounted: function() {
        let _this = this;
        _this.$nextTick(function() {
            _this.init();
        });
    }
};
</script>
