<template>
    <script :id="randomId" name="content" type="text/plain"></script>
</template>
<script>
import config from '@/config';
import store from '@/store';
window.resetUeditorUploadConfig = false;
export default {
    props: {
        value: {
            type: String,
            default: null
        },
        ueditorPath: {
            // UEditor 代码的路径
            type: String,
            default: window.UEDITOR_HOME_URL
        },
        ueditorConfig: {
            // UEditor 配置项
            type: Object,
            default: function() {
                return {
                    autoHeightEnabled: false,
                    autoFloatEnabled: false
                };
            }
        }
    },
    data() {
        return {
            // 为了避免麻烦，每个编辑器实例都用不同的 id
            randomId: 'editor_' + (Math.random() * 100000000000000000),
            instance: null,
            // scriptTagStatus -> 0:代码未加载，1:两个代码依赖加载了一个，2:两个代码依赖都已经加载完成
            scriptTagStatus: 0,
            isReady: false,
            isInit: false,
            defaultContent: ''
        };
    },
    created() {
        console.log('ueditor-created');
        if (window.UE !== undefined) {
            // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
            this.scriptTagStatus = 2;
            this.initEditor();
        } else {
            // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
            this.insertScriptTag();
        }
    },
    beforeDestroy() {
        // 组件销毁的时候，要销毁 UEditor 实例
        if (this.instance !== null && this.instance.destroy) {
            console.log('ueditor-destroy');
            this.instance.destroy();
        }

    },
    watch: {
        value(val) {
            console.log('传值');
            let _this = this;
            _this.defaultContent = val;
            if (val && _this.isReady && !_this.isInit && val !== _this.instance.getContent()) {
                _this.instance.setContent(val);
                _this.isInit = true;
            } else {}
        },
        isReady(val) {
            let _this = this;
            if (val) {
                if (_this.defaultContent && (_this.defaultContent !== _this.instance.getContent())) {
                    _this.instance.setContent(_this.defaultContent);
                    _this.isInit = true;
                }
            }
        }
    },
    methods: {
        setContent(value) {
            if (this.isReady && value) {
                this.instance.setContent(value)
            }
        },
        insertScriptTag() {
            let editorScriptTag = document.getElementById('editorScriptTag');
            let configScriptTag = document.getElementById('configScriptTag');

            // 如果这个tag不存在，则生成相关代码tag以加载代码
            if (editorScriptTag === null) {
                configScriptTag = document.createElement('script');
                configScriptTag.type = 'text/javascript';
                configScriptTag.src = this.ueditorPath + 'ueditor.config.js';
                configScriptTag.id = 'configScriptTag';

                editorScriptTag = document.createElement('script');
                editorScriptTag.type = 'text/javascript';
                editorScriptTag.src = this.ueditorPath + 'ueditor.all.js';
                editorScriptTag.id = 'editorScriptTag';
                let s = document.getElementsByTagName('head')[0];
                s.appendChild(configScriptTag);
                s.appendChild(editorScriptTag);
            }

            // 等待代码加载完成后初始化编辑器
            if (configScriptTag.loaded) {
                this.scriptTagStatus++;
            } else {
                configScriptTag.addEventListener('load', () => {
                    this.scriptTagStatus++;
                    configScriptTag.loaded = true;
                    this.initEditor();
                });
            }

            if (editorScriptTag.loaded) {
                this.scriptTagStatus++;
            } else {
                editorScriptTag.addEventListener('load', () => {
                    this.scriptTagStatus++;
                    editorScriptTag.loaded = true;
                    this.initEditor();
                });
            }

            this.initEditor();
        },
        initEditor() {
            let _this = this;
            // scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
            if (_this.scriptTagStatus === 2 && _this.instance === null) {
                // Vue 异步执行 DOM 更新，这样一来代码执行到这里的时候可能 template 里面的 script 标签还没真正创建
                // 所以，我们只能在 nextTick 里面初始化 UEditor
                _this.$nextTick(() => {
                    console.log(_this.ueditorConfig);
                    _this.instance = window.UE.getEditor(_this.randomId, _this.ueditorConfig);
                    // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
                    _this.instance.ready(() => {
                        console.log('ready');
                        if (!window.resetUeditorUploadConfig) {
                            let token = store.state.user.token;
                            let uri = (process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro) + '/api.php?entry=sys&c=utility&a=file&do=upload&token=' + token + '&&type=';
                            window.UE.Editor.prototype._bkGetActionUrl = window.UE.Editor.prototype.getActionUrl;
                            window.UE.Editor.prototype.getActionUrl = null;
                            window.UE.Editor.prototype.getActionUrl = function(action) {
                                if (action == 'uploadimage' || action == 'uploadscrawl') {
                                    return uri + 'image';
                                } else if (action == 'uploadvideo') {
                                    return uri + 'video';
                                } else if (action == 'uploadfile') {
                                    return uri + 'file';
                                } else {
                                    return this._bkGetActionUrl.call(this, action);
                                }
                            }
                            window.resetUeditorUploadConfig = true;
                        }
                        window.ueditorCount++;
                        _this.instance.addListener("contentChange", () => {
                            const content = _this.instance.getContent();
                            _this.$emit('input', content);
                        })
                        _this.$emit('ready', _this.instance);
                        _this.isReady = true;
                    });
                });
            }
        }
    }
};
</script>
