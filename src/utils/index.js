import Vue from 'vue';
import axios from 'axios';
import Qs from 'qs';
import is from 'is';
import store from '@/store';
import config from '@/config'
let util = {};
util.title = function(title) {
    title = title || '管理后台';
    window.document.title = title;
};
util.baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
util.ajax = axios.create({
    baseURL: util.baseUrl,
    timeout: 30000,
    transformRequest: [function(data) {
        data = Qs.stringify(data);
        return data;
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});
util.isArray = function(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    } else {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
};
util.inArray = function(arr, key, value) { //多维数组判断是否存在某值
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) { //判断是否为多维数组
            return util.inArray(arr[i], key, value);
        } else {
            if (key != '') {
                if (arr[i][key] == value) {
                    return i; //存在
                }
            } else {
                if (arr[i] == value) {
                    return i; //存在
                }
            }
        }
    }
    return -1; //不存在
}
util.inOf = function(arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};
util.oneOf = function(ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};
util.passThisRoute = function(role, routeName) {
    if (is.empty(role)) {
        return -1;
    } else if (!util.isArray(role)) {
        return Object.keys(role).indexOf(routeName);
    } else {
        return role.indexOf(routeName);
    }
};
util.showThisRoute = function(itAccess, currentAccess) {
    if (typeof itAccess === 'object' && itAccess.isArray()) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};
util.notCheckRoute = function(routeName) {
    let routers = ['login', 'error_404', 'error_401', 'error_500', 'preview', 'locking'];
    console.log('不检测权限页面:' + routeName + ',' + util.inArray(routers, '', routeName));
    if (util.inArray(routers, '', routeName) > -1) {
        return true;
    }
    return false;
};
util.checkRouterAccess = function(role, name) {
    console.log(role, name);
    for (var i in role) {
        if (i == name) {
            return true;
        }
        if (!is.empty(role[i])) {
            for (var j = 0; j < role[i].length; j++) {
                if (role[i][j] == name) {
                    return true;
                }
            }
        }
    }
    return false;
};
util.getRouterObjByName = function(routers, name) {
    let routerObj = {};
    routers.forEach(item => {
        if (item.name === 'otherRouter') {
            item.children.forEach((child, i) => {
                if (child.name === name) {
                    routerObj = item.children[i];
                }
            });
        } else {
            if (item.children.length === 1) {
                if (item.children[0].name === name) {
                    routerObj = item.children[0];
                }
            } else {
                item.children.forEach((child, i) => {
                    if (child.name === name) {
                        routerObj = item.children[i];
                    }
                });
            }
        }
    });
    return routerObj;
};
util.handleTitle = function(vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};
util.setCurrentPath = function(vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [{
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
            path: '',
            name: 'home_index'
        }];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [{
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
            path: '/home',
            name: 'home_index'
        }, {
            title: title,
            path: '',
            name: name
        }];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [{
                title: '首页',
                path: '',
                name: 'home_index'
            }];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [{
                title: '首页',
                path: '/home',
                name: 'home_index'
            }, {
                title: currentPathObj.title,
                path: '',
                name: name
            }];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [{
                title: '首页',
                path: '/home',
                name: 'home_index'
            }, {
                title: currentPathObj.title,
                path: '',
                name: currentPathObj.name
            }, {
                title: childObj.title,
                path: currentPathObj.path + '/' + childObj.path,
                name: name
            }];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);
    return currentPathArr;
};
util.openNewPage = function(vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};
util.toDefaultPage = function(routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};
util.fullscreenEvent = function(vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};
util.updateUserInfo = function() {
    let token = store.state.user.token;
    util.ajax.post('api.php?entry=sys&c=user&a=profile&do=display', {
        token: token
    }).then((response) => {
        let rs = response.data;
        if (rs.status == 1) {
            store.commit('set_token', rs.data.token);
            store.commit('set_userInfo', rs.data.userInfo);
        } else {
            Vue.prototype.$Message.error(rs.message);
        }
    }).catch((response) => {
        _this.$Message.error('获取数据出错');
    });;
};
util.uploadHandle = function(files, type, func, maxnum = 100) {
    var _this = this;
    console.log(files);
    if (files.length > maxnum) {
        Vue.prototype.$Message.error('上传数量超出限制');
    }
    if (files.length > 0) {
        let filesArray = [];
        for (let i = 0, len = files.length; i < len; i++) {
            let file = files[i];
            filesArray.push(uploadFunction(file));
        }
        var uploadPromises = filesArray;
        var sequence = Promise.resolve();
        uploadPromises.forEach(function(curPromise) {
            sequence = sequence.then(function() {
                return curPromise;
            }).then(function(url) {
                func(url);
                Vue.prototype.$Loading.finish();
            }).catch(function(err) {
                console.log(err);
                Vue.prototype.$Loading.finish();
                Vue.prototype.$Message.error(err);
            });
        });
    }

    function uploadFunction(file) {
        return new Promise(function(resolve, reject) {
            Vue.prototype.$Loading.start();
            let token = store.state.user.token;
            var uri = encodeURI(util.baseUrl + 'api.php?entry=sys&c=utility&a=file&do=upload&type=' + type + '&token=' + token);
            var fd = new FormData();
            fd.append("file", file); //文件追到到FormData
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener("load", function(evt) {
                var resp = eval('(' + evt.target.responseText + ')');
                if (resp.status == '1') {
                    resolve(resp.data.url);
                } else {
                    reject(resp.message);
                }
            }, false);
            xhr.addEventListener("error", uploadFailed, false);
            xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open("POST", uri);
            xhr.send(fd);
        })
    }
    //图片上传进度
    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            console.log(percentComplete)
        } else {}
    }

    function uploadFailed(evt) {
        alert("上传失败");
    }

    function uploadCanceled(evt) {
        // alert("已经取消上传");
    }
};
util.uploader = function(files, type = 'image', ele, successFn, errorFn) {
    var _self = this;
    Promise.resolve().then(function() {
        util.uploadHandle(files, type, function(url) {
            if (is.function(successFn)) {
                successFn(url);
            }
        });
    }).then(function() {
        _clearInputFile(ele);
    }).catch(function(err) {
        console.log(err);
    });

    function _clearInputFile(ele) {
        var fileInput = ele;
        if (fileInput.value) {
            try {
                fileInput.value = '';
            } catch (e) {}
            if (fileInput.value) {
                var form = document.createElement('form'),
                    brother = fileInput.nextSibling,
                    parent = fileInput.parentNode;
                form.appendChild(fileInput);
                form.reset();
                parent.insertBefore(fileInput, brother);
            }
        }
    }
};
util.remoteLoad = function(url, hasCallback) {
    return createScript(url)
    /**
     * 创建script
     * @param url
     * @returns {Promise}
     */
    function createScript(url) {
        var scriptElement = document.createElement('script')
        document.body.appendChild(scriptElement)
        var promise = new Promise((resolve, reject) => {
            scriptElement.addEventListener('load', e => {
                removeScript(scriptElement)
                if (!hasCallback) {
                    resolve(e)
                }
            }, false)
            scriptElement.addEventListener('error', e => {
                removeScript(scriptElement)
                reject(e)
            }, false)
            if (hasCallback) {
                window.____callback____ = function() {
                    resolve()
                    window.____callback____ = null
                }
            }
        })
        if (hasCallback) {
            url += '&callback=____callback____'
        }
        scriptElement.src = url
        return promise
    }
    /**
     * 移除script标签
     * @param scriptElement script dom
     */
    function removeScript(scriptElement) {
        document.body.removeChild(scriptElement)
    }
};
export default util;