<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="qrcodeForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">二维码信息</p>
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
                    <FormItem label="描述" style="width:60%;">
                        <Input type="textarea" v-model="detail.description"></Input>
                    </FormItem>
                    <FormItem label="内容" style="width:60%;">
                        <Input v-model="detail.content"></Input>
                        <p>请填写需要跳转的链接</p>
                    </FormItem>
                    <FormItem label="二维码" style="width:60%;" class="qrcode" v-if="qrcodeShow">
                        <qrcode :value="detail.qrcode" :options="{ width: 3000 }"></qrcode>
                    </FormItem>
                </Card>
                <FormItem style="margin-top:30px;">
                    <Button type="primary" @click="saveConfig">保存设置</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
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
            detail: {},
            qrcodeShow: false
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=qrcode&a=edit&do=display', {
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
        saveConfig() {
            let _this = this;
            _this.$Spin.show();
            _this.qrcodeShow = false;
            Utils.ajax.post('api.php?entry=sys&c=qrcode&a=edit&do=post', {
                    token: _this.token,
                    id: _this.id,
                    qrcode: _this.detail
                })
                .then((response) => {
                    _this.$Spin.hide();
                    let res = response.data;
                    if (res.status == 1) {
                        _this.detail = res.data;
                        _this.id = _this.detail.id;
                        _this.qrcodeShow = true;
                        _this.$Message.success(res.message);
                    } else {
                        _this.$Message.error(res.message);
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
<style lang="less">
.qrcode {
    canvas {
        width: 200px!important;
        height: 200px!important;
    }
}
</style>
