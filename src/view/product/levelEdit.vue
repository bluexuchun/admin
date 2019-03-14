<template>
    <div style="background:#fff;">
        <Form ref="paymentForm" :label-width="150">
            <Tabs>
                <TabPane label="基础设置" name="basic">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">基本信息</p>
                            <FormItem label="等级名称" style="width:60%;">
                                <Input v-model="grade_title"></Input>
                            </FormItem>
                            <FormItem label="等级简介" style="width:60%;">
                                <Input v-model="description" type="textarea"></Input>
                            </FormItem>
                            <FormItem label="等级排序" style="width:60%;">
                                <Input v-model="displayorder"></Input>
                                <div style="color:#999;font-size:13px;">等级排序与等级息息相关，例如等级1对应排序为1，等级2对应排序为2，不能错乱！</div>
                            </FormItem>
                            <!-- <FormItem label="等级图片">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="grade_photo">
                                    <img :src="grade_photo">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('grade_photo')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture('grade_photo')"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images',0,'grade_photo')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="等级背景图片">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="grade_bg">
                                    <img :src="grade_bg">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('grade_bg')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture('grade_bg')"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images',0,'grade_bg')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem> -->
                            <FormItem label="等级福利" style="width:60%;">
                                <Input v-model="award" type="textarea"></Input>
                            </FormItem>
                            <FormItem label="签到次数" style="width:60%;">
                                <Input v-model="sign_time"></Input>
                            </FormItem>
                            <FormItem label="任务详情" style="width:60%;">
                                <Input v-model="detail" type="textarea"></Input>
                            </FormItem>
                            <FormItem label="任务详情图片">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-for="(item,index) in detail_photo" :key="index">
                                    <img :src="item.image">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('detail_photo',index)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture('detail_photo',index)"></Icon>
                                    </div>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images',0,'detail_photo')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <!-- <FormItem label="任务规则/步骤" style="width:60%;">
                                <Input v-model="task_rules" type="textarea"></Input>
                            </FormItem>
                            <FormItem label="任务规则/步骤图片">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-for="(item,index) in rules_photo" :key="index">
                                    <img :src="item.image">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('rules_photo',index)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture('rules_photo',index)"></Icon>
                                    </div>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images',0,'rules_photo')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem> -->
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
            pid: this.$route.params.pid,
            previewUrl: '',
            visible: false,
            loading: false,
            grade_photo:'',
            grade_title:'',
            grade_bg:'',
            description:'',
            sign_time:0,
            award:'',
            displayorder:0,
            detail:'',
            detail_photo:[],
            rules_photo:[],
            task_rules:''
        };
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    methods: {
        init() {
            console.log(this.$route)
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=level&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            let data = rs.data.detail
                            // _this.grade_photo = data.grade_photo
                            _this.grade_title = data.grade_title
                            // _this.grade_bg = data.grade_bg
                            _this.description = data.description
                            _this.sign_time = data.sign_time
                            _this.award = data.award
                            _this.displayorder = data.displayorder
                            _this.detail = data.detail
                            _this.detail_photo = data.detail_photo ? JSON.parse(data.detail_photo) : []
                            // _this.rules_photo = data.rules_photo ? JSON.parse(data.rules_photo) : []
                            // _this.task_rules = data.task_rules
                        }
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        _onChange(e, type, index,pname) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            
            Utils.uploader(files, 'image', e.target, function(url) {
                console.log(url)
                if(pname == 'detail_photo'){
                    _this.detail_photo.push({
                        image:url
                    })
                }else if(pname == 'rules_photo'){
                    _this.rules_photo.push({
                        image:url
                    })
                }else if(pname == 'grade_bg'){
                    _this.grade_bg = url
                }else if(pname == 'grade_photo'){
                    _this.grade_photo = url
                }
            });
        },
        viewPicture(type,index) {
            let _this = this
            if(type == 'detail_photo'){
                _this.previewUrl = _this.detail_photo[index].image
            }else if(type == 'rules_photo'){
                _this.previewUrl = _this.rules_photo[index].image
            }else if(type == 'grade_bg'){
                _this.previewUrl = _this.grade_bg
            }else if(type == 'grade_photo'){
                _this.previewUrl = _this.grade_photo
            }
            
            this.visible = true;
        },
        removePicture(type, index) {
            console.log(type,index)
            let _this = this
            if(type == 'detail_photo'){
                _this.detail_photo.splice(index,1)
            }else if(type == 'rules_photo'){
                _this.rules_photo.splice(index,1)
            }else if(type == 'grade_bg'){
                _this.grade_bg = ''
            }else if(type == 'grade_photo'){
                _this.grade_photo = ''
            }
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=level&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    bid: _this.pid,
                    grade_photo:_this.grade_photo,
                    grade_title:_this.grade_title,
                    grade_bg:_this.grade_bg,
                    description:_this.description,
                    sign_time:_this.sign_time,
                    award:_this.award,
                    displayorder:_this.displayorder,
                    detail:_this.detail,
                    detail_photo:JSON.stringify(_this.detail_photo),
                    // rules_photo:JSON.stringify(_this.rules_photo),
                    // task_rules:_this.task_rules
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.$Message.success(rs.message);
                        setTimeout(() => {
                            _this.$router.push({
                                name:'product_levelList',
                                params: {
                                    id: _this.pid
                                }
                            })
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
