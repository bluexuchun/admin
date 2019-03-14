<style lang="less">
@import './login.less';
</style>
<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                </div>
            </Card>
        </div>
    </div>
</template>
<script>
import LoginForm from '_c/login-form'
import {
    initRouter
} from '@/libs/util'
import {
    mapActions
} from 'vuex'
export default {
    components: {
        LoginForm
    },
    methods: {
        ...mapActions([
            'handleLogin'
        ]),
        handleSubmit({
            username,
            password
        }) {
            let _this = this
            _this.handleLogin({
                username,
                password
            }).then(res => {
                console.log(res)
                _this.$Message.success(res.message);
                initRouter(_this);
                _this.$router.push({
                    name: 'home'
                })
            }).catch(res => {
                _this.$Message.error(res.message);
            })
        }
    }
}
</script>
<style>
</style>
