<template>
    <div style="background:#fff;">
        <Card>
            <p slot="title">邮件通知选项</p>
            <Form :label-width="150">
                <FormItem label="STMP服务器" style="width:60%;">
                    <RadioGroup v-model="smtp.type">
                        <Radio label="163">网易邮箱服务器（建议使用）</Radio>
                        <Radio label="qq">qq邮箱服务器</Radio>
                        <Radio label="custom">自定义</Radio>
                    </RadioGroup>
                </FormItem>
                <div v-if="smtp.type == 'custom'">
                    <FormItem label="SMTP服务器地址" style="width:60%;">
                        <Input v-model="smtp.server"></Input>
                        <p>指定SMTP服务器的地址</p>
                    </FormItem>
                    <FormItem label="SMTP服务器端口" style="width:60%;">
                        <Input v-model="smtp.port"></Input>
                        <p>指定SMTP服务器的端口</p>
                    </FormItem>
                    <FormItem label="使用SSL加密" style="width:60%;">
                        <i-switch v-model="smtp.authmode" size="large">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                        <p>开启此项后，连接将用SSL的形式，此项需要SMTP服务器支持</p>
                    </FormItem>
                </div>
                <FormItem label="发送帐号用户名" style="width:60%;">
                    <Input v-model="username"></Input>
                    <p>指定发送邮件的用户名，例如：test@163.com</p>
                </FormItem>
                <FormItem label="smtp客户端授权密码" style="width:60%;">
                    <Input v-model="password" placeholder=""></Input>
                    <p>指定发送邮件的密码，QQ邮箱此处为授权码，<a href="http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256" target="_Blank">查看授权码获取方法</a></p>
                </FormItem>
                <FormItem label="发件人名称" style="width:60%;">
                    <Input v-model="sender"></Input>
                    <p>指定发送邮件发信人名称</p>
                </FormItem>
                <FormItem label="邮件签名" style="width:60%;">
                    <Input v-model="signature"></Input>
                    <p>指定邮件末尾添加的签名信息</p>
                </FormItem>
                <FormItem label="测试接收人" style="width:60%;">
                    <Input v-model="receiver"></Input>
                    <p>你可以指定一个收件邮箱, 系统将在保存参数成功后尝试发送一条测试性的邮件, 来检测邮件通知是否正常工作</p>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="saveConfig">保存配置</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script>
import Utils from '@/utils';
import store from '@/store';

export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            smtp: {
                type: 1,
                server: '',
                port: '',
                authmode: 0
            },
            username: '',
            password: '',
            sender: '',
            signature: '',
            receiver: ''
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=email&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    let res = response.data;
                    if (res.status == 1) {
                        _this.smtp = res.data.smtp || {};
                        _this.username = res.data.username;
                        _this.password = res.data.password;
                        _this.sender = res.data.sender;
                        _this.signature = res.data.signature;
                    } else {
                        _this.$Message.error(res.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=system&a=email&do=save', {
                    token: _this.token,
                    smtp: _this.smtp,
                    username: _this.username,
                    password: _this.password,
                    sender: _this.sender,
                    signature: _this.signature,
                    receiver: _this.receiver
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
