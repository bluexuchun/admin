<style lang="less" scoped>
.m-map {
    min-width: 500px;
    min-height: 300px;
    position: relative;
}

.m-map .map {
    width: 100%;
    height: 100%;
    min-width: 500px;
    min-height: 300px;
}

.m-map .search {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 285px;
    z-index: 1;
}

.m-map .search input {
    width: 180px;
    border: 1px solid #ccc;
    line-height: 20px;
    padding: 5px;
    outline: none;
}

.m-map .search button {
    line-height: 26px;
    background: #fff;
    border: 1px solid #ccc;
    width: 50px;
    text-align: center;
}

.m-map .result {
    max-height: 300px;
    overflow: auto;
}

.m-map .search-tips {
    position: absolute;
    top: 100%;
    border: 1px solid #dbdbdb;
    background: #FFF;
    overflow: auto;
    ul {
        padding: 0;
        margin: 0;
        li {
            height: 40px;
            line-height: 40px;
            box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
            padding: 0 10px;
            cursor: pointer;
            &.autocomplete-selected {
                background: #eee;
            }
        }
    }
}
</style>
<template>
    <div class="m-map">
        <div class="search" v-if="placeSearch">
            <input id="amap-input" type="text" placeholder="请输入关键字" v-model="keyword" @input="_autoComplete">
            <button type="button" @click="handleSearch">搜索</button>
            <div id="amap-result" v-show="keyword" class="result"></div>
            <div class="search-tips">
                <ul>
                    <li v-for="(tip, index) in tips" :key="index" @click="changeTip(tip)" @mouseover="selectedTip = index" :class="{'autocomplete-selected': index === selectedTip}">{{tip.name}}</li>
                </ul>
            </div>
        </div>
        <div id="amap-container" class="map"></div>
    </div>
</template>
<script>
import Util from '@/libs/util';
import is from 'is';
// 高德地图 key
let MapKey = 'cfd8da5cf010c5f7441834ff5e764f5b';
export default {
    props: {
        location: {
            default: {
                lng: 0,
                lat: 0
            }
        },
        city: {
            default: ''
        }
    },
    data() {
        return {
            map: null,
            keyword: '',
            placeSearch: null,
            AMapUI: null,
            AMap: null,
            autoComplete: null,
            tips: [],
            selectedTip: -1,
            positionPicker: null
        }
    },
    watch: {
        location(val) {
            console.log(val);
            this.init();
        },
        keyword() {
            if (this.keyword === '') {
                this.placeSearch.clear();
                this.autoComplete.clear();
            }
        }
    },
    methods: {
        init() {
            let _this = this;
            console.log('初始化', _this.location.lng, _this.location.lat, _this.city);
            // 已载入高德地图API，则直接初始化地图
            if (window.AMap && window.AMapUI) {
                console.log('已载入');
                _this.initMap(_this.location.lng, _this.location.lat, _this.city)
                    // 未载入高德地图API，则先载入API再初始化
            }
        },
        // 搜索
        handleSearch() {
            let _this = this;
            _this.placeSearch.search(_this.keyword, (status, result) => {
                if (result && result.poiList && result.poiList.count) {
                    let {
                        poiList: {
                            pois
                        }
                    } = result;
                    let LngLats = pois.map(poi => {
                        poi.lat = poi.location.lat;
                        poi.lng = poi.location.lng;
                        return poi;
                    });
                    _this.$emit('drag', LngLats[0]);
                    _this.map.setCenter(LngLats[0].location);
                    _this.positionPicker.stop();
                    _this.positionPicker.start();

                } else if (result.poiList === undefined) {
                    throw new Error(result);
                }
            });

        },
        changeTip(tips) {
            let _this = this;
            _this.keyword = tips.name;
            _this.placeSearch.search(tips.name, (status, result) => {
                if (result && result.poiList && result.poiList.count) {
                    let {
                        poiList: {
                            pois
                        }
                    } = result;
                    let LngLats = pois.map(poi => {
                        poi.lat = poi.location.lat;
                        poi.lng = poi.location.lng;
                        return poi;
                    });
                    _this.$emit('drag', LngLats[0]);
                    _this.map.setCenter(LngLats[0].location);
                    _this.positionPicker.stop();
                    _this.positionPicker.start();
                    _this.tips = [];
                } else if (result.poiList === undefined) {
                    throw new Error(result);
                }
            });

        },
        // 实例化地图
        initMap(lng, lat, city) {
            let _this = this;
            // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            let AMapUI = this.AMapUI = window.AMapUI
            let AMap = this.AMap = window.AMap
            AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
                let mapConfig = {
                    zoom: 16
                }
                if (lat && lng) {
                    mapConfig.center = [lng, lat]
                }
                if (city) {
                    mapConfig.cityName = city;
                }
                _this.map = new AMap.Map('amap-container', mapConfig);
                // 加载地图搜索插件
                AMap.service('AMap.PlaceSearch', () => {
                    let searchOptions = {
                        city: city, //城市，默认全国
                        input: "amap-input" //使用联想输入的input的id
                    };
                    this.placeSearch = new AMap.PlaceSearch(searchOptions);
                });
                AMap.plugin('AMap.Autocomplete', function() { //回调函数
                    //实例化Autocomplete
                    let autoOptions = {
                        city: _this.city, //城市，默认全国
                        input: "amap-input" //使用联想输入的input的id
                    };
                    _this.autoComplete = new AMap.Autocomplete(autoOptions);
                    //TODO: 使用autocomplete对象调用相关功能
                });
                // 启用工具条
                AMap.plugin(['AMap.ToolBar'], function() {
                    _this.map.addControl(new AMap.ToolBar({
                        position: 'RB'
                    }))
                });
                // 创建地图拖拽
                _this.positionPicker = new PositionPicker({
                    mode: 'dragMarker', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: _this.map // 依赖地图对象
                });
                // 拖拽完成发送自定义 drag 事件
                _this.positionPicker.on('success', positionResult => {
                    // 过滤掉初始化地图后的第一次默认拖放
                    positionResult.address = positionResult.address;
                    positionResult.lng = positionResult.position.lng;
                    positionResult.lat = positionResult.position.lat;
                    this.$emit('drag', positionResult)
                });
                // 启动拖放
                _this.positionPicker.start();
            })
        },
        _autoComplete() {
            let _this = this;
            _this.autoComplete.search(_this.keyword, (status, result) => {
                if (status === 'complete') {
                    _this.tips = result.tips;
                }
            });
        }
    },
    mounted() {
        let _this = this;
        _this.init();
    }
}
</script>
