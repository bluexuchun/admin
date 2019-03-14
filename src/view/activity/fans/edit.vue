<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="bannerForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">轮播图信息</p>
                    <FormItem label="排序" style="width:60%;">
                        <Input v-model="detail.displayorder"></Input>
                    </FormItem>
                    <FormItem label="状态" style="width:60%;">
                        <RadioGroup v-model="detail.status">
                            <Radio :label="1">显示</Radio>
                            <Radio :label="0">不显示</Radio>
                        </RadioGroup>
                        <p>是否显示</p>
                    </FormItem>
                    <FormItem label="标题" style="width:60%;">
                        <Input v-model="detail.title"></Input>
                    </FormItem>
                    <FormItem label="标题文字颜色" style="width:60%;">
                        <ColorPicker v-model="detail.titleColor" alpha />
                    </FormItem>
                    <FormItem label="副标题" style="width:60%;">
                        <Input v-model="detail.subtitle"></Input>
                    </FormItem>
                    <FormItem label="副标题文字颜色" style="width:60%;">
                        <ColorPicker v-model="detail.subtitleColor" alpha />
                    </FormItem>
                    <FormItem label="图片">
                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="detail.thumb">
                            <template>
                                <img :src="detail.thumb">
                                <div class="upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="viewPicture"></Icon>
                                    <Icon type="ios-trash-outline" @click.native="removePicture"></Icon>
                                </div>
                            </template>
                        </div>
                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!detail.thumb">
                            <input type="file" style="display:none;" @change="_onChange($event)">
                            <Icon type="ios-camera" size="20"></Icon>
                        </label>
                    </FormItem>
                    <FormItem label="链接" style="width:60%;">
                        <Input v-model="detail.link"></Input>
                    </FormItem>
                </Card>
                <FormItem style="margin-top:30px;">
                    <Button type="primary" @click="saveConfig">保存设置</Button>
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
            id: this.$route.params.id,
            detail: {
                titleColor: "rgba(25, 190,107, .5)",
                subtitleColor: "rgba(25, 190,107, .5)"
            },
            previewUrl: '',
            visible: false
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=banner&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.detail = rs.data;
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
                _this.$set(_this.detail, 'thumb', data.url);
            });
        },
        viewPicture() {
            let _this = this;
            _this.previewUrl = _this.detail.thumb;
            _this.visible = true;
        },
        removePicture() {
            let _this = this;
            _this.$set(_this.detail, 'thumb', '');
        },
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            Utils.ajax.post('api.php?entry=sys&c=banner&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    banner: _this.detail
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
        //_this.$nextTick(function() {
        _this.init();
        //});
    }
};
</script>
