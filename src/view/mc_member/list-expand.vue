<template>
    <Table :columns="columns" :data="children"></Table>
</template>
<script>
import Utils from '@/utils';
import is from 'is';
import store from '@/store';
export default {

    props: {
        children: Array
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            columns: [{
                title: ' ',
                width: 30
            }, {
                title: 'client_openid',
                key: 'client_openid',
                width: 250,
                align: 'center',
            }, {
                title: 'mina_openid',
                key: 'mina_openid',
                width: 250,
                align: 'center',
            }, {
                title: '会员卡号',
                key: 'vipcard',
                width: 100,
                align: 'center',
            }, {
                title: '身份证号',
                width: 160,
                align: 'center',
                render: (h, params) => {
                    let idcard = params.row.idcard;
                    return h('div', idcard);
                }
            }, ]
        }
    }
}
</script>
