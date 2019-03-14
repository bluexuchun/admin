import CommonIcon from '_c/common-icon'
export default {
    components: {
        CommonIcon
    },
    methods: {
        showTitle(item) {
            return this.$config.useI18n ? this.$t(item.name) : ((item.meta && item.meta.title) || item.name)
        },
        showChildren(item, number = 1) {
            return item.children && ((item.children.length > number) || (item.meta && item.meta.showAlways))
        },
        getNameOrHref(item, children0) {
            return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
        }
    }
}