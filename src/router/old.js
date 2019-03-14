import Main from '@/view/main/index.vue'
import parentView from '@/components/parent-view'
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
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/system',
    name: 'system',
    meta: {
        title: '系统设置',
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'site',
        meta: {
            title: '站点设置',
        },
        name: 'system_site',
        component: resolve => {
            require(['@/view/system/site.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'attachment',
        meta: {
            title: '附件设置',
        },
        name: 'system_attachment',
        component: resolve => {
            require(['@/view/system/attachment.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'payment',
        meta: {
            title: '支付设置',
        },
        name: 'system_payment',
        component: resolve => {
            require(['@/view/system/payment.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'wechat',
        meta: {
            title: '微信设置',
        },
        name: 'system_wechat',
        component: resolve => {
            require(['@/view/system/wechat.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'sms',
        meta: {
            title: '短信设置',
        },
        name: 'system_sms',
        component: resolve => {
            require(['@/view/system/sms.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'email',
        meta: {
            title: '邮箱设置',
        },
        name: 'system_email',
        component: resolve => {
            require(['@/view/system/email.vue'], resolve);
        }
    }]
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
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
        check: false,
        showInMain: false,
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
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/permission-manage',
    name: 'permission_manage',
    meta: {
        title: '权限配置'
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'index',
        meta: {
            title: '权限配置'
        },
        name: 'permission_manage_index',
        component: resolve => {
            require(['@/view/permission-manage/index.vue'], resolve);
        }
    }]
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/role',
    name: 'role',
    meta: {
        title: '管理员分组'
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'list',
        meta: {
            title: '分组列表'
        },
        name: 'role_list',
        component: resolve => {
            require(['@/view/role/list.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: false,
        path: 'edit/:id',
        meta: {
            title: '编辑分组'
        },
        name: 'role_edit',
        component: resolve => {
            require(['@/view/role/edit.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: false,
        path: 'permission/:id',
        meta: {
            title: '分组权限'
        },
        name: 'role_permission',
        component: resolve => {
            require(['@/view/role/permission.vue'], resolve);
        }
    }]
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/user',
    name: 'user',
    meta: {
        title: '管理员'
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'list',
        meta: {
            title: '管理员列表'
        },
        name: 'user_list',
        component: resolve => {
            require(['@/view/user/list.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: false,
        path: 'edit/:sys_uid',
        meta: {
            title: '编辑管理员'
        },
        name: 'user_edit',
        component: resolve => {
            require(['@/view/user/edit.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'profile',
        name: 'user_profile',
        meta: {
            title: '个人中心'
        },
        component: resolve => {
            require(['@/view/user/profile.vue'], resolve);
        }
    }]
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/mc_member',
    name: 'mc_member',
    meta: {
        title: '用户管理'
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'user/list',
        meta: {
            title: '角色列表'
        },
        name: 'mc_member_user_list',
        component: resolve => {
            require(['@/view/mc_member-role/list.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: false,
        path: 'user/edit/:id',
        meta: {
            title: '编辑角色'
        },
        name: 'mc_member_user_edit',
        component: resolve => {
            require(['@/view/mc_member-role/edit.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'list',
        name: 'mc_member_list',
        meta: {
            title: '用户列表'
        },
        component: resolve => {
            require(['@/view/mc_member/list.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: false,
        path: 'edit/:uid',
        meta: {
            title: '编辑用户'
        },
        name: 'mc_member_edit',
        component: resolve => {
            require(['@/view/mc_member/edit.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: false,
        path: 'creditManage/:uid',
        meta: {
            title: '积分管理'
        },
        name: 'mc_member_credit_manage',
        component: resolve => {
            require(['@/view/mc_member/creditManage.vue'], resolve);
        }
    }, {
        check: false,
        showInMain: true,
        path: 'creditSet',
        meta: {
            title: '积分设置'
        },
        name: 'mc_member_credit_set',
        component: resolve => {
            require(['@/view/mc_member/creditSet.vue'], resolve);
        }
    }]
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/settings',
    name: 'settings',
    meta: {
        title: '商城设置',
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'base',
        meta: {
            title: '基础设置',
        },
        name: 'settings_base',
        component: resolve => {
            require(['@/view/settings/base.vue'], resolve);
        },
        component: parentView,
        children: [{
            check: false,
            showInMain: true,
            path: 'base',
            meta: {
                title: '基础设置',
            },
            name: 'settings_base1',
            component: resolve => {
                require(['@/view/settings/base.vue'], resolve);
            }
        }]
    }]
}, {
    indeterminate: false,
    checkAll: false,
    showInMain: true,
    path: '/multilevel',
    name: 'multilevel',
    meta: {
        icon: 'md-menu',
        title: '多级菜单'
    },
    component: Main,
    children: [{
        check: false,
        showInMain: true,
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
            icon: 'md-funnel',
            showAlways: true,
            title: '二级-2'
        },
        component: parentView,
        children: [{
            check: false,
            showInMain: true,
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
                icon: 'md-funnel',
                title: '三级'
            },
            component: () =>
                import ('@/view/multilevel/level-2-2/level-3-1.vue')
        }, {
            check: false,
            showInMain: true,
            path: 'level_2_2_1_2',
            name: 'level_2_2_1_2',
            meta: {
                icon: 'md-funnel',
                title: '三级'
            },
            component: () =>
                import ('@/view/multilevel/level-2-2/level-3-1.vue')
        }]
    }]
}, {
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
}, {
    ignore: true,
    path: '*',
    name: 'error_404',
    meta: {
        hideInMenu: true
    },
    component: () =>
        import ('@/view/error-page/404.vue')
}]