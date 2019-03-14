const hasPermission = {
    install(Vue, options) {
        Vue.directive('has', {
            bind(el, binding, vnode) {
                let button_permissions = vnode.context.$route.meta.button_permissions;
                console.log(button_permissions)
                if (!button_permissions || !button_permissions.find(function(x) {
                        console.log(x, binding.value)
                        return x === binding.value;
                    })) {
                    console.log('没有')
                    el.parentNode.removeChild(el);
                }
            }
        });
    }
};
export default hasPermission;