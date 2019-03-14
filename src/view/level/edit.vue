<template>
    <div style="background:#fff;">
        <Form ref="paymentForm" :label-width="150">
            <Tabs>
                <TabPane label="基础设置" name="basic">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">基本信息</p>
                            <FormItem label="等级ID" style="width:60%;">
                                <Input v-model="grade_id"></Input>
                            </FormItem>
                            <FormItem label="等级名称" style="width:60%;">
                                <Input v-model="grade_name"></Input>
                            </FormItem>
                            <FormItem label="等级Icon">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="grade_photo">
                                    <img :src="grade_photo">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('grade_photo')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture('grade_photo')"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images','grade_photo')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="等级背景图" >
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="grade_bg">
                                    <img :src="grade_bg">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture('grade_bg')"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="removePicture('grade_bg')"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images','grade_bg')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
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
            grade_id:0,
            grade_name:'',
            grade_bg:'',
            grade_photo:''
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
            if(!_this.id) return;
            Utils.ajax.post('api.php?entry=sys&c=public&a=grade&do=grade_edit', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    console.log(response)
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            let grade = rs.data
                            _this.grade_id = grade.grade_id
                            _this.grade_name = grade.grade_name
                            _this.grade_bg = grade.grade_bg
                            _this.grade_photo = grade.grade_photo
                        }
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        _onChange(e, type, name) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'image', e.target, function(url) {
                if(name == 'grade_bg'){
                    _this.grade_bg = url
                }else{
                    _this.grade_photo = url
                }
            });
        },
        viewPicture(type) {
            console.log(type)
            if(type == 'grade_bg'){
                this.previewUrl = this.grade_bg;
            }else{
                this.previewUrl = this.grade_photo;
            }
            
            this.visible = true;
        },
        removePicture(type, index) {
            if(type == 'grade_bg'){
                this.grade_bg = '';
            }else{
                this.grade_photo = '';
            }
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=public&a=grade&do=grade_hold', {
                    token: _this.token,
                    id:_this.id,
                    grade_id: _this.grade_id,
                    grade_name: _this.grade_name,
                    grade_bg: _this.grade_bg,
                    grade_photo: _this.grade_photo,
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.$Message.success(rs.message);
                        setTimeout(() => {
                            _this.$router.push({
                                name: 'level_list'
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
