<template>
    <div class="poster-centerContainer">
        <div class="poster-showWrapper">
            <div class="poster-phoneMain tc">
                <div class="poster-screen mt60">
<!--                     <div class="poster-toolBar">
                        <Tooltip class="item" content="背景" placement="right">
                            <a href="javascript:;" @click="toggleBgEditor">
                                <Icon type="image"></Icon>
                            </a>
                        </Tooltip>
                    </div> -->
                    <div class="v-show poster-showScreen" :style="getBackground">
                        <normalElement v-for="item in showJson" :key="item.id" :child-json="item" :show-json="showJson" :show-id="showId" :type="item.type" ref="template">
                        </normalElement>
                    </div>
                </div>
            </div>
            <button2Editor :render-json="renderJson" :show-id="showId" :show-json="showJson"></button2Editor>
        </div>
    </div>
</template>
<script>
import bus from '@/view/product/poster/js/bus';
import normalElement from './normal-template.vue';
import button2Editor from '@/view/product/poster/editor/button2-editor.vue';
export default {
    data() {
            return {
                currentView: 'normalElement',
                bgStyle: {}
            }
        },
        props: ['showJson', 'renderJson', 'showId', 'pageJson'],
        components: {
            normalElement,
            button2Editor
        },
        watch: {
            pageJson: {
                handler(val, oldVal) {
                    this.setBgImage();
                },
                deep: true
            }
        },
        created() {
            let _self = this;
            bus.$on('re-render', function(data) {})
            this.setBgImage();
            //更新背景图片
            bus.$on('mainShow-update-img', function() {
                this.setBgImage();
            }.bind(this));
        },
        methods: {
            handleClick2(tab, event) {},
            handleCommand(command) {
                this.$message('click on item ' + command);
            },
            //json是否相等
            jsonEq(val1, val2) {
                return JSON.stringify(val1) === JSON.stringify(val2);
            },
            setBgImage() {
                var bgImage = this.pageJson.bgImage;
                if (!bgImage) {
                    return;
                }
                if (bgImage.url) {
                    // this.bgStyle={
                    //     'background':'url('+bgImage.url+') no-repeat center center',
                    //     'backgroundSize':'cover'
                    // };url("http://192.168.1.100:8080/uploadfile/1/4/12/ggg.png") center center / cover no-repeat
                    return 'background: url(' + bgImage.url + ') center center / cover no-repeat;';
                }
                return 'background-color: ' + bgImage.backgroundColor + ' ;';
                // this.bgStyle={
                //     'backgroundColor':bgImage.backgroundColor
                // };

            },
            toggleBgEditor() {
                this.$parent.$parent.$parent.$parent.bgEditorToggle(true);
            }
        },
        computed: {
            getBackground() {
                return this.setBgImage();
            }
        },
};
</script>
