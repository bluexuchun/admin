<style lang="less" scope>
@import '../../../assets/less/common.less';
@import '../../../assets/less/poster.less';
.upload-button input[type=file] {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="pinpoint"></Icon>
                海报(背景图建议320*460或对应倍数的图片)
            </p>
            <Row slot="extra">
                <ButtonGroup>
                    <Button @click.native="addElement(1)">
                        文本
                    </Button>
                    <Button class="upload-button">
                        <input type="file" @change="_onChange($event)">图片
                    </Button>
                    <Button @click.native="bgEditorToggle(true)">
                        背景
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button @click.native="addElement(3)">
                        昵称
                    </Button>
                    <Button @click.native="addAvatar">
                        头像
                    </Button>
                    <Button @click.native="addMinaCode">
                        小程序码
                    </Button>
                    <Button @click.native="addGallery">
                        画作
                    </Button>
                </ButtonGroup>
                <Button type="primary" @click.native="savePoster">保存</Button>
            </Row>
            <Row type="flex" justify="center" @click.native="toggerActive">
                <!-- 显示 -->
                <Col span="12">
                <main-show :show-json="showJson" :render-json="renderJson" :page-json="pageJson[0]" :show-id="showId" ref="show"></main-show>
                </Col>
                <!-- 编辑工具 -->
                <Col span="12">
                <main-editor :render-json="renderJson" :show-id="showId" ref="editor" :page-json="pageJson[0]"></main-editor>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import Utils from '@/utils';
import is from 'is';
import Vue from 'vue';

import mainEditor from '@/view/product/poster/editor/main-editor.vue';
import mainShow from '@/view/product/poster/show/main-show.vue';
import bus from '@/view/product/poster/js/bus';
import appJson from '@/view/product/poster/js/app/app.json';

let posterVue;

//排错技巧：定位到文件－行，数据没同步
//针对当前页：showJson=[{},{}];renderJson={id:{},id{}}
const showJsons = [{
    "page": 0,
    "json": [],
    "bgImage": {
        backgroundColor: "",
        coord: "",
        url: ""
    }
}];

import store from '@/store';

export default {
    computed: {
        token() {
            return this.$store.state.app.token;
        }
    },
    data() {
        return {
            id: this.$route.params.id,
            gid: this.$route.params.gid,
            detail: [],
            //当前编辑json
            renderJson: {},
            //当前编辑的id
            showId: false,
            pageJson: [],
            //当前页数
            page: 0,
            showJson: [],
            initJson: this.parseJson(appJson.initJsons),
            initPage: this.parseJson(appJson.initPage),
            histroyJson: [],
            ref: {},
            h5Json: {},
            isUpdate: false
        };
    },
    components: {
        mainEditor,
        mainShow,
    },
    created() {
        posterVue = this;
        //设置总json
        this.pageJson = this.parseJson(showJsons);
        //设置活动id,编辑状态
        const id = this.$route.params.id || '';
        if (id) {
            this.fetchPageJson();
        } else {
            this.init();
        }
    },
    methods: {
        fetchPageJson() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=poster&a=edit&do=display', {
                    token: posterVue.token,
                    id: posterVue.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data.posterData)) {
                            let temp = typeof(rs.data.posterData) === "object" ? rs.data.posterData : JSON.parse(rs.data.posterData);
                            _this.pageJson = _this.parseJson(temp);
                            console.log(_this.pageJson);
                            _this.init();
                        }
                    } else {
                        posterVue.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    posterVue.$Message.error('获取数据出错');
                });
        },
        init() {
            //设置总json
            // this.pageJson = this.parseJson(json);
            //设置showJson
            //如果只有一个，直接用

            this.getPageJson();

            //this.getPageJson();
            //设置renderJson
            this.renderJson = this.converJson(this.showJson);
            //绑定全局bus事件
            this.addEvent();

            bus.$emit('add-histroy');
        },
        addAvatar() {
            this.addElement(4, {
                content: siteroot + '/attachment/global/avatar.png'
            });
        },
        addMinaCode() {
            this.addElement(5, {
                content: siteroot + '/attachment/global/minacode.png'
            });
        },
        addGallery() {
            this.addElement(6, {
                content: siteroot + '/attachment/global/gallery.png'
            });
        },
        _onChange(e, type, index) {
            let _this = this;
            var files = e.target.files;
            if (!files.length) return;
            Utils.uploader(files, e.target, function(url) {
                _this.addElement(2, {
                    content: url
                });
            });
        },
        //弹层确定按钮更新数据
        addElement(type, params) {
            this.dialogVisible = false;
            this.formDialogVisible1 = false;
            this.formDialogVisible2 = false;
            this.formDialogVisible3 = false;
            this.formDialogVisible4 = false;
            this.formDialogVisible5 = false;
            //编辑
            if (this.isUpdate === true) {
                let temp = this.parseJson(this.renderJson);
                Object.assign(temp[this.showId], params);
                bus.$emit('update-json', temp);
                if (type === 2) {
                    bus.$emit('navbar-pic-update', temp[this.showId]);
                }
                this.isUpdate = false;
            } else {
                bus.$emit('add-json', type, params);
            }
            this.isBg = false;
            bus.$emit('change-tab', 'second');
            bus.$emit('add-histroy');
        },
        addEvent() {
            //文字 更改元素大小
            bus.$on('show-text-resize', function(isResize) {
                this.$refs.show.$refs.template[0].resize(isResize);
            }.bind(this));

            //更新整个h5属性
            bus.$on('update-h5Json', function(data) {
                this.h5Json = Object.assign({}, this.h5Json, data);
            }.bind(this));

            //更新renderJson
            bus.$on('update-json', function(data) {
                // console.info('update-json',data)
                this.updateMethod(data);
                this.setPageJson();
            }.bind(this));

            //添加元素
            bus.$on('add-json', function(type, params) {
                this.addJson(type, params);
                this.setPageJson();
            }.bind(this));

            //修改所有元素的某一个属性
            bus.$on('update-themecolor', function(color) {
                this.setThemecolor(color);
                bus.$emit('set-page', this.page);
            }.bind(this));

            //设置showId
            bus.$on('set-elementId', function(_id) {
                this.showId = _id;
            }.bind(this));

            //设置page
            bus.$on('set-page', function(_page) {
                this.page = _page;
                let result = this.getPageJson();
                this.showId = false;
                this.renderJson = this.converJson(this.showJson);
            }.bind(this));
            //删除page
            bus.$on('delete-page', function(_page) {
                let result = this.deletePageJson(_page);
                this.pageJson = result;
                if (result.length) {
                    this.page = 1;
                    this.showId = false;
                }
                bus.$emit('set-page', this.page);
            }.bind(this));
            //添加page
            bus.$on('add-page', function() {
                let page = this.pageJson.length + 1;
                let temp = this.parseJson(appJson.initPage);
                temp.page = page;
                this.pageJson.push(temp);
                this.page = page;
                bus.$emit('set-page', page);
            }.bind(this));

            //更新所有page-json
            bus.$on('update-pageJson-all', function(data) {
                this.updatePageJson(data);
            }.bind(this));

            //更新当前page单一属性
            bus.$on('update-page', function(key, value) {
                let json = this.parseJson(this.pageJson);
                json[0][key] = value;
                this.pageJson = json;
                bus.$emit('set-page', this.page);
            }.bind(this));

            //更新当前page属性
            bus.$on('update-pageJson', function(value) {
                let json = this.parseJson(this.pageJson);
                json[0] = Object.assign({}, json[0], value);
                this.pageJson = json;
                bus.$emit('set-page', this.page);
            }.bind(this));

            //更新所有页面page属性
            bus.$on('update-pageJson-all', function(value) {
                let json = this.parseJson(this.pageJson);
                for (let i = 0; i < json.length; i++) {
                    json[i] = Object.assign({}, json[i], value);
                }
                this.pageJson = json;
                bus.$emit('set-page', this.page);
            }.bind(this));

            //保存json
            bus.$on('save-json', function() {
                this.setPageJson();
            }.bind(this));

            //保存json
            bus.$on('reset-json', function() {
                let json = this.parseJson(this.renderJson);
                json[this.showId] = this.parseJson(appJson.initJsons.text);
                json[this.showId].content = this.renderJson[this.showId].content;
                json[this.showId].id = this.renderJson[this.showId].id;
                // console.info(json)
                bus.$emit('update-json', json);
            }.bind(this));

            //添加历史纪录
            bus.$on('add-histroy', function() {
                let json = this.parseJson(this.pageJson);
                let len = this.histroyJson.length;
                if (this.jsonEq(json, this.histroyJson[len - 1])) {
                    return false;
                }
                this.histroyJson.push(json);
                len = len + 1;
                let min = len - 10 < 0 ? 0 : len - 10;
                if (len >= 40) {
                    this.histroyJson = this.parseJson(this.histroyJson.slice(min, len));
                }
            }.bind(this));

            //获取设置历史纪录
            bus.$on('get-histroy', function() {
                let len = this.histroyJson.length;
                let result;
                if (!len) {
                    return false;
                }
                //兼容没办法获取改变前的数据，只能通过@change方法获取。如果用watch会存储很多错误信息.所以要保存第一个的状态
                result = len === 1 ? this.histroyJson[0] : this.histroyJson.pop();
                this.pageJson = this.parseJson(result);
                if (this.pageJson.length < this.page) {
                    this.page = 1;
                    this.showId = false;
                }
                bus.$emit('set-page', this.page);
            }.bind(this));

            //切换显示背景编辑器
            // bus.$on('bg-editor-toggle', function(isActive) {
            //     let json=this.parseJson(this.pageJson[this.0].bgImage);
            //     console.info(json)
            //     this.$refs.editor.toggleBgEditor(isActive,json);
            // }.bind(this));
        },
        //切换显示背景编辑器
        bgEditorToggle(isActive) {
            this.toggerActive();
            let json = this.parseJson(this.pageJson[0].bgImage);
            this.$refs.editor.toggleBgEditor(isActive, json);
        },
        //添加page
        updatePageJson(json, page) {
            this.pageJson = this.parseJson(json);
            bus.$emit('set-page', 1);
        },
        //统一更换主题色
        setThemecolor(color) {
            let jsons = this.parseJson(this.pageJson);
            jsons.forEach(function(json, index) {
                json.json.forEach(function(item, index) {
                    if (item.text.themeColor && item.type != 7) {
                        item.text.themeColor = color;
                        item.text.borderColor = color;
                    }
                })
            })
            this.pageJson = jsons;
        },
        updateMethod(data) {
            if (data && this.renderJson !== data) {
                this.renderJson = JSON.parse(JSON.stringify(data));
                this.showJson = this.converShowJson(data);
            }
        },
        getPageJson() {
            for (var i = 0; i < this.pageJson.length; i++) {
                if (this.pageJson[i].page == this.page) {
                    this.showJson = this.pageJson[i].json;
                    return this.pageJson[i].json;
                }
            }
            return false;
        },
        deletePageJson(page) {
            let temp,
                result = [],
                newPage = 1;
            let json = this.parseJson(this.pageJson);
            for (var i = 0; i < json.length; i++) {
                if (json[i].page !== page) {
                    temp = json[i];
                    temp.page = newPage;
                    result.push(temp);
                    newPage++;
                }
            }
            return result;
        },

        setPageJson(data) {
            for (var i = 0; i < this.pageJson.length; i++) {
                if (this.pageJson[i].page === this.page) {
                    this.pageJson[i].json = data || this.showJson;
                    return false;
                }
            }
        },
        //json是否相等
        jsonEq(val1, val2) {
            return JSON.stringify(val1) === JSON.stringify(val2);
        },

        //深拷贝
        parseJson(json) {
            return JSON.parse(JSON.stringify(json));
        },
        //添加元素
        addJson(type, params) {
            //获取val值
            const keyVal = appJson.key[type];
            let initVal = Object.assign({}, this.initJson[keyVal]);
            //获取id
            initVal.id = this.createId();
            initVal.zIndex = this.addIndex();
            //合并参数
            if (params) {
                Object.assign(initVal, params);
            }
            this.showId = initVal.id;
            this.showJson.push(initVal);
            this.renderJson = this.converJson(this.showJson);
            bus.$emit('re-render', this.renderJson);
        },
        addIndex() {
            let max = 1;
            let len = this.showJson.length;
            let index;
            if (len === 0) {
                return 1;
            }
            for (let i = 0; i < len; i++) {
                index = this.showJson[i].zIndex;
                if (max < index) {
                    max = index;
                }
            }
            return max + 1;
        },
        //showJson转换成renderJson
        converJson(data) {
            const result = {};
            for (var i = data.length - 1; i >= 0; i--) {
                result[data[i].id] = data[i];
            }
            return result;
        },
        //renderJson转换成showJson
        converShowJson(data) {
            const result = [];
            for (let id in data) {
                result.push(data[id]);
            }
            return result;
        },
        createId() {
            var date = new Date();
            return date.getTime();
        },
        toggerActive() {
            bus.$emit('remove-selected');
            bus.$emit('button2-menu-hide');
            this.showId = false;
        },
        savePoster() {
            let pageData = JSON.stringify(this.pageJson);
            console.log(pageData);
            Utils.ajax.post('api.php?entry=sys&c=poster&a=edit&do=post', {
                    token: posterVue.token,
                    id: posterVue.id,
                    gid: posterVue.gid,
                    posterData: pageData
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        posterVue.$Message.success(rs.message);
                    } else {
                        posterVue.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    posterVue.$Message.error('获取数据出错');
                });
        }
    },
    mounted() {
        //键盘上下左右移动
        document.addEventListener('keydown', function(event) {
            //撤销 ctrl+z
            if ((event.keyCode === 90 && event.metaKey || event.keyCode === 90 && event.ctrlKey)) {
                bus.$emit('get-histroy');
            }

            if (!this.showId) {
                return false;
            }
            //上下左右移动
            const arr = [
                ['left', -1],
                ['left', 1],
                ['top', -1],
                ['top', 1]
            ];
            let result = event.keyCode === 37 ? 0 : event.keyCode === 39 ? 1 : event.keyCode === 38 ? 2 : event.keyCode === 40 ? 3 : false;
            if (result !== false) {
                let data = this.parseJson(this.renderJson);
                data[this.showId].position[arr[result][0]] = data[this.showId].position[arr[result][0]] + arr[result][1];
                bus.$emit('update-json', data);
            }

            //删除
            if (event.keyCode === 8 || event.keyCode === 46) {
                if (event.target.tagName === 'BODY') {
                    bus.$emit('add-histroy');
                    delete this.renderJson[this.showId];
                    let data = this.parseJson(this.renderJson);
                    bus.$emit('update-json', data);
                    this.showId = false;
                }

            }

        }.bind(this))
    }
};
</script>
