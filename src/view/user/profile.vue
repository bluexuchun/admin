<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form ref="userInfo" :model="userInfo" :label-width="100" label-position="right" :rules="inforValidate">
                    <FormItem label="用户名：">
                        <span>{{ userInfo.username }}</span>
                    </FormItem>
                    <FormItem label="姓名：" prop="realname">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="userInfo.realname"></Input>
                        </div>
                    </FormItem>
                    <FormItem label="头像">
                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="userInfo.avatar">
                            <template>
                                <img :src="userInfo.avatar">
                                <div class="upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="viewPicture"></Icon>
                                    <Icon type="ios-trash" @click.native="removePicture"></Icon>
                                </div>
                            </template>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!userInfo.avatar">
                            <input type="file" style="display:none;" @change="_onChange($event)">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="用户手机：" prop="mobile">
                        <div style="display:inline-block;width:204px;">
                            <Input v-model="userInfo.mobile" @on-keydown="hasChangeMobile"></Input>
                        </div>
                        <Button @click="getCaptcha" :disabled="canGetCaptcha" style="display: inline-block;margin-left: 10px;">{{ gettingCaptchaBtnContent }}</Button>
                        <div style="margin-top: 10px;">
                            <div class="own-space-input-captcha-con" style="display: inline-block;" v-if="inputCaptchaVisible">
                                <Input v-model="securityCaptcha" placeholder="请填写短信验证码" style="display: inline-block;width: 204px;"></Input>
                                <div style="display: inline-block;margin-left:10px;">
                                    <Button type="default" @click="cancelinputCaptchaBox">取消</Button>
                                    <Button type="primary" @click="submitCaptcha" :loading="checkCaptchaLoading" style="margin-left: 5px;">确定</Button>
                                </div>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <FormItem label="">
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </FormItem>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
        <Modal title="图片预览" v-model="visible">
            <img :src="previewUrl" v-if="visible" style="width: 100%">
        </Modal>
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
        const valideMobile = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== _this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            previewUrl: '',
            visible: false,
            uid: '', // 登录用户的userId
            securityCaptcha: '', // 验证码
            mobileHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            CaptchaRight: false, // 验证码是否正确
            hasGetCaptcha: false, // 是否点了获取验证码
            canGetCaptcha: false, // 是否可点获取验证码
            checkCaptchaLoading: false,
            inforValidate: {
                realname: [{
                    required: true,
                    message: '姓名不能为空',
                    trigger: 'blur'
                }],
                avatar: [{
                    required: true,
                    message: '头像不能为空',
                    trigger: 'change'
                }],
                mobile: [{
                    required: true,
                    message: '请输入手机号码'
                }, {
                    validator: valideMobile
                }]
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [{
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur'
                }],
                newPass: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    message: '请至少输入6个字符',
                    trigger: 'blur'
                }, {
                    max: 32,
                    message: '最多输入32个字符',
                    trigger: 'blur'
                }],
                rePass: [{
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                }, {
                    validator: valideRePassword,
                    trigger: 'blur'
                }]
            },
            inputCaptchaVisible: false, // 显示填写验证码box
            initMobile: '',
            gettingCaptchaBtnContent: '获取验证码' // “获取验证码”按钮的文字
        };
    },
    methods: {
        _onChange(e, type, index) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'image', e.target, function(data) {
                _this.$set(_this.userInfo, 'avatar', data.url);
                _this.$refs['userInfo'].validate();
            });
        },
        viewPicture() {
            let _this = this;
            _this.previewUrl = _this.userInfo.avatar;
            _this.visible = true;
        },
        removePicture() {
            let _this = this;
            _this.$set(_this.userInfo, 'avatar', '');
        },
        getCaptcha() {
            let _this = this;
            _this.hasGetCaptcha = true;
            _this.$refs['userInfo'].validate((valid) => {
                if (valid) {
                    _this.canGetCaptcha = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            _this.gettingCaptchaBtnContent = timeLast + '秒后重试';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            _this.gettingCaptchaBtnContent = '获取验证码';
                            _this.canGetCaptcha = false;
                        }
                    }, 1000);
                    _this.inputCaptchaVisible = true;
                    Utils.ajax.post('api.php?entry=sys&c=user&a=profile&do=sendCaptcha', {
                            token: _this.token,
                            mobile: _this.userInfo.mobile
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
            });
        },
        showEditPassword() {
            let _this = this;
            _this.editPasswordModal = true;
            _this.securityCaptcha = '';
        },
        saveEdit() {
            let _this = this;
            _this.$refs['userInfo'].validate((valid) => {
                if (valid) {
                    if (_this.mobileHasChanged && _this.userInfo.mobile !== _this.initMobile) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                        if (_this.hasGetCaptcha) { // 判断是否点了获取验证码
                            if (_this.CaptchaRight) { // 判断验证码是否正确
                                _this.saveInfoAjax();
                            } else {
                                _this.$Message.error('验证码错误，请重新输入');
                            }
                        } else {
                            _this.$Message.warning('请先点击获取验证码');
                        }
                    } else {
                        _this.saveInfoAjax();
                    }
                }
            });
        },
        cancelEditPass() {
            let _this = this;
            _this.editPasswordModal = false;
        },
        saveEditPass() {
            let _this = this;
            _this.$refs['editPasswordForm'].validate((valid) => {
                if (valid) {
                    _this.savePassLoading = true;
                    Utils.ajax.post('api.php?entry=sys&c=user&a=profile&do=updatePassword', {
                            token: _this.token,
                            oldPass: _this.editPasswordForm.oldPass,
                            newPass: _this.editPasswordForm.newPass
                        })
                        .then((response) => {
                            let data = response.data;
                            _this.savePassLoading = false;
                            if (data.status == 1) {
                                _this.editPasswordModal = false;
                                _this.$Message.success(data.message);
                            } else {
                                _this.$Message.error(data.message);
                            }
                        })
                        .catch((response) => {
                            _this.$Message.error('获取数据出错');
                        });
                }
            });
        },
        init() {
            let _this = this;
            _this.initMobile = _this.userInfo.mobile;
        },
        cancelinputCaptchaBox() {
            let _this = this;
            _this.inputCaptchaVisible = false;
            _this.userInfo.mobile = _this.initMobile;
        },
        submitCaptcha() {
            let _this = this;
            _this.checkCaptchaLoading = true;
            if (_this.securityCaptcha.length === 0) {
                _this.$Message.error('请填写短信验证码');
                _this.checkCaptchaLoading = false;
            } else {
                _this.save_loading = true;
                Utils.ajax.post('api.php?entry=sys&c=user&a=profile&do=changeMobile', {
                        token: _this.token,
                        mobile: _this.userInfo.mobile,
                        captcha: _this.securityCaptcha
                    })
                    .then((response) => {
                        let data = response.data;
                        if (data.status == 1) {
                            _this.save_loading = false;
                            _this.inputCaptchaVisible = false;
                            _this.checkCaptchaLoading = false;
                            _this.userInfo = data.data;
                            _this.initMobile = _this.userInfo.mobile;
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
        hasChangeMobile() {
            let _this = this;
            _this.mobileHasChanged = true;
            _this.hasGetCaptcha = false;
            _this.CaptchaRight = false;
        },
        saveInfoAjax() {
            let _this = this;
            _this.save_loading = true;
            Utils.ajax.post('api.php?entry=sys&c=user&a=profile&do=updateUserInfo', {
                    token: _this.token,
                    realname: _this.userInfo.realname,
                    avatar: _this.userInfo.avatar,
                    mobile: _this.userInfo.mobile
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.save_loading = false;
                        _this.$store.commit('set_userInfo', data.data);
                        _this.$store.commit('setAvatar', data.data.avatar);
                        _this.initMobile = _this.userInfo.mobile;
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
