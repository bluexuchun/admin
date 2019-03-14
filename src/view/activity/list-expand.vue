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
                title: '场景链接',
                key: 'signs',
                align: 'center',
                type: 'html'
            }, ]
        }
    }
}
</script>
