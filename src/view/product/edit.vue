<template>
    <div style="background:#fff;">
        <Form ref="paymentForm" :label-width="150">
            <Tabs>
                <TabPane label="基础设置" name="basic">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">基本信息</p>
                            <FormItem label="商家名称" style="width:60%;">
                                <Input v-model="business_title"></Input>
                            </FormItem>
                            <FormItem label="状态" style="width:60%;">
                                <RadioGroup v-model="status">
                                    <Radio :label="1">待审核</Radio>
                                    <Radio :label="2">审核通过</Radio>
                                    <Radio :label="3">审核失败</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="营业执照">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="business_license">
                                    <img :src="business_license">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('business')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture()"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="商家二维码" >
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="status == 2">
                                    <img :src="shop_code">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('code')"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;display:flex;flex-direction:row;justify-content:center;align-items:center;">
                                    <div style="width:80%;line-height:150%;">未审核通过，商家二维码不可用</div>
                                </label>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="saveConfig">保存设置</Button>
                            </FormItem>
                        </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="绑定用户" name="user">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">绑定用户</p>
                            <FormItem label="用户" style="width:80%;">
                                <Input v-model="bindnickname" disabled></Input>
                            </FormItem>
                            <FormItem label="用户列表" style="width:80%;">
                                <div class="searchItem">
                                    <Input v-model="keyword" enter-button="搜索" @on-search="searchUser" search placeholder="请输入用户的nickname"></Input>
                                </div>
                                <Table :columns="userColumn" :data="userData"></Table>
                                <div style="margin: 10px;overflow: hidden">
                                    <div style="float: right;">
                                        <Page :total="total" :current="1" @on-change="changePage" :page-size="5"></Page>
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem label="姓名" style="width:80%;">
                                <Input v-model="username"></Input>
                            </FormItem>
                            <FormItem label="手机号" style="width:80%;">
                                <Input v-model="mobile"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="saveConfig">保存设置</Button>
                            </FormItem>
                        </Card>
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
import store from '@/store';
import is from 'is';
import Vue from 'vue';
import ueditor from '_c/editor/ueditor.vue';
export default {
    components: {
        ueditor
    },
    data() {
        return {
            id: this.$route.params.id,
            previewUrl: '',
            visible: false,
            loading: false,
            business_license:'',
            business_title:'',
            status:1,
            username:'',
            mobile:'',
            total:0,
            keyword:'',
            bindnickname:'',
            binduid:0,
            shop_code:'',
            userColumn: [
                    {
                        title: '头像',
                        key: 'avatar',
                        render: (h, params) => {
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        src: params.row.avatar
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '昵称',
                        key: 'nickname'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.bindAction(params.row.id,params.row.nickname)
                                        }
                                    }
                                }, '绑定')
                            ]);
                        }
                    }
                ],
                userData: [
                    
                ]
        };
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=business&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            let business = rs.data.business
                            _this.business_license = business.business_license
                            _this.business_title = business.business_title
                            _this.username = business.username
                            _this.mobile = business.mobile
                            _this.status = business.status
                            _this.bindnickname = business.nickname
                            _this.binduid = business.uid
                            _this.shop_code = business.shop_code

                            let userlist = rs.data.userlist
                            let users = []

                            userlist ? userlist.map((v,i) => {
                                users.push({
                                    id:v.uid,
                                    avatar:v.avatar,
                                    nickname:v.nickname
                                })
                            }) : []
                            _this.userData = users
                            _this.total = rs.data.total
                        }
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        _getUserList(page){
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=business&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id,
                    page:page,
                    keyword:_this.keyword
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {

                            let userlist = rs.data.userlist
                            let users = []

                            userlist ? userlist.map((v,i) => {
                                users.push({
                                    id:v.uid,
                                    avatar:v.avatar,
                                    nickname:v.nickname
                                })
                            }) : []
                            _this.userData = users
                            _this.total = rs.data.total
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
            Utils.uploader(files, 'image', e.target, function(url) {
                console.log(url)
                if (type == 'images') {
                    _this.business_license = url;
                }
            });
        },
        viewPicture(type) {
            console.log(type)
            if(type == 'code'){
                this.previewUrl = this.shop_code;
            }else{
                this.previewUrl = this.business_license;
            }
            
            this.visible = true;
        },
        removePicture(type, index) {
            this.business_license = '';
        },
        changePage(page){
            this._getUserList(page)
        },
        searchUser(){
            this._getUserList()
        },
        bindAction(id,nickname){
            this.bindnickname = nickname
            this.binduid = id
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=business&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    business_title:_this.business_title,
                    business_license:_this.business_license,
                    shop_code:_this.shop_code,
                    username:_this.username,
                    mobile:_this.mobile,
                    uid:_this.binduid,
                    status:_this.status
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.$Message.success(rs.message);
                        setTimeout(() => {
                            _this.$router.push({
                                name: 'product_list'
                            });
                        },1500)
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
<style lang="less" scoped>
.searchItem{
    margin-bottom:10px
}
.upload-video-input {
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    font-size: 26px;
    width: 111px;
}

.has-image {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 0;
}

.spec-image {
    .thumb {
        height: 31px;
    }
    input {
        position: absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        -ms-filter: 'alpha(opacity=0)';
        font-size: 16px;
        width: 100%;
    }
    &:hover .icon {
        display: block;
    }
    .icon {
        position: absolute;
        text-align: center;
        right: -8px;
        top: -8px;
        font-size: 22px;
        background-color: #fff;
        color: #2d8cf0;
        display: none;
    }
}

table {
    border: 0;
}

table.table-sku {
    background-color: #fff;
    text-align: left;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

table.table-sku td {
    border: 1px solid #e5e5e5;
    padding: 8px;
    max-width: 120px;
    text-align: center;
}
</style>
