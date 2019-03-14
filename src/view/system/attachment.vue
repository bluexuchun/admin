<template>
    <div style="background:#fff;">
        <Tabs value="global">
            <TabPane label="全局设置" name="global">
                <Row>
                    <Col>
                    <Form ref="uploadForm" :label-width="150">
                        <Card :bordered="false" dis-hover>
                            <p slot="title">PHP 环境说明</p>
                            <FormItem label="PHP 环境说明" style="width:60%;">
                                <Row>
                                    <Col>1. 当前 PHP 环境允许最大单个上传文件大小为: {{upload_max_filesize}}</Col>
                                    <Col>2. 当前 PHP 环境允许最大 POST 表单大小为: {{post_max_size}}</Col>
                                </Row>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">附件缩略设置</p>
                            <FormItem label="缩略设置">
                                <RadioGroup v-model="upload.image.thumb">
                                    <Radio :label="1">启用</Radio>
                                    <Radio :label="0">关闭</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="" style="width:60%;" v-if="upload.image.thumb == 1">
                                <Input v-model="upload.image.width">
                                <span slot="prepend">宽</span>
                                <span slot="append">px</span>
                                </Input>
                                <p>缩略后图片 最大宽度</p>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">图片附件设置</p>
                            <FormItem label="支持文件后缀" style="width:60%;">
                                <Tag v-for="(item, index) in upload.image.extentions" :key="index" :name="item" closable @on-close="imageSuffixClose">{{ item }}</Tag>
                                <Input type="text" @keyup.13.native="imageSuffixAdd" placeholder="添加相关标签，回车分隔"></Input>
                            </FormItem>
                            <FormItem label="支持文件大小" style="width:60%;">
                                <Input v-model="upload.image.limit">
                                <span slot="append">KB</span>
                                </Input>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">音频附件设置</p>
                            <FormItem label="支持文件后缀" style="width:60%;">
                                <Tag v-for="(item, index) in upload.audio.extentions" :key="index" :name="item" closable @on-close="audioSuffixClose">{{ item }}</Tag>
                                <Input type="text" @keyup.13.native="audioSuffixAdd" placeholder="添加相关标签，回车分隔"></Input>
                            </FormItem>
                            <FormItem label="支持文件大小" style="width:60%;">
                                <Input v-model="upload.audio.limit">
                                <span slot="append">KB</span>
                                </Input>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">视频附件设置</p>
                            <FormItem label="支持文件后缀" style="width:60%;">
                                <Tag v-for="(item, index) in upload.video.extentions" :key="index" :name="item" closable @on-close="videoSuffixClose">{{ item }}</Tag>
                                <Input type="text" @keyup.13.native="videoSuffixAdd" placeholder="添加相关标签，回车分隔"></Input>
                            </FormItem>
                            <FormItem label="支持文件大小" style="width:60%;">
                                <Input v-model="upload.video.limit">
                                <span slot="append">KB</span>
                                </Input>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">文件附件设置</p>
                            <FormItem label="支持文件后缀" style="width:60%;">
                                <Tag v-for="(item, index) in upload.file.extentions" :key="index" :name="item" closable @on-close="fileSuffixClose">{{ item }}</Tag>
                                <Input type="text" @keyup.13.native="fileSuffixAdd" placeholder="添加相关标签，回车分隔"></Input>
                            </FormItem>
                            <FormItem label="支持文件大小" style="width:60%;">
                                <Input v-model="upload.file.limit">
                                <span slot="append">KB</span>
                                </Input>
                            </FormItem>
                        </Card>
                        <FormItem>
                            <Button type="primary" @click="saveGlobal">保存设置</Button>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="远程附件" name="remote">
                <Row>
                    <Col>
                    <Form :label-width="150">
                        <Card :bordered="false" dis-hover>
                            <FormItem label="选择远程附件存储类型" style="width:60%;">
                                <RadioGroup v-model="remoteType">
                                    <Radio :label="0">关闭</Radio>
                                    <Radio :label="1">FTP服务器</Radio>
                                    <Radio :label="2">阿里云OSS</Radio>
                                    <Radio :label="3">七牛云存储</Radio>
                                    <Radio :label="4">腾讯云存储</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="" style="width:60%;" v-if="remoteType == 2">
                                <Row>
                                    <Col>启用阿里oss后，请把/attachment目录（不包括此目录）下的子文件及子目录上传至阿里云oss, 相关工具：</Col>
                                    <Col><a target="_blank" href="http://market.aliyun.com/products/52738003/cmgj000304.html?spm=5176.383663.9.21.faitxp" class="product-grey-font" data-spm-anchor-id="5176.383663.9.21">cloudfs4oss(ECS挂载文件盘工具)</a>
                                    </Col>
                                    <Col><a target="_blank" href="http://market.aliyun.com/products/53690006/cmgj000281.html?spm=5176.383663.9.22.faitxp" class="product-grey-font" data-spm-anchor-id="5176.383663.9.22">官方推荐OSS客户端工具（Windows版）</a></Col>
                                    <Col><a target="_blank" href="http://market.aliyun.com/products/53690006/cmgj000282.html?spm=5176.383663.9.23.faitxp" class="product-grey-font" data-spm-anchor-id="5176.383663.9.23">官方推荐OSS客户端工具（Mac版）</a></Col>
                                    <Col><a target="_blank" href="http://market.aliyun.com/products/53690006/cmgj000208.html?spm=5176.383663.9.24.faitxp" class="product-grey-font" data-spm-anchor-id="5176.383663.9.24">Ftp4ossServer（OSS的FTP云工具）</a></Col>
                                    <Col><a target="_blank" href="http://bbs.aliyun.com/read/239565.html?spm=5176.383663.9.25.faitxp&amp;pos=2" class="product-grey-font" data-spm-anchor-id="5176.383663.9.25">OSS图片服务Demo工具</a></Col>
                                    <Col><a target="_blank" href="http://docs.aliyun.com/?spm=5176.383663.9.26.faitxp#/pub/oss/utilities/osscmd&amp;install" class="product-grey-font" data-spm-anchor-id="5176.383663.9.26">批量上传工具(Python)版</a></Col>
                                    <Col><a target="_blank" href="https://docs.aliyun.com/?spm=5176.383663.9.27.faitxp#/pub/oss/utilities/oss-import&amp;index" class="product-grey-font" data-spm-anchor-id="5176.383663.9.27">OSS数据迁移工具-OSS Import</a></Col>
                                    <Col><a target="_blank" href="http://market.aliyun.com/products/52738004/cmfw000394.html?spm=5176.383663.9.28.faitxp" class="product-grey-font" data-spm-anchor-id="5176.383663.9.28">海量数据迁移至OSS服务</a></Col>
                                    <Col><a target="_blank" href="http://bbs.aliyun.com/read/247023.html?spm=5176.383663.9.29.faitxp" class="product-grey-font" data-spm-anchor-id="5176.383663.9.29">更多官方推荐工具</a></Col>
                                </Row>
                            </FormItem>
                            <FormItem label="" style="width:60%;" v-if="remoteType == 3">
                                <Row>
                                    <Col>启用七牛云存储后，请把/attachment目录（不包括此目录）下的子文件及子目录上传至七牛云存储, 相关工具：</Col>
                                    <Col><a target="_blank" href="https://portal.qiniu.com/signin" class="product-grey-font">七牛云存储</a></Col>
                                </Row>
                            </FormItem>
                            <FormItem label="" style="width:60%;" v-if="remoteType == 4">
                                <Row>
                                    <Col>启用腾讯云cos对象存储后，请把/attachment目录（不包括此目录）下的子文件及子目录上传至腾讯云存储, 相关工具：</Col>
                                    <Col><a target="_blank" href="https://console.qcloud.com/cos/bucket" class="product-grey-font">腾讯云存储</a></Col>
                                </Row>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover v-if="remoteType == 1">
                            <p slot="title">FTP服务器</p>
                            <FormItem label="启用SSL连接" style="width:60%;">
                                <RadioGroup v-model="ftpForm.ssl">
                                    <Radio :label="1">启用</Radio>
                                    <Radio :label="0">关闭</Radio>
                                </RadioGroup>
                                <p>注意：选择是后，FTP 服务器必须开启了 SSL，一般情况选择否即可</p>
                            </FormItem>
                            <FormItem label="FTP服务器地址" style="width:60%;">
                                <Input v-model="ftpForm.host"></Input>
                                <p>可以是 FTP 服务器的 IP 地址或域名</p>
                            </FormItem>
                            <FormItem label="FTP服务器端口" style="width:60%;">
                                <Input v-model="ftpForm.port"></Input>
                                <p>默认为21</p>
                            </FormItem>
                            <FormItem label="FTP帐号" style="width:60%;">
                                <Input v-model="ftpForm.token"></Input>
                                <p>该帐号必须具有以下权限：读取文件、写入文件、删除文件、创建目录、子目录继承</p>
                            </FormItem>
                            <FormItem label="FTP密码" style="width:60%;">
                                <Input v-model="ftpForm.password"></Input>
                                <p>基于安全考虑将只显示 FTP 密码的第一位和最后一位，中间显示八个 * 号</p>
                            </FormItem>
                            <FormItem label="被动模式(pasv)连接" style="width:60%;">
                                <i-switch v-model="ftpForm.pasv" size="large">
                                    <span slot="open">启用</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <p>一般情况下非被动模式即可，如果存在上传失败问题，可尝试打开此设置</p>
                            </FormItem>
                            <FormItem label="远程附件目录" style="width:60%;">
                                <Input v-model="ftpForm.dir"></Input>
                                <p>远程附件目录的绝对路径或相对于 FTP 主目录的相对路径，结尾不要加斜杠 "/" , 例如：/attachment</p>
                            </FormItem>
                            <FormItem label="远程访问URL" style="width:60%;">
                                <Input v-model="ftpForm.url" placeholder=""></Input>
                                <p>支持 HTTP 和 FTP 协议，结尾不要加斜杠 '/' ; 例如：http://mydomin.com/attachment 如果使用 FTP 协议，FTP 服务器必须支持 PASV 模式，为了安全起见， 使用 FTP 连接的帐号不要设置可写权限和列表权限</p>
                            </FormItem>
                            <FormItem label="FTP传输超时时间" style="width:60%;">
                                <Input v-model="ftpForm.overtime"></Input>
                                <p>单位：秒，0为服务器默认</p>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover v-if="remoteType == 2">
                            <p slot="title">内网上传</p>
                            <FormItem label="外网上传" style="width:60%;">
                                <RadioGroup v-model="aliossForm.outer">
                                    <Radio :label="1">启用</Radio>
                                    <Radio :label="0">关闭</Radio>
                                </RadioGroup>
                                <p>是否使用外网上传，外网上传比较慢，但是内网上传要求服务器为阿里云服务器</p>
                            </FormItem>
                            <FormItem label="Access Key ID" style="width:60%;">
                                <Input v-model="aliossForm.key"></Input>
                                <p>Access Key ID是您访问阿里云API的密钥，具有该账户完全的权限，请您妥善保管。</p>
                            </FormItem>
                            <FormItem label="Access Key Secret" style="width:60%;">
                                <Input v-model="aliossForm.secret" @on-blur="getAliossBuckets"></Input>
                                <p>Access Key Secret是您访问阿里云API的密钥，具有该账户完全的权限，请您妥善保管。(填写完Access Key ID 和 Access Key Secret 后请选择bucket)</p>
                            </FormItem>
                            <FormItem label="Bucket选择" style="width:60%;">
                                <Select v-model="aliossForm.bucket">
                                    <Option v-for="(row, index) in aliossBuckets" :key="index" :value="row.name">{{row.loca_name}}</Option>
                                </Select>
                                <p>完善Access Key ID和Access Key Secret资料后可以选择存在的Bucket(请保证bucket为可公共读取的)，否则请手动输入。</p>
                            </FormItem>
                            <FormItem label="转码输出Bucket" style="width:60%;">
                                <Input v-model="aliossForm.outBucket"></Input>
                                <p>转码输出Bucket选择，一般和上面的Bucket相同，请手动输入。</p>
                            </FormItem>
                            <FormItem label="转码管道ID" style="width:60%;">
                                <Input v-model="aliossForm.pipelineId"></Input>
                                <p>转码管道ID。</p>
                            </FormItem>
                            <FormItem label="转码模板ID" style="width:60%;">
                                <Input v-model="aliossForm.transcodeTemplateId"></Input>
                                <p>转码模板ID。</p>
                            </FormItem>
                            <FormItem label="自定义URL" style="width:60%;">
                                <Input v-model="aliossForm.url" placeholder="默认URL不需要填写"></Input>
                                <p>阿里云oss支持用户自定义访问域名，如果自定义了URL则用自定义的URL，如果未自定义，则用系统生成出来的URL。注：自定义url开头加http://或https://结尾不加 ‘/’例：http://abc.com。</p>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover v-if="remoteType == 3">
                            <p slot="title">七牛云存储</p>
                            <FormItem label="Accesskey" style="width:60%;">
                                <Input v-model="qiniuForm.accesskey"></Input>
                                <p>用于签名的公钥。</p>
                            </FormItem>
                            <FormItem label="Secretkey" style="width:60%;">
                                <Input v-model="qiniuForm.secretkey"></Input>
                                <p>用于签名的私钥。</p>
                            </FormItem>
                            <FormItem label="Bucket" style="width:60%;">
                                <Input v-model="qiniuForm.bucket"></Input>
                                <p>请保证bucket为可公共读取的。</p>
                            </FormItem>
                            <FormItem label="转码队列名称" style="width:60%;">
                                <Input v-model="qiniuForm.pipelineName"></Input>
                                <p>多媒体转换队列名称。</p>
                            </FormItem>
                            <FormItem label="自定义URL" style="width:60%;">
                                <Input v-model="qiniuForm.url" placeholder="默认URL不需要填写"></Input>
                                <p>七牛支持用户自定义访问域名。注：url开头加http://或https://结尾不加 ‘/’例：http://abc.com。</p>
                            </FormItem>
                        </Card>
                        <Card :bordered="false" dis-hover v-if="remoteType == 4">
                            <p slot="title">腾讯云存储</p>
                            <FormItem label="APPID" style="width:60%;">
                                <Input v-model="cosForm.appid"></Input>
                                <p>APPID 是您项目的唯一ID。</p>
                            </FormItem>
                            <FormItem label="SecretID" style="width:60%;">
                                <Input v-model="cosForm.secretid"></Input>
                                <p>SecretID 是您项目的安全秘钥，具有该账户完全的权限，请妥善保管。</p>
                            </FormItem>
                            <FormItem label="SecretKEY" style="width:60%;">
                                <Input v-model="cosForm.secretkey"></Input>
                                <p>SecretKEY 是您项目的安全秘钥，具有该账户完全的权限，请妥善保管。</p>
                            </FormItem>
                            <FormItem label="Bucket" style="width:60%;">
                                <Input v-model="cosForm.bucket"></Input>
                                <p>请保证bucket为可公共读取的。</p>
                            </FormItem>
                            <FormItem label="bucket所在区域">
                                <Select v-model="cosForm.local">
                                    <Option value="tj">华北</Option>
                                    <Option value="sh">华东</Option>
                                    <Option value="gz">华南</Option>
                                </Select>
                                <p>选择bucket对应的区域，如果没有选择无</p>
                            </FormItem>
                            <FormItem label="自定义URL" style="width:60%;">
                                <Input v-model="cosForm.url" placeholder="默认URL不需要填写"></Input>
                                <p>腾讯云支持用户自定义访问域名。注：url开头加http://或https://结尾不加 ‘/’例：http://abc.com。</p>
                            </FormItem>
                        </Card>
                        <FormItem>
                            <Button type="primary" @click="saveConfig">保存配置</Button>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
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
        },
        userInfo() {
            return this.$store.state.user.userInfo
        }
    },
    data() {
        return {
            upload_max_filesize: 0,
            post_max_size: 0,
            upload: {
                image: {
                    thumb: 0,
                    width: 0,
                    extentions: [],
                    limit: 0
                },
                audio: {
                    extentions: [],
                    limit: 0
                },
                video: {
                    extentions: [],
                    limit: 0
                },
                file: {
                    extentions: [],
                    limit: 0
                },
            },
            remoteType: 0,
            ftpForm: {
                ssl: 0,
                host: '',
                port: '',
                token: '',
                password: '',
                pasv: 0,
                dir: '',
                url: '',
                overtime: 0

            },
            aliossBuckets: [],
            aliossForm: {
                key: '',
                secret: '',
                bucket: '',
                outBucket: '',
                pipelineId: '',
                transcodeTemplateId: '',
                url: '',
                outer: 0
            },
            qiniuForm: {

            },
            cosForm: {

            }
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=attachment&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.upload = data.data.upload;
                        if (is.empty(_this.upload.image)) {
                            _this.$set(_this.upload, 'image', {
                                thumb: 0,
                                width: 0,
                                extentions: [],
                                limit: 0
                            });
                        }
                        if (is.empty(_this.upload.audio)) {
                            _this.$set(_this.upload, 'audio', {
                                extentions: [],
                                limit: 0
                            });
                        }
                        if (is.empty(_this.upload.video)) {
                            _this.$set(_this.upload, 'video', {
                                extentions: [],
                                limit: 0
                            });
                        }
                        if (is.empty(_this.upload.file)) {
                            _this.$set(_this.upload, 'file', {
                                extentions: [],
                                limit: 0
                            });
                        }
                        _this.upload_max_filesize = data.data.upload_max_filesize;
                        _this.post_max_size = data.data.post_max_size;
                        _this.remoteType = data.data.remote.type;
                        _this.ftpForm = data.data.remote.ftp;
                        _this.aliossForm = data.data.remote.alioss;
                        _this.qiniuForm = data.data.remote.qiniu;
                        _this.cosForm = data.data.remote.cos;
                        _this.$Message.success(data.message);
                        _this.getAliossBuckets();
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        imageSuffixAdd(e) {
            let _this = this;
            if (is.empty(_this.upload.image.extentions)) {
                _this.$set(_this.upload.image, 'extentions', []);
            }
            _this.upload.image.extentions.push(e.target.value);
            e.target.value = '';
        },
        imageSuffixClose(event, name) {
            let _this = this;
            const index = _this.upload.image.extentions.indexOf(name);
            _this.upload.image.extentions.splice(index, 1);

        },
        audioSuffixAdd(e) {
            let _this = this;
            if (is.empty(_this.upload.audio.extentions)) {
                _this.$set(_this.upload.audio, 'extentions', []);
            }
            _this.upload.audio.extentions.push(e.target.value);
            e.target.value = '';
        },
        audioSuffixClose(event, name) {
            let _this = this;
            const index = _this.upload.audio.extentions.indexOf(name);
            _this.upload.audio.extentions.splice(index, 1);

        },
        videoSuffixAdd(e) {
            let _this = this;
            if (is.empty(_this.upload.video.extentions)) {
                _this.$set(_this.upload.video, 'extentions', []);
            }
            _this.upload.video.extentions.push(e.target.value);
            e.target.value = '';
        },
        videoSuffixClose(event, name) {
            let _this = this;
            const index = _this.upload.video.extentions.indexOf(name);
            _this.upload.video.extentions.splice(index, 1);

        },
        fileSuffixAdd(e) {
            let _this = this;
            if (is.empty(_this.upload.file.extentions)) {
                _this.$set(_this.upload.file, 'extentions', []);
            }
            _this.upload.file.extentions.push(e.target.value);
            e.target.value = '';
        },
        fileSuffixClose(event, name) {
            let _this = this;
            const index = _this.upload.file.extentions.indexOf(name);
            _this.upload.file.extentions.splice(index, 1);

        },
        saveGlobal() {
            let _this = this;
            console.log(_this.upload);
            Utils.ajax.post('api.php?entry=sys&c=system&a=attachment&do=global', {
                    token: _this.token,
                    upload: _this.upload
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        getAliossBuckets() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=attachment&do=buckets', {
                    token: _this.token,
                    key: _this.aliossForm.key,
                    secret: _this.aliossForm.secret
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.aliossBuckets = data.data;
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错,请检查Access Key ID 或 Access Key Secret');
                });
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=attachment&do=remote', {
                    token: _this.token,
                    type: _this.remoteType,
                    ftp: _this.ftpForm,
                    alioss: _this.aliossForm,
                    qiniu: _this.qiniuForm,
                    cos: _this.cosForm
                })
                .then((response) => {
                    let data = response.data;
                    if (data.status == 1) {
                        _this.$Message.success(data.message);
                    } else {
                        _this.$Message.error(data.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        }
    },
    mounted() {
        let _this = this;
        _this.init();
    }
};
</script>
