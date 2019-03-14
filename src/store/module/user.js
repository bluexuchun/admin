import {
    login,
    logout,
    getUserInfo
} from '@/api/user'
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
        token: localStorage.getObject('token'),
        userInfo: localStorage.getObject('userInfo') || {
            profile: []
        }
    },
    mutations: {
        set_token(state, token) {
            localStorage.setObject('token', token);
            state.token = token;
        },
        set_userInfo(state, userInfo) {
            localStorage.setObject('userInfo', userInfo);
            state.userInfo = userInfo;
        }
    },
    actions: {
        // 登录
        handleLogin({
            commit
        }, {
            username,
            password
        }) {
            username = username.trim()
            return new Promise((resolve, reject) => {
                login({
                    username,
                    password
                }).then(res => {
                    const data = res.data
                    if (data.status == 1) {
                        commit('set_userInfo', data.data.userInfo)
                        commit('set_token', data.data.token)
                        resolve(data)
                    } else {
                        reject(data)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 退出登录
        handleLogOut({
            state,
            commit
        }) {
            return new Promise((resolve, reject) => {
                commit('setTagNavList', [])
                commit('set_userInfo', {})
                commit('set_token', '')
                resolve()
            })
        }
    }
}