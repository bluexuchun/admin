<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="bannerForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">规则信息</p>
                    <FormItem label="排序" style="width:60%;">
                        <Input v-model="detail.displayorder"></Input>
                    </FormItem>
                    <FormItem label="名称" style="width:60%;">
                        <Input v-model="detail.name"></Input>
                    </FormItem>
                    <FormItem label="关注回复" style="width:60%;">
                        <RadioGroup v-model="detail.type">
                            <Radio :label="1">关注回复</Radio>
                            <Radio :label="2">默认回复</Radio>
                            <Radio :label="3">普通回复</Radio>
                        </RadioGroup>
                        <p>全局仅允许一条规则作为关注回复</p>
                    </FormItem>
                    <FormItem label="关键词" style="width:60%;">
                        <draggable v-model="detail.keywords" :options="{group:'displayorder'}" @end="keywordEnd($event)">
                            <Row v-for="(item, index) in detail.keywords" :key="index" style="margin-bottom: 10px;">
                                <Col span="5">
                                <Input v-model="item.keyword">
                                </Input>
                                </Col>
                                <Col span="5" offset="1">
                                <Select v-model="item.type">
                                    <Option :value="1">全等</Option>
                                    <Option :value="2">包含</Option>
                                    <Option :value="3">正则匹配</Option>
                                </Select>
                                </Col>
                                <Col span="2" offset="1">
                                <Icon type="md-trash" @click="deleteKeyword(index)" />
                                </Col>
                                <Col span="2" offset="1">
                                <Icon type="md-move" />
                                </Col>
                            </Row>
                        </draggable>
                        <Button type="dashed" @click="addKeyword">增加</Button>
                    </FormItem>
                    <FormItem label="回复" style="width:60%;">
                        <draggable v-model="detail.replies" :options="{group:'displayorder'}" @end="replyEnd($event)">
                            <Row v-for="(item, index) in detail.replies" :key="index" style="margin-bottom: 10px;">
                                <Col span="10">
                                <div v-if="item.type == 'text'" v-html="item.content"></div>
                                <div v-if="item.type == 'image' && item.content">
                                    <img :src="item.content" style="width: 40px;height: 40px;">
                                </div>
                                <div v-if="item.type == 'voice' && item.content">
                                    <audio style="width: 100%;height: 33px;" :src="item.content" controls="controls" preload></audio>
                                </div>
                                <div v-if="item.type == 'video' && item.content">
                                    <div class="play-box">
                                        <video controls="controls" :src="item.content"></video>
                                    </div>
                                </div>
                                <div v-if="item.type == 'music' && item.url">
                                    <audio style="width: 100%;height: 33px;" :src="item.url" controls="controls" preload></audio>
                                </div>
                                </Col>
                                <Col span="3" offset="1">
                                <Select v-model="item.type">
                                    <Option value="text">文本</Option>
                                    <Option value="image">图片</Option>
                                    <Option value="voice">语音</Option>
                                    <Option value="video">视频</Option>
                                    <Option value="music">音乐</Option>
                                    <Option value="news">图文</Option>
                                </Select>
                                </Col>
                                <Col span="3" offset="1">
                                <Button type="default" size="small" @click="setContent(index)">设置内容</Button>
                                </Col>
                                <Col span="2" offset="1">
                                <Icon type="md-trash" @click="deleteReply(index)" />
                                </Col>
                                <Col span="2" offset="1">
                                <Icon type="md-move" />
                                </Col>
                                <Modal title="设置内容" @on-ok="item.modalShow = 0" @on-cancel="item.modalShow = 0" v-model="item.modalShow == 1">
                                    <div v-if="item.type == 'text'">
                                        <Poptip v-model="item.linkShow" @on-popper-show="openPoptip(index)" title="插入链接">
                                            <Button size="small" style="margin-bottom: 10px;">插入链接</Button>
                                            <div class="api" slot="content">
                                                <Row style="margin-bottom: 10px;">
                                                    <Col span="3"> 内容
                                                    </Col>
                                                    <Col span="20" offset="1">
                                                    <Input v-model="item.link_title"></Input>
                                                    </Col>
                                                </Row>
                                                <Row style="margin-bottom: 10px;">
                                                    <Col span="3"> 链接
                                                    </Col>
                                                    <Col span="20" offset="1">
                                                    <Input v-model="item.link_url"></Input>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span="11">
                                                    <Button type="default" size="small" @click="cancelInsertLink(index)">取消</Button>
                                                    </Col>
                                                    <Col span="11" offset="2" style="text-align: right;">
                                                    <Button type="primary" size="small" @click="confirmInsertLink(index)">确定</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Poptip>
                                        <Input type="textarea" :autosize="true" v-model="item.content"></Input>
                                    </div>
                                    <div v-if="item.type == 'image'">
                                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="item.content">
                                            <template>
                                                <img :src="item.content">
                                                <div class="upload-list-cover">
                                                    <Icon type="ios-trash-outline" @click.native="removeMedia(index)"></Icon>
                                                </div>
                                            </template>
                                        </div>
                                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!item.content">
                                            <input type="file" style="display:none;" @change="_onMedia($event, 'image', index)">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </label>
                                    </div>
                                    <div v-if="item.type == 'voice'">
                                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="item.content">
                                            <template>
                                                <Icon type="md-musical-notes" />
                                                <div class="upload-list-cover">
                                                    <Icon type="ios-trash-outline" @click.native="removeMedia(index)"></Icon>
                                                </div>
                                            </template>
                                        </div>
                                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!item.content">
                                            <input type="file" style="display:none;" @change="_onMedia($event, 'audio', index)">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </label>
                                    </div>
                                    <div v-if="item.type == 'video'">
                                        <FormItem label="视频名称">
                                            <Input v-model="item.title"></Input>
                                        </FormItem>
                                        <FormItem label="视频描述">
                                            <Input type="textarea" v-model="item.description"></Input>
                                        </FormItem>
                                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="item.content">
                                            <template>
                                                <Icon type="md-film" />
                                                <div class="upload-list-cover">
                                                    <Icon type="ios-trash-outline" @click.native="removeMedia(index)"></Icon>
                                                </div>
                                            </template>
                                        </div>
                                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!item.content">
                                            <input type="file" style="display:none;" @change="_onMedia($event, 'video', index)">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </label>
                                    </div>
                                    <div v-if="item.type == 'music'">
                                        <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="item.url">
                                            <template>
                                                <Icon type="md-musical-notes" />
                                                <div class="upload-list-cover">
                                                    <Icon type="ios-trash-outline" @click.native="removeMedia(index)"></Icon>
                                                </div>
                                            </template>
                                        </div>
                                        <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!item.url">
                                            <input type="file" style="display:none;" @change="_onMedia($event, 'audio', index, 'music')">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </label>
                                    </div>
                                </Modal>
                            </Row>
                        </draggable>
                        <Button type="dashed" @click="addReply">增加</Button>
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
import draggable from 'vuedraggable';
export default {
    components: {
        draggable
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            account_id: this.$route.params.account_id,
            id: this.$route.params.id,
            detail: {
                keywords: [],
                replies: []
            },
            previewUrl: '',
            visible: false,
            contentShow: false,
            type: 'text',
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=account_rule&a=edit&do=display', {
                    token: _this.token,
                    account_id: _this.account_id,
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
        _onMedia(e, type, index, field) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            if (field == 'music') {
                Utils.uploader(files, type, e.target, function(data) {
                    console.log(data);
                    _this.$set(_this.detail.replies[index], 'url', data.url);
                    _this.$set(_this.detail.replies[index], 'hqurl', data.url);
                    _this.$set(_this.detail.replies[index], 'title', data.filename);
                });
            } else {
                Utils.uploader(files, type, e.target, function(data) {
                    console.log(data);
                    _this.$set(_this.detail.replies[index], 'content', data.media);
                    _this.$set(_this.detail.replies[index], 'media_id', data.media_id);
                }, () => {}, 1, '', _this.account_id);
            }
        },
        viewMedia(idnex) {
            let _this = this;
            _this.previewUrl = _this.detail.replies[index].content;
            _this.visible = true;
        },
        removeMedia(index) {
            let _this = this;
            _this.$set(_this.detail.replies[index], 'content', '');
            _this.$set(_this.detail.replies[index], 'media_id', '');
        },
        _onChange(e, field, index, type = 'image') {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, type, e.target, function(data) {
                _this.$set(_this.detail, 'media_id', data.media_id);
            }, () => {}, 1, '', _this.account_id);
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
        addKeyword() {
            let _this = this;
            if (is.empty(_this.detail.keywords)) {
                _this.$set(_this.detail, 'keywords', []);
            }
            _this.detail.keywords.push({
                title: '',
                displayorder: '',
                type: 1
            });
        },
        deleteKeyword(index) {
            let _this = this;
            _this.detail.keywords.splice(index, 1);
        },
        keywordEnd(e) {
            let _this = this;
            _this.$nextTick(function() {
                _this.detail.keywords.map((value, index, array) => {
                    _this.$set(_this.detail.keywords[index], 'displayorder', index + 1);
                });
            });
        },
        addReply() {
            let _this = this;
            if (is.empty(_this.detail.replies)) {
                _this.$set(_this.detail, 'replies', []);
            }
            _this.detail.replies.push({
                type: 'text',
                content: '',
                media_id: '',
                article_id: '',
                displayorder: '',
                title: '',
                description: ''
            });
        },
        deleteReply(index) {
            let _this = this;
            _this.detail.replies.splice(index, 1);
        },
        replyEnd(e) {
            let _this = this;
            _this.$nextTick(function() {
                _this.detail.replies.map((value, index, array) => {
                    _this.$set(_this.detail.replies[index], 'displayorder', index + 1);
                });
            });
        },
        setContent(index) {
            let _this = this;
            _this.$set(_this.detail.replies[index], 'modalShow', 1);
        },
        playVoice(index) {
            let _this = this;
            _this.detail.replies[index].play();
        },
        openPoptip(index) {
            let _this = this;
            _this.$set(_this.detail.replies[index], 'link_title', '');
            _this.$set(_this.detail.replies[index], 'link_url', '');
        },
        confirmInsertLink(index) {
            let _this = this;
            _this.$set(_this.detail.replies[index], 'content', _this.detail.replies[index].content + '<a href="' + _this.detail.replies[index].link_url + '">' + _this.detail.replies[index].link_title + '</a>');
            _this.$set(_this.detail.replies[index], 'linkShow', false);
        },
        cancelInsertLink(index) {
            let _this = this;
            _this.$set(_this.detail.replies[index], 'linkShow', false);
        },
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            console.log(_this.account_id);
            Utils.ajax.post('api.php?entry=sys&c=account_rule&a=edit&do=post', {
                    token: _this.token,
                    account_id: _this.account_id,
                    id: _this.id,
                    account_rule: _this.detail
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
