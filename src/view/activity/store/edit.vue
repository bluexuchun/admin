<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="signForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">店铺信息</p>
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
                    <FormItem label="选择店长" prop="managers" style="width:60%;">
                        <Select v-model="detail.managers" filterable clearable remote :remote-method="managerSearch" :loading="loading" multiple>
                            <Option v-for="(option, index) in managers" :value="option.sys_uid" :label="option.realname + '-' + option.username" :key="index">{{option.realname}}-{{option.username}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="名称" style="width:60%;">
                        <Input v-model="detail.title"></Input>
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
                    <FormItem label="位置" style="width:60%;">
                        <Row>
                            <Col span="5">
                            <Input type="text" v-model="detail.lat" disabled></Input>
                            </Col>
                            <Col span="5" offset="1">
                            <Input type="text" v-model="detail.lng" disabled></Input>
                            </Col>
                            <Col span="12" offset="1">
                            <Input type="text" v-model="detail.address"></Input>
                            </Col>
                        </Row>
                        <mapDrag @drag="dragMap" :location="location" style="margin-top:10px;"></mapDrag>
                    </FormItem>
                    <FormItem label="描述" style="width:60%;">
                        <Input type="textarea" :rows="5" v-model="detail.description"></Input>
                    </FormItem>
                    <FormItem label="介绍">
                        <editor id="editor1" v-model="detail.content"></editor>
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
import mapDrag from '_c/map-drag.vue';
export default {
    components: {
        mapDrag
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            activity_id: this.$route.params.activity_id,
            id: this.$route.params.id,
            detail: {
                titleColor: "rgba(25, 190,107, .5)",
                subtitleColor: "rgba(25, 190,107, .5)"
            },
            previewUrl: '',
            visible: false,
            location: {
                lng: 0,
                lat: 0
            },
            managers: [],
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=activity_store&a=edit&do=display', {
                    token: _this.token,
                    activity_id: _this.activity_id,
                    id: _this.id,
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.detail = rs.data.detail || {};
                        _this.managers = rs.data.managers || [];
                        _this.location = {
                            lng: _this.detail.lng,
                            lat: _this.detail.lat
                        };
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
        dragMap(res) {
            let _this = this;
            _this.$set(_this.detail, 'lng', res.lng);
            _this.$set(_this.detail, 'lat', res.lat);
            if (_this.detail.diy_address != 1) {
                _this.$set(_this.detail, 'address', res.address);
            }
        },
        managerSearch(query) {
            let _this = this;
            if (query !== '') {
                Utils.ajax.post('api.php?entry=sys&c=activity_store&a=edit&do=manager_search', {
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
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            Utils.ajax.post('api.php?entry=sys&c=activity_store&a=edit&do=post', {
                    token: _this.token,
                    activity_id: _this.activity_id,
                    id: _this.id,
                    store: _this.detail
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
            _this.init();
        });
    }
};
</script>
