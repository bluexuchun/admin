import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
Vue.use(Router)
const router = new Router({
    routes
})
export default router
const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    const token = store.state.user.token
    if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })
    } else if (to.name === LOGIN_PAGE_NAME) {
        //要跳转的页面是登录页
        next() // 跳转
    } else {
        if (to.name == 'error_401' || to.name == 'error_404' || to.name == 'error_500' || true) {
            next()
        } // 有权限，可访问
        else next({
            replace: true,
            name: 'error_401'
        }) // 无权限，重定向到401页面
    }
})
router.afterEach(to => {
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})