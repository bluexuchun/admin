import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    routeHasExist
} from '@/libs/util'
import routers from '@/router/routers'
import router from '@/router/index';
import is from 'is';
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    if (!is.empty(value) && value != 'undefined') {
        return JSON.parse(value);
    } else {
        return null;
    }
}
export default {
    state: {
        menuList: localStorage.getObject('menuList'),
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: getHomeRoute(routers),
        local: ''
    },
    mutations: {
        // 动态添加主界面路由，需要缓存
        updateAppRouter(state, routes) {
            router.addRoutes(routes);
        },
        // 动态添加全局路由，不需要缓存
        updateDefaultRouter(state, routes) {
            router.addRoutes(routes);
        },
        updateMenulist(state, routes) {
            localStorage.setObject('menuList', routes);
            state.menuList = routes;
        },
        setBreadCrumb(state, routeMetched) {
            state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
        },
        setTagNavList(state, list) {
            if (list) {
                state.tagNavList = [...list]
                setTagNavListInLocalstorage([...list])
            } else state.tagNavList = getTagNavListFromLocalstorage()
        },
        addTag(state, {
            route,
            type = 'unshift'
        }) {
            if (!routeHasExist(state.tagNavList, route)) {
                if (type === 'push') state.tagNavList.push(route)
                else {
                    if (route.name === 'home') state.tagNavList.unshift(route)
                    else state.tagNavList.splice(1, 0, route)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },
        setLocal(state, lang) {
            state.local = lang
        }
    }
}