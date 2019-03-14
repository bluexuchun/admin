// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import hasPermission from '@/libs/hasPermission';
import {
    initRouter
} from '@/libs/util'
import './index.less'
import '@/assets/icons/iconfont.css'
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {
    VTable,
    VPagination
} from 'vue-easytable'
// 注册到全局
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)
import iviewArea from 'iview-area'
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(iviewArea)
Vue.use(hasPermission)
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App),
    mounted() {
        // 初始化菜单
        initRouter(this);
    }
})