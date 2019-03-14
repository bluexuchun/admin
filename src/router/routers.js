import Main from '@/view/main/index.vue'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */
export default [{
    ignore: true,
    path: '/login',
    name: 'login',
    meta: {
        title: '登录',
        hideInMenu: true
    },
    component: () =>
        import ('@/view/login/login.vue')
}, {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: Main,
    meta: {
        title: '首页',
        hideInMenu: true,
        notCache: true
    },
    children: [{
        path: '/home',
        name: 'home_index',
        meta: {
            hideInMenu: true,
            title: '首页',
            notCache: true
        },
        component: () =>
            import ('@/view/home/index.vue')
    }]
},{
    ignore: true,
    path: '/401',
    name: 'error_401',
    meta: {
        hideInMenu: true
    },
    component: () =>
        import ('@/view/error-page/401.vue')
}, {
    ignore: true,
    path: '/500',
    name: 'error_500',
    meta: {
        hideInMenu: true
    },
    component: () =>
        import ('@/view/error-page/500.vue')
}]