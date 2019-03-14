<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="paymentForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">修改会员密码</p>
                    <FormItem label="新密码" style="width:60%;">
                        <Input v-model="password"></Input>
                    </FormItem>
                    <FormItem label="重复新密码" style="width:60%;">
                        <Input v-model="repassword"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="updatePassword">修改密码</Button>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">基本资料</p>
                    <FormItem label="头像">
                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="userInfo.avatar">
                            <template>
                                <img :src="userInfo.avatar">
                                <div class="upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="viewPicture"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="removePicture"></Icon>
                                </div>
                            </template>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!userInfo.avatar">
                            <input type="file" style="display:none;" @change="_onChange($event)">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="昵称" style="width:60%;">
                        <Input v-model="userInfo.nickname"></Input>
                    </FormItem>
                    <FormItem label="真实姓名" style="width:60%;">
                        <Input v-model="userInfo.realname"></Input>
                    </FormItem>
                    <FormItem label="性别">
                        <RadioGroup v-model="userInfo.profile.gender">
                            <Radio :label="1">男</Radio>
                            <Radio :label="2">女</Radio>
                            <Radio :label="0">保密</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="角色" style="width:60%;">
                        <Select v-model="userInfo.role">
                            <Option v-for="(row, index) in memberRoles" :key="index" :value="row.id">{{row.title}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="生日" style="width:60%;">
                        <DatePicker type="date" :value="birth" @on-change="changeBirth"></DatePicker>
                    </FormItem>
                    <FormItem label="国籍" style="width:60%;">
                        <Input v-model="userInfo.profile.nationality"></Input>
                    </FormItem>
                    <FormItem label="地址" style="width:60%;">
                        <al-cascader ref="resideSelector" v-model="reside" level="2" data-type="name" :ready="resideReady" />
                    </FormItem>
                    <FormItem label="详细地址" style="width:60%;">
                        <Input v-model="userInfo.profile.address"></Input>
                    </FormItem>
                    <FormItem label="邮编" style="width:60%;">
                        <Input v-model="userInfo.profile.zipcode"></Input>
                    </FormItem>
                    <FormItem label="固定电话" style="width:60%;">
                        <Input v-model="userInfo.profile.telephone"></Input>
                    </FormItem>
                    <FormItem label="手机" style="width:60%;">
                        <Input v-model="userInfo.mobile"></Input>
                    </FormItem>
                    <FormItem label="QQ" style="width:60%;">
                        <Input v-model="userInfo.profile.qq"></Input>
                    </FormItem>
                    <FormItem label="邮箱" style="width:60%;">
                        <Input v-model="userInfo.email"></Input>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">账号卡号</p>
                    <FormItem label="身份证号" style="width:60%;">
                        <Input v-model="userInfo.idcard"></Input>
                    </FormItem>
                    <FormItem label="支付宝帐号" style="width:60%;">
                        <Input v-model="userInfo.profile.alipay"></Input>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">教育情况</p>
                    <FormItem label="毕业学校" style="width:60%;">
                        <Input v-model="userInfo.profile.graduateschool"></Input>
                    </FormItem>
                    <FormItem label="班级" style="width:60%;">
                        <Input v-model="userInfo.profile.grade"></Input>
                    </FormItem>
                    <FormItem label="学号" style="width:60%;">
                        <Input v-model="userInfo.profile.studentid"></Input>
                    </FormItem>
                    <FormItem label="学历" style="width:60%;">
                        <Select v-model="userInfo.profile.education">
                            <Option value="博士">博士</Option>
                            <Option value="硕士">硕士</Option>
                            <Option value="本科">本科</Option>
                            <Option value="专科">专科</Option>
                            <Option value="中学">中学</Option>
                            <Option value="小学">小学</Option>
                            <Option value="其它">其它</Option>
                        </Select>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">工作情况</p>
                    <FormItem label="公司" style="width:60%;">
                        <Input v-model="userInfo.profile.company"></Input>
                    </FormItem>
                    <FormItem label="职业" style="width:60%;">
                        <Input v-model="userInfo.profile.occupation"></Input>
                    </FormItem>
                    <FormItem label="职位" style="width:60%;">
                        <Input v-model="userInfo.profile.position"></Input>
                    </FormItem>
                </Card>
                <Card :bordered="false" dis-hover>
                    <p slot="title">个人情况</p>
                    <FormItem label="星座" style="width:60%;">
                        <Select v-model="userInfo.profile.constellation">
                            <Option value="水瓶座">水瓶座</Option>
                            <Option value="双鱼座">双鱼座</Option>
                            <Option value="白羊座">白羊座</Option>
                            <Option value="金牛座">金牛座</Option>
                            <Option value="双子座">双子座</Option>
                            <Option value="巨蟹座">巨蟹座</Option>
                            <Option value="狮子座">狮子座</Option>
                            <Option value="处女座">处女座</Option>
                            <Option value="天秤座">天秤座</Option>
                            <Option value="天蝎座">天蝎座</Option>
                            <Option value="射手座">射手座</Option>
                            <Option value="摩羯座">摩羯座</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="生肖" style="width:60%;">
                        <Select v-model="userInfo.profile.zodiac">
                            <Option value="鼠">鼠</Option>
                            <Option value="牛">牛</Option>
                            <Option value="虎">虎</Option>
                            <Option value="兔">兔</Option>
                            <Option value="龙">龙</Option>
                            <Option value="蛇">蛇</Option>
                            <Option value="马">马</Option>
                            <Option value="羊">羊</Option>
                            <Option value="猴">猴</Option>
                            <Option value="鸡">鸡</Option>
                            <Option value="狗">狗</Option>
                            <Option value="猪">猪</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="身高" style="width:60%;">
                        <Input v-model="userInfo.profile.height"></Input>
                    </FormItem>
                    <FormItem label="体重" style="width:60%;">
                        <Input v-model="userInfo.profile.weight"></Input>
                    </FormItem>
                    <FormItem label="血型" style="width:60%;">
                        <Input v-model="userInfo.profile.bloodtype"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="saveConfig">保存设置</Button>
                    </FormItem>
                </Card>
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
import store from '@/store';
import is from 'is';
export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            uid: 0,
            password: '',
            repassword: '',
            userInfo: {
                profile: []
            },
            memberRoles: {},
            reside: [],
            birth: '',
            previewUrl: '',
            visible: false,
            category: [],
            resideReady: false
        };
    },
    watch: {
        reside(val) {
            let _this = this;
            console.log(val);
            _this.$set(_this.userInfo.profile, 'resideprovince', val[0]);
            _this.$set(_this.userInfo.profile, 'residecity', val[1]);
            _this.$set(_this.userInfo.profile, 'residedist', val[2]);
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=edit&do=display', {
                    token: _this.token,
                    uid: _this.uid
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            _this.userInfo = rs.data.userInfo;
                            _this.reside = [_this.userInfo.profile.resideprovince, _this.userInfo.profile.residecity, _this.userInfo.profile.residedist];
                            _this.resideReady = true;
                            _this.birth = _this.userInfo.profile.birthyear && _this.userInfo.profile.birthmonth && _this.userInfo.profile.birthday ? _this.userInfo.profile.birthyear + '-' + _this.userInfo.profile.birthmonth + '-' + _this.userInfo.profile.birthday : '1993-02-02';

                            _this.memberRoles = rs.data.memberRoles;

                        }
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
                _this.$set(_this.userInfo, 'avatar', data.url);
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
        updatePassword() {
            let _this = this;
            if (_this.password != _this.repassword) {
                _this.$Message.error('两次密码不一致');
                return false;
            }
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=edit&do=updatePassword', {
                    token: _this.token,
                    uid: _this.uid,
                    password: _this.password
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
        },
        changeBirth(date) {
            let _this = this;
            console.log(date);
            let dateArray = date.split('-');
            _this.$set(_this.userInfo.profile, 'birthyear', dateArray[0]);
            _this.$set(_this.userInfo.profile, 'birthmonth', dateArray[1]);
            _this.$set(_this.userInfo.profile, 'birthday', dateArray[2]);
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=edit&do=post', {
                    token: _this.token,
                    uid: _this.uid,
                    userInfo: _this.userInfo
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
            _this.uid = _this.$route.params.uid;
            _this.init();
        });
    }
};
</script>
