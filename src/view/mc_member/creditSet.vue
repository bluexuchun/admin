<template>
    <Card>
        <p slot="title">
            <Icon type="pinpoint"></Icon>
            积分设置
        </p>
        <Form :label-width="20" style="width: 600px">
            <FormItem>
                <Row>
                    <Col span="8"> 是否启用
                    </Col>
                    <Col span="8"> 积分字段
                    </Col>
                    <Col span="8"> 积分名称
                    </Col>
                </Row>
            </FormItem>
            <FormItem v-for="(row, index) in credits" :key="index">
                <Row>
                    <Col span="8">
                    <i-switch v-model="enabled[index]" true-value="1" false-value="0"></i-switch>
                    </Col>
                    <Col span="8"> {{index}}
                    </Col>
                    <Col span="8">
                    <Input v-model="title[index]" style="width: 300px"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="saveConfig">保存</Button>
            </FormItem>
        </Form>
    </Card>
</template>
<script>
import Utils from '@/utils';
import is from 'is';
import store from '@/store';
export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            credits: {},
            enabled: {
                credit1: false,
                credit2: false,
                credit3: false,
                credit4: false,
                credit5: false,
            },
            title: {
                credit1: '',
                credit2: '',
                credit3: '',
                credit4: '',
                credit5: ''
            }
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=creditSet&do=display', {
                    token: _this.token
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.credits = rs.data;
                        for (let i in rs.data) {
                            _this.$set(_this.enabled, i, rs.data[i].enabled);
                            _this.$set(_this.title, i, rs.data[i].title);
                        }
                        console.log(_this.enabled);
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        saveConfig() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=creditSet&do=save', {
                    token: _this.token,
                    title: _this.title,
                    enabled: _this.enabled
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        _this.$Message.success(rs.message);
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        }
    },
    mounted() {
        let _this = this;
        _this.$nextTick(function() {
            _this.init();
        })
    }
}
</script>
