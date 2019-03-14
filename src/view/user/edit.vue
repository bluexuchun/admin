<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                管理员设置
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="用户名" prop="username" style="width:60%;">
                    <Input v-model="formValidate.username" />
                </FormItem>
                <FormItem label="密码" prop="password" :rules="{
                        required: isPassword,
                        message: '密码不能为空',
                        trigger: 'blur'
                    }" style="width:60%;">
                    <Input v-model="formValidate.password" />
                </FormItem>
                <FormItem label="手机" prop="mobile" style="width:60%;">
                    <Input v-model="formValidate.mobile" />
                </FormItem>
                <FormItem label="姓名" prop="realname" style="width:60%;">
                    <Input v-model="formValidate.realname" />
                </FormItem>
                <FormItem label="头像">
                    <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="formValidate.avatar">
                        <template>
                            <img :src="formValidate.avatar">
                            <div class="upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="viewPicture"></Icon>
                                <Icon type="ios-trash" @click.native="removePicture"></Icon>
                            </div>
                        </template>
                    </div>
                    <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!formValidate.avatar">
                        <input type="file" style="display:none;" @change="_onChange($event)">
                        <Icon type="ios-camera" size="20"></Icon>
                    </label>
                </FormItem>
                <FormItem label="状态" prop="status" style="width:60%;">
                    <RadioGroup v-model="formValidate.status">
                        <Radio :label="1">
                            <span>开放</span>
                        </Radio>
                        <Radio :label="0">
                            <span>禁止</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="备注" prop="remark" style="width:60%;">
                    <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 10}"></Input>
                </FormItem>
                <FormItem label="选择角色" prop="roles" style="width:60%;">
                    <Select v-model="formValidate.roles" filterable remote :remote-method="roleSearch" :loading="loading" multiple>
                        <Option v-for="(option, index) in roles" :value="option.id" :label="option.title" :key="index">{{option.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="">
                    <Button :disabled="hasSubmit" @click="submit('formValidate')" style="width:100px;" type="primary">提交</Button>
                </FormItem>
            </Form>
        </Card>
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
        username() {
            let userInfo = this.$store.state.user.userInfo;
            return userInfo.username;
        }
    },
    data() {
        return {
            oldUsername: '',
            isPassword: true,
            formValidate: {
                sys_uid: 0,
                username: '',
                password: '',
                mobile: '',
                realname: '',
                avatar: '',
                status: '',
                remark: '',
                roles: []
            },
            previewUrl: '',
            visible: false,
            hasSubmit: false,
            ruleValidate: {
                username: [{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                }],
                mobile: [{
                    required: true,
                    message: '手机不能为空',
                    trigger: 'blur'
                }],
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
                status: [{
                    required: true,
                    message: '请选择状态',
                    type: 'number',
                    trigger: 'change'
                }],
                remark: [{
                    required: true,
                    message: '请输入该角色备注',
                    trigger: 'blur'
                }],
                roles: [{
                    required: true,
                    message: '请选择该用户角色',
                    trigger: 'change',
                    type: 'array'
                }]
            },
            roles: [],
            loading: false
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=user&a=edit&do=display', {
                    token: _this.token,
                    sys_uid: _this.formValidate.sys_uid
                })
                .then((response) => {
                    let res = response.data;
                    if (res.status == 1) {
                        _this.formValidate = res.data.user;
                        _this.oldUsername = res.data.user.username;
                        _this.roles = res.data.roles;
                    } else {
                        _this.$Message.error(res.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        _onChange(e, type, index) {
            let _this = this
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'image', e.target, function(data) {
                _this.$set(_this.formValidate, 'avatar', data.url);
                _this.$refs['formValidate'].validate();
            });
        },
        viewPicture() {
            let _this = this
            _this.previewUrl = _this.formValidate.avatar;
            _this.visible = true;
        },
        removePicture() {
            let _this = this
            _this.$set(_this.formValidate, 'avatar', '');
        },
        roleSearch(query) {
            let _this = this;
            if (query !== '') {
                Utils.ajax.post('api.php?entry=sys&c=user&a=edit&do=search', {
                        token: _this.token,
                        query: query
                    })
                    .then((response) => {
                        let rs = response.data;
                        if (rs.status == 1) {
                            _this.roles = rs.data;
                        } else {
                            _this.$Message.error(rs.message);
                        }
                    })
                    .catch((response) => {
                        _this.$Message.error('获取数据出错');
                    });
            } else {
                _this.roles = [];
            }
        },
        submit(name) {
            let _this = this;
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    Utils.ajax.post('api.php?entry=sys&c=user&a=edit&do=edit', {
                            token: _this.token,
                            sys_uid: _this.formValidate.sys_uid,
                            username: _this.formValidate.username,
                            password: _this.formValidate.password,
                            mobile: _this.formValidate.mobile,
                            realname: _this.formValidate.realname,
                            avatar: _this.formValidate.avatar,
                            status: _this.formValidate.status,
                            remark: _this.formValidate.remark,
                            roles: _this.formValidate.roles
                        })
                        .then((response) => {
                            let data = response.data;
                            if (data.status == 1) {
                                let oldUserName = _this.username;
                                if (oldUserName == _this.oldUsername) {
                                    // 退出登录
                                    this.$store.commit('set_logout', this);
                                    this.$store.commit('clearOpenedSubmenu');
                                    this.$router.push({
                                        name: 'login'
                                    });
                                    return false;
                                }
                                _this.$router.push({
                                    name: 'user_list'
                                });
                                _this.$Message.success(data.message);
                            } else {
                                _this.$Message.error(data.message);
                            }
                        })
                        .catch((response) => {
                            _this.$Message.error('获取数据出错');
                        });
                } else {
                    _this.$Message.error('请检查表单是否填写正确');
                }
            });

        }
    },
    mounted: function() {
        let _this = this;
        _this.$nextTick(function() {
            _this.$set(_this.formValidate, 'sys_uid', _this.$route.params.sys_uid);
            console.log(_this.formValidate.sys_uid, _this.$route.params.sys_uid);
            if (_this.formValidate.sys_uid) {
                _this.isPassword = false;
                _this.init();
            }
        });
    }
};
</script>
