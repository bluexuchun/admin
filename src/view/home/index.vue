<template>
    <div>
        <Row :gutter="20">
            <i-col span="4" v-for="(infor, i) in infoCardData" :key="`infor-${i}`" style="height: 120px;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <count-to :end="infor.count" count-class="count-style" />
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row style="margin-top: 20px;">
            <Card shadow>
                <div ref="dom" style="height: 310px;"></div>
            </Card>
        </Row>
    </div>
</template>
<script>
import is from 'is'
import Utils from '@/utils';
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import echarts from 'echarts'
import {
    on,
    off
} from '@/libs/tools'
export default {
    components: {
        InforCard,
        CountTo,
    },
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            infoCardData: [],
            dom: null
        }
    },
    methods: {
        init() {
            let _this = this;
            Utils.ajax.post('api.php?entry=sys&c=home&a=index&do=display', {
                    token: _this.token
                })
                .then((response) => {
                    let res = response.data;
                    if (res.status == 1) {
                        if (!is.empty(res.data)) {
                            _this.infoCardData = res.data.infoCardData;
                            _this.dom = echarts.init(_this.$refs.dom);
                            let options = res.data.options;
                            _this.dom.setOption(options);
                            on(window, 'resize', this.resize());
                        }
                    } else {
                        _this.$Message.error(res.message);
                    }
                })
        },
        resize() {
            this.dom.resize()
        }
    },
    mounted() {
        let _this = this;
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                top: '3%',
                left: '1.2%',
                right: '1%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '参与量',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: '#2d8cf0'
                    }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            }, {
                name: '分享量',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: '#10A6FF'
                    }
                },
                data: [257, 358, 278, 234, 290, 330, 310]
            }, {
                name: '点击量',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: '#0C17A6'
                    }
                },
                data: [379, 268, 354, 269, 310, 478, 358]
            }, {
                name: '关注量',
                type: 'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#398DBF'
                    }
                },
                data: [820, 645, 546, 745, 872, 624, 258]
            }]
        };
        _this.$nextTick(() => {
            _this.init();
        })
    },
    beforeDestroy() {
        off(window, 'resize', this.resize())
    }
}
</script>
<style lang="less">
.count-style {
    font-size: 50px;
}
</style>
