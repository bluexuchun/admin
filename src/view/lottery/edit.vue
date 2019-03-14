<template>
    <div style="background:#fff;">
        <Form ref="lotteryForm" :label-width="150">
            <Tabs value="basic">
                <TabPane label="基础设置" name="basic">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">活动信息</p>
                            <FormItem label="排序" style="width:60%;">
                                <Input v-model="detail.displayorder"></Input>
                            </FormItem>
                            <FormItem label="标题" style="width:60%;">
                                <Input v-model="detail.title"></Input>
                            </FormItem>
                            <FormItem label="封面">
                                <div class="upload-list" style="width: 60px;height:60px;line-height: 60px;" v-if="detail.thumb">
                                    <template>
                                        <img :src="detail.thumb">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="viewPicture('thumb')"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="removePicture('thumb')"></Icon>
                                        </div>
                                    </template>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:60px;height:60px;line-height: 60px;" v-if="!detail.thumb">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'thumb')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="需要填写手机号" style="width:60%;">
                                <RadioGroup v-model="detail.need_mobile">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                                <p>粉丝是否需要填写手机号才可以抽奖</p>
                            </FormItem>
                            <FormItem label="活动状态" style="width:60%;">
                                <RadioGroup v-model="detail.status">
                                    <Radio :label="1">开放</Radio>
                                    <Radio :label="0">停止</Radio>
                                </RadioGroup>
                                <p>活动状态</p>
                            </FormItem>
                            <FormItem label="活动范围" style="width:60%;">
                                <RadioGroup v-model="detail.open">
                                    <Radio :label="1">全局公开</Radio>
                                    <Radio :label="2">私有活动</Radio>
                                    <Radio :label="3">自定义授权</Radio>
                                </RadioGroup>
                                <p>活动范围，选择多号联动，单号举办</p>
                            </FormItem>
                            <FormItem label="选择公众号" prop="accounts" style="width:60%;" v-show="detail.open == 3">
                                <Select v-model="detail.accounts" :label="detail.accounts_name" filterable clearable remote :remote-method="accountSearch" :loading="loading" multiple>
                                    <Option v-for="(option, index) in accounts" :value="option.id" :label="option.name" :key="index">{{option.name}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="限制性别" style="width:60%;">
                                <RadioGroup v-model="detail.gender">
                                    <Radio :label="0">不限制</Radio>
                                    <Radio :label="1">男</Radio>
                                    <Radio :label="2">女</Radio>
                                </RadioGroup>
                                <p>活动是否限制参与粉丝的性别，该功能未开放</p>
                            </FormItem>
                            <FormItem label="开奖类型" style="width:60%;">
                                <RadioGroup v-model="detail.type">
                                    <Radio :label="1">定时抽奖</Radio>
                                    <Radio :label="2">定量抽奖</Radio>
                                </RadioGroup>
                                <p>开奖类型</p>
                            </FormItem>
                            <FormItem label="参与量" style="width:60%;" v-if="detail.type == 2">
                                <Input v-model="detail.join_total"></Input>
                                <p>开奖需要达到的参与量</p>
                            </FormItem>
                            <FormItem label="开启打卡" style="width:60%;">
                                <RadioGroup v-model="detail.signopen">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                                <p>是否开启打卡签到功能</p>
                            </FormItem>
                            <FormItem label="获得抽奖码条件" style="width:60%;" v-if="detail.signopen == 1">
                                <RadioGroup v-model="detail.signfinish">
                                    <Radio :label="1">全部完成打卡任务</Radio>
                                    <Radio :label="0">每次打卡(非重复)获一次码(初始码的数量)</Radio>
                                </RadioGroup>
                                <p>开启打卡功能后，获得抽奖码条件。</p>
                            </FormItem>
                            <FormItem label="可领取初始抽奖码" style="width:60%;" v-if="detail.signopen == 1 && detail.signfinish != 1">
                                <RadioGroup v-model="detail.signinit">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                                <p>是否可领取初始抽奖码</p>
                            </FormItem>
                            <FormItem label="活动时间" style="width:60%;">
                                <DatePicker type="datetimerange" :options="options" format="yyyy-MM-dd HH:mm" v-model="detail.time" placeholder="请选择活动时间" style="width: 300px" @on-change="changeTime"></DatePicker>
                            </FormItem>
                            <FormItem label="抽奖人数" style="width:60%;">
                                <Input v-model="detail.prize_total"></Input>
                            </FormItem>
                            <FormItem label="初始抽奖码" style="width:60%;">
                                <Input v-model="detail.init_total"></Input>
                                <p>参与活动后，每人初始获得的抽奖码。如果开启了打卡功能。则全部打卡完成后或者每打卡一次获得该数量的抽奖码。</p>
                            </FormItem>
                            <FormItem label="邀请奖励" style="width:60%;">
                                <Row>
                                    <Col span="12" style="padding-right:10px;">
                                    <Input type="text" v-model="detail.per">
                                    <span slot="prepend">每邀请</span>
                                    <span slot="append">人</span>
                                    </Input>
                                    </Col>
                                    <Col span="12">
                                    <Input type="text" v-model="detail.unit">
                                    <span slot="prepend">解锁</span>
                                    <span slot="append">枚抽奖码</span>
                                    </Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem label="开奖方式" style="width:60%;">
                                <RadioGroup v-model="detail.opentype">
                                    <Radio :label="1">系统随机</Radio>
                                    <Radio :label="2">使用深证成指和上证指数</Radio>
                                    <Radio :label="3">转发量高低</Radio>
                                </RadioGroup>
                                <p>选择开奖方式</p>
                            </FormItem>
                            <FormItem label="颜色" style="width:60%;">
                                <Row>
                                    <Col span="6" style="padding-right:10px;">
                                    <ColorPicker v-model="detail.background" alpha />
                                    </Col>
                                    <Col span="6" style="padding-right:10px;">
                                    <ColorPicker v-model="detail.color" alpha />
                                    </Col>
                                    <Col span="6">
                                    <ColorPicker v-model="detail.btn_color" alpha />
                                    </Col>
                                    <Col span="6">
                                    <ColorPicker v-model="detail.btn_bgcolor" alpha />
                                    </Col>
                                </Row>
                                <p>全局背景颜色，全局文字颜色，按钮颜色，按钮背景色</p>
                            </FormItem>
                            <FormItem label="按钮文字" style="width:60%;">
                                <Row>
                                    <Col span="6" style="padding-right:10px;">
                                    <Input type="text" v-model="detail.btn_join_text" placeholder="未参与按钮文字" style="width: 100%;"></Input>
                                    </Col>
                                    <Col span="6" style="padding-right:10px;">
                                    <Input type="text" v-model="detail.btn_view_text" placeholder="参与过按钮文字" style="width: 100%;"></Input>
                                    </Col>
                                    <Col span="6" style="padding-right:10px;">
                                    <Input type="text" v-model="detail.btn_share_text" placeholder="分享按钮文字" style="width: 100%;"></Input>
                                    </Col>
                                    <Col span="6" style="padding-right:10px;">
                                    <Input type="text" v-model="detail.btn_winner_text" placeholder="获奖结果按钮文字" style="width: 100%;"></Input>
                                    </Col>
                                </Row>
                                <p>未参与按钮文字，参与过按钮文字，分享按钮文字，获奖结果按钮文字</p>
                            </FormItem>
                            <FormItem label="开启分享提示" style="width:60%;">
                                <RadioGroup v-model="detail.share_btn">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                                <p>是否开启分享提示</p>
                            </FormItem>
                            <FormItem label="分享提示" style="width:60%;" v-if="detail.share_btn == 1">
                                <Input v-model="detail.share_tips"></Input>
                            </FormItem>
                            <FormItem label="引导关注链接" style="width:60%;">
                                <Input v-model="detail.subscribe_link"></Input>
                            </FormItem>
                            <FormItem label="强制关注" style="width:60%;">
                                <RadioGroup v-model="detail.subscribe">
                                    <Radio :label="1">是</Radio>
                                    <Radio :label="0">否</Radio>
                                </RadioGroup>
                                <p>只有关注后才具备抽签资格</p>
                            </FormItem>
                            <FormItem label="关注提示语" style="width:60%;">
                                <Input v-model="detail.subscribe_tips"></Input>
                                <p>弹窗底部关注提示语</p>
                            </FormItem>
                            <FormItem label="倒计时" style="width:60%;">
                                <Row>
                                    <Col span="12" style="padding-right:10px;">
                                    <ColorPicker v-model="detail.countdown_bgcolor" alpha />
                                    </Col>
                                    <Col span="12" style="padding-right:10px;">
                                    <ColorPicker v-model="detail.countdown_color" alpha />
                                    </Col>
                                </Row>
                                <p>倒计时背景颜色，倒计时文字颜色</p>
                            </FormItem>
                            <FormItem label="分享标题" style="width:60%;">
                                <draggable v-model="detail.share_title" :options="{group:'displayorder'}" @end="titleEnd($event)">
                                    <div v-for="(item, index) in detail.share_title" :key="index" style="margin-bottom: 10px;">
                                        <Input v-model="item.title">
                                        <p slot="prepend">
                                            <Icon type="md-move" />
                                        </p>
                                        <p slot="append">
                                            <Icon type="md-trash" @click="deleteShareTitle(index)" />
                                        </p>
                                        </Input>
                                    </div>
                                </draggable>
                                <Button type="dashed" @click="addShareTitle">增加</Button>
                            </FormItem>
                            <FormItem label="分享图片">
                                <div style="display: inline-block;">
                                    <draggable v-model="detail.share_images" :options="{group:'displayorder'}" @end="shareImagesEnd($event)">
                                        <div class="upload-list" style="width: 60px;height:60px;line-height: 60px;" v-for="(item, index) in detail.share_images">
                                            <img :src="item.image">
                                            <div class="upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="viewPicture('share_images', index)"></Icon>
                                                <Icon type="ios-trash-outline" @click.native="removePicture('share_images', index)"></Icon>
                                            </div>
                                        </div>
                                    </draggable>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:60px;height:60px;line-height: 60px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'share_images')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="轮播图">
                                <div style="display: inline-block;">
                                    <draggable v-model="detail.images" :options="{group:'displayorder'}" @end="imagesEnd($event)">
                                        <div class="upload-list" style="width: 60px;height:60px;line-height: 60px;" v-for="(item, index) in detail.images">
                                            <img :src="item.image">
                                            <div class="upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="viewPicture('images', index)"></Icon>
                                                <Icon type="ios-trash-outline" @click.native="removePicture('images', index)"></Icon>
                                            </div>
                                        </div>
                                    </draggable>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:60px;height:60px;line-height: 60px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="阳光普照奖">
                                <div class="upload-list" style="width: 60px;height:60px;line-height: 60px;" v-if="detail.not_win">
                                    <template>
                                        <img :src="detail.not_win">
                                        <div class="upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="viewPicture('not_win')"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="removePicture('not_win')"></Icon>
                                        </div>
                                    </template>
                                </div>
                                <label class="upload-label" style="display: inline-block;width:60px;height:60px;line-height: 60px;" v-if="!detail.not_win">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'not_win')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="描述" style="width:60%;">
                                <Input type="textarea" :rows="5" v-model="detail.description"></Input>
                            </FormItem>
                            <FormItem label="活动规则">
                                <editor id="editor1" v-model="detail.rule"></editor>
                            </FormItem>
                            <FormItem label="奖品介绍">
                                <editor id="editor2" v-model="detail.content"></editor>
                            </FormItem>
                        </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="奖品" name="spec">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">奖品信息</p>
                            <FormItem id="spec_value" label="规格" style="width:60%;">
                                <div style="padding-bottom: 10px;" v-for="(item1, index1) in detail.specs" :key="index1">
                                    <Row>
                                        <Col span="12" style="padding-right:10px;">
                                        <Input type="text" v-model="item1.title"></Input>
                                        </Col>
                                        <Col span="12">
                                        <Button @click="specRemove(index1)">删除</Button>
                                        </Col>
                                    </Row>
                                    <div :id="'spec_value_' + index1" style="margin-top: 10px;">
                                        <Row>
                                            <draggable v-model="item1.specValues" :options="{group:'displayorder'}" @end="specValueEnd($event, index1)">
                                                <Col span="6" style="padding-right:10px;padding-bottom: 10px;" v-for="(item2, index2) in item1.specValues" :key="index2">
                                                <Input type="text" v-model="item2.title">
                                                <p slot="prepend">
                                                    <Icon type="md-move" />
                                                </p>
                                                <p slot="append" @click="specValueRemove(index1, index2)">
                                                    <Icon type="md-trash" />
                                                </p>
                                                </Input>
                                                </Col>
                                            </draggable>
                                            <Col span="6">
                                            <Button type="dashed" style="display: inline-block;vertical-align: middle;" @click="addSpecValue(index1)">增加</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                <Button type="warning" @click="specAdd">增加</Button>
                            </FormItem>
                            <FormItem label="数量">
                                <table class="table-sku" border="1px solid #ccc" v-if="detail.specs.length > 0">
                                    <thead>
                                        <tr>
                                            <td v-for="(list, index) in detail.specs" :key="`list${index}`">{{list['title']}}</td>
                                            <td>数量</td>
                                            <td>图片</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, index) in rows" :key="`row${index}`">
                                            <td v-for="(item, index2) in detail.specs" v-if="!((row-1)%item['rowspan'])" :rowspan="item['rowspan']" :key="`item${index2}`">
                                                {{item|getTitle(row)}}
                                            </td>
                                            <td>
                                                <Input type="text" v-model="tableList[row-1]['stock']"></Input>
                                            </td>
                                            <td>
                                                <Button type="default" class="spec-image">
                                                    <div style="position: relative;padding: 5px 15px 6px;" v-if="!tableList[row-1]['thumb']">加图
                                                        <input type="file" @change="uploadSpecThumb($event, row-1)" />
                                                    </div>
                                                    <Poptip trigger="hover" v-if="tableList[row-1]['thumb']">
                                                        <img class="thumb" :src="tableList[row-1]['thumb']" />
                                                        <div slot="content">
                                                            <img style="height: 200px;" :src="tableList[row-1]['thumb']" />
                                                        </div>
                                                    </Poptip>
                                                    <Icon type="ios-close-circle-outline" class="icon" @click="removeSpecThumb(row-1)" v-if="tableList[row-1]['thumb']"></Icon>
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="saveConfig">保存设置</Button>
                            </FormItem>
                        </Card>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
            <FormItem style="margin-top:30px;">
                <Button type="primary" @click="saveConfig">保存设置</Button>
            </FormItem>
        </Form>
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
            id: this.$route.params.id,
            detail: {
                background: "rgba(0, 0, 0, 1)",
                color: "rgba(0, 0, 0, 1)",
                btn_color: "rgba(0, 0, 0, 1)",
                btn_bgcolor: "rgba(1, 1, 1, 1)",
                countdown_bgcolor: "rgba(0, 0, 0, 1)",
                countdown_color: "rgba(0, 0, 0, 1)",
                specs: [],
                images: [],
                share_title: [],
                share_images: []
            },
            previewUrl: '',
            visible: false,
            accounts: [],
            loading: false,
            options: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            items: []
        };
    },
    filters: {
        getTitle: function(obj, index) {
            if (obj) {
                var r = parseInt((index - 1) / obj['rowspan']);
                var l = obj['specValues'].length || 1;
                var key = r % l;
                return obj['specValues'] && obj['specValues'][key] && obj['specValues'][key]['title'];
            }
        }
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        },
        rows() {
            let _this = this;
            _this.getRowSpan();
            if (!_this.detail.specs) {
                return;
            }
            var rows = 1;
            for (var i = 0; i < _this.detail.specs.length; i++) {
                var specValuesLen = _this.detail.specs[i]['specValues'].length || 1;
                rows *= specValuesLen;
            }
            return rows;
        },
        tableList: {
            get() {
                let _this = this;
                if (!_this.detail.specs) {
                    return;
                }
                var rows = _this.rows;
                var tList = [];
                for (var i = 0; i < rows; i++) {
                    var listItem = {};
                    var spec_value_id_string = [];
                    var title_string = [];
                    //构建动态项
                    for (var j = 0; j < _this.detail.specs.length; j++) {
                        //构造第一类目
                        var pid = _this.detail.specs[j]['id'];
                        var rowspan = _this.detail.specs[j]['rowspan'];
                        var len = _this.detail.specs[j]['specValues'].length;
                        if (!len) {
                            continue;
                        }
                        var index = parseInt(i / rowspan) % len;
                        var spec_value_id = _this.detail.specs[j]['specValues'][index]['id'];
                        spec_value_id_string.push(spec_value_id);
                        var real_id = spec_value_id_string.join('_');
                        listItem['pid'] = real_id;
                        var title = _this.detail.specs[j]['specValues'][index]['title'];
                        title_string.push(title);
                        var real_title = title_string.join('_');
                        listItem['title'] = real_title;
                        _this.items.map((value, key, array) => {
                            if (value.pid == real_id) {
                                listItem['stock'] = value['stock'];
                                listItem['thumb'] = value['thumb'];
                            }
                        });
                    }

                    tList.push(listItem);
                }
                return tList;
            },
            set(newValue) {
                console.log('更新', newValue);
                return newValue;
            }
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=lottery&a=edit&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.detail = rs.data.detail || {
                            specs: [],
                            images: [],
                            share_title: [],
                            accounts: [],
                            accounts_name: []
                        };
                        _this.accounts = rs.data.accounts || [];
                        _this.items = rs.data.items || [];
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
                if (type == 'thumb' || type == 'not_win') {
                    _this.$set(_this.detail, type, data.url);
                } else {
                    if (is.empty(_this.detail[type])) {
                        _this.$set(_this.detail, type, []);
                    }
                    if (!is.empty(data.url)) {
                        _this.detail[type].push({
                            displayorder: _this.detail[type].length + 1,
                            image: data.url
                        });
                    }
                }
            });
        },
        viewPicture(type, index) {
            let _this = this;
            if (type == 'thumb' || type == 'not_win') {
                _this.previewUrl = _this.detail[type];
            } else {
                _this.previewUrl = _this.detail[type][index];
            }
            _this.visible = true;
        },
        removePicture(type, index) {
            let _this = this;
            if (type == 'thumb' || type == 'not_win') {
                _this.$set(_this.detail, type, '');
            } else {
                _this.detail[type].splice(index, 1);
            }
        },
        addShareTitle() {
            let _this = this;
            if (is.empty(_this.detail.share_title)) {
                _this.$set(_this.detail, 'share_title', []);
            }
            _this.detail.share_title.push({
                title: '',
                displayorder: ''
            });
        },
        deleteShareTitle(index) {
            let _this = this;
            _this.detail.share_title.splice(index, 1);
        },
        titleEnd(e) {
            let _this = this;
            _this.$nextTick(function() {
                _this.detail.share_title.map((value, index, array) => {
                    _this.$set(_this.detail.share_title[index], 'displayorder', index + 1);
                });
            });
        },
        imagesEnd(e) {
            let _this = this;
            _this.$nextTick(function() {
                _this.detail.images.map((value, index, array) => {
                    _this.$set(_this.detail.images[index], 'displayorder', index + 1);
                });
            });
        },
        shareImagesEnd(e) {
            let _this = this;
            _this.$nextTick(function() {
                _this.detail.share_images.map((value, index, array) => {
                    _this.$set(_this.detail.share_images[index], 'displayorder', index + 1);
                });
            });
        },
        accountSearch(query) {
            let _this = this;
            if (query !== '') {
                Utils.ajax.post('api.php?entry=sys&c=lottery&a=edit&do=account_search', {
                        token: _this.token,
                        query: query
                    })
                    .then((response) => {
                        let rs = response.data;
                        if (rs.status == 1) {
                            _this.accounts = rs.data;
                        } else {
                            _this.$Message.error(rs.message);
                        }
                    })
                    .catch((response) => {
                        _this.$Message.error('获取数据出错');
                    });
            } else {
                _this.accounts = [];
            }
        },
        changeTime(data) {
            let _this = this;
            _this.$set(_this.detail, 'time', data);
        },
        specAdd() {
            let _this = this;
            if (_this.detail.specs.length >= 3) {
                return;
            }
            _this.detail.specs.push({
                displayorder: _this.detail.specs.length + 1,
                id: Utils.random(),
                title: '',
                rowspan: 1,
                specValues: []
            });
        },
        addSpecValue(index) {
            let _this = this;
            _this.detail.specs[index].specValues.push({
                id: Utils.random(),
                title: '',
                displayorder: _this.detail.specs.length + 1
            });
        },
        specValueRemove(index) {
            let _this = this;
            _this.detail.specs[index].specValues.splice(index, 1);
        },
        specRemove(index) {
            let _this = this;
            _this.detail.specs.splice(index, 1);
        },
        getRowSpan() {
            let _this = this;
            //获取rowspan
            for (var k = 0, len3 = _this.detail.specs.length; k < len3; k++) {
                var rowspan = 1;
                for (var k1 = k + 1; k1 < len3; k1++) {
                    var kSpecLen = _this.detail.specs[k1]['specValues'].length || 1;
                    rowspan *= kSpecLen;
                }
                _this.$set(_this.detail.specs[k], 'rowspan', rowspan);
            }
        },
        specValueEnd(e, index1) {
            let _this = this;
            _this.$nextTick(function() {
                _this.detail.specs[index1].specValues.map((value, index, array) => {
                    _this.$set(_this.detail.specs[index1].specValues[index], 'displayorder', index + 1);
                });
                console.log(_this.detail.specs[index1]);
            });
        },
        uploadSpecThumb(e, index) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, 'image', e.target, function(data) {
                _this.$set(_this.tableList[index], 'thumb', data.url);
                _this.$forceUpdate();
                console.log(_this.tableList);
            });
        },
        removeSpecThumb(index) {
            let _this = this;
            _this.$set(_this.tableList[index], 'thumb', '');
            _this.$forceUpdate();
        },
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            Utils.ajax.post('api.php?entry=sys&c=lottery&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    lottery: _this.detail,
                    items: _this.tableList
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
<style lang="less" scoped>
.has-image {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 0;
}

.spec-image {
    position: relative;
    padding: 0;
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
