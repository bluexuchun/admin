<template>
    <div style="background:#fff;">
        <Row>
            <Col>
            <Form ref="roleForm" :label-width="150">
                <Card :bordered="false" dis-hover>
                    <p slot="title">角色信息</p>
                    <FormItem label="排序" style="width:60%;">
                        <Input v-model="detail.displayorder"></Input>
                    </FormItem>
                    <FormItem label="角色名称" style="width:60%;">
                        <Input v-model="detail.title"></Input>
                    </FormItem>
                    <FormItem label="描述" style="width:60%;">
                        <Input v-model="detail.description" type="textarea"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="saveConfig">保存</Button>
                    </FormItem>
                </Card>
            </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
import Utils from '@/utils';
import store from '@/store';
import is from 'is';
export default {
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            id: this.$route.params.id,
            detail: [],
            previewUrl: '',
            visible: false,
            memberRoleList: []
        };
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=role&do=display', {
                    token: _this.token,
                    id: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            _this.detail = rs.data.detail || [];
                            _this.memberRoleList = rs.data.role;
                        }
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
            Utils.ajax.post('api.php?entry=sys&c=mc_member&a=role&do=post', {
                    token: _this.token,
                    id: _this.id,
                    role: _this.detail
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
    mounted: function() {
        let _this = this;
        _this.$nextTick(function() {
            _this.init();
        });
    }
};
</script>
