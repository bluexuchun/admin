<template>
    <div style="background:#fff;">
        <Form ref="paymentForm" :label-width="150">
            <Tabs>
                <TabPane label="粉丝详情" name="basic">
                    <Row>
                        <Col>
                        <Card :bordered="false" dis-hover>
                            <p slot="title">粉丝详情</p>
                            <FormItem label="粉丝昵称" style="width:60%;">
                                <Input v-model="nickname" disabled></Input>
                            </FormItem>
                            <FormItem label="粉丝头像">
                                <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="avatar">
                                    <img :src="avatar">
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="viewPicture()"></Icon>
                                    </div>
                                </div>
                                <label v-else class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;">
                                    <input type="file" style="display:none;" @change="_onChange($event, 'images',0,'grade_photo')">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </label>
                            </FormItem>
                            <FormItem label="粉丝等级" style="width:60%;">
                                <Input v-model="grade" disabled></Input>
                            </FormItem>
                            <FormItem label="粉丝签到记录" style="width:60%;">
                                <Table :height="300" :loading="loading" border :columns="sign_columns" :data="signList"></Table>
                            </FormItem>
                            <FormItem label="粉丝完成记录" style="width:60%;">
                                <Table :height="300" :loading="loading" border :columns="task_columns" :data="taskList"></Table>
                            </FormItem>
                        </Card>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </Form>
        <Modal title="图片预览" v-model="visible">
            <img :src="previewUrl" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
import Utils from '@/utils';
import store from '@/store';
import is from 'is';
import Vue from 'vue';
import ueditor from '_c/editor/ueditor.vue';
export default {
    components: {
        ueditor
    },
    data() {
        return {
            id: this.$route.params.id,
            bid: this.$route.params.bid,
            previewUrl: '',
            visible: false,
            loading: false,
            nickname:'',
            avatar:'',
            grade:'',
            signList:[],
            taskList:[],
            sign_columns: [{
                title: '签到等级',
                key: 'grade',
                width: 200,
                align: 'center',
            }, {
                title: '签到时间',
                key: 'createtime',
                width: 200,
                align: 'center',
            }],
            task_columns: [{
                title: '完成任务等级',
                key: 'grade',
                width: 200,
                align: 'center',
            }, {
                title: '完成任务时间',
                key: 'createtime',
                width: 200,
                align: 'center',
            }, {
                title: '核销人员',
                key: 'action',
                width: 200,
                align: 'center',
                render: (h, params) => {
                    let _this = this;
                    return h('div', [
                        h('Avatar',{
                            props:{
                                src:params.row.verf_avatar
                            }
                        }),
                        h('div',{
                            props:{
                                src:params.row.verf_nickname
                            }
                        })
                    ]);
                }
            }],
        };
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=business&a=fans&do=fansDetail', {
                    token: _this.token,
                    bid: _this.bid,
                    uid: _this.id
                })
                .then((response) => {
                    let rs = response.data;
                    if (rs.status == 1) {
                        if (!is.empty(rs.data)) {
                            let data = rs.data
                            if(data.length > 0){
                                _this.nickname = data[0].member.nickname
                                _this.avatar = data[0].member.avatar
                                _this.grade = data[0].grade
                                data.map((v,i) => {
                                    if(v.wid){
                                        _this.taskList.push({
                                            createtime:v.createtime,
                                            verf_nickname:v.wmember.nickname,
                                            verf_avatar:v.wmember.avatar,
                                            grade:v.grade
                                        })
                                    }else{
                                        _this.signList.push({
                                            createtime:v.createtime,
                                            grade:v.grade
                                        })
                                    }
                                    
                                })
                            }
                            
                        }
                    } else {
                        _this.$Message.error(rs.message);
                    }
                })
                .catch((response) => {
                    _this.$Message.error('获取数据出错');
                });
        },
        viewPicture(type,index) {
            let _this = this
            _this.previewUrl = _this.avatar
            this.visible = true;
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
<style lang="less" scoped>
.searchItem{
    margin-bottom:10px
}
.upload-video-input {
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    -ms-filter: 'alpha(opacity=0)';
    font-size: 26px;
    width: 111px;
}

.has-image {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 0;
}

.spec-image {
    .thumb {
        height: 31px;
    }
    input {
        position: absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        -ms-filter: 'alpha(opacity=0)';
        font-size: 16px;
        width: 100%;
    }
    &:hover .icon {
        display: block;
    }
    .icon {
        position: absolute;
        text-align: center;
        right: -8px;
        top: -8px;
        font-size: 22px;
        background-color: #fff;
        color: #2d8cf0;
        display: none;
    }
}

table {
    border: 0;
}

table.table-sku {
    background-color: #fff;
    text-align: left;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

table.table-sku td {
    border: 1px solid #e5e5e5;
    padding: 8px;
    max-width: 120px;
    text-align: center;
}
</style>
