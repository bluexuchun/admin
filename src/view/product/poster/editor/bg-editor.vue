<template>
    <div class="poster-bgStyle">
        <div class="form-group">
            <div>图片背景</div>
            <div class="upload-list" style="width: 150px;height:150px;line-height: 150px;" v-if="pageJson.bgImage.url">
                <template>
                    <img :src="pageJson.bgImage.url" width="150px" height="150px">
                </template>
            </div>
            <label class="upload-label" style="display: inline-block;width:150px;height:150px;line-height: 150px;" v-if="!pageJson.bgImage.url">
                <input type="file" style="display:none;" @change="_onChange($event)">
                <Icon type="camera" size="20"></Icon>
            </label>
            <div class="mt10 tr" v-if="pageJson.bgImage.url">
                <ButtonGroup>
                    <Button @click.native="deleteImage">删除图片</Button>
                    <Button class="upload-button">
                        <input type="file" @change="_onChange($event)" /> 修改图片
                    </Button>
                </ButtonGroup>
            </div>
        </div>
        <div class="form-group">
            <label>纯色背景</label>
            <div class="clearfix">
                <Row>
                    <Col span="6">
                    <div class="form-center">
                        <ColorPicker v-model="json.bgImage.backgroundColor" @on-change="setColor"></ColorPicker>
                    </div>
                    </Col>
                    <Col span="7">
                    <div class="form-right">
                        <Input v-model="json.bgImage.backgroundColor" placeholder=""></Input>
                    </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<script>
import Utils from '@/utils';
import bus from '@/view/product/poster/js/bus';
export default {
    data() {
            return {
                json: {
                    bgColorInput: ''
                },
                id: this.showId,
                url: ''
            };
        },
        props: ['renderJson', 'showId', 'pageJson'],
        created() {
            this.setInput();
        },
        watch: {
            pageJson: {
                handler(val, oldVal) {
                    this.setInput();
                },
                deep: true
            }
        },
        methods: {
            //触发历史纪录
            // addHistroy() {
            //     bus.$emit('add-histroy');
            // },
            triggerApp() {
                //bus.$emit('update-json', this.json);
            },
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
            setInput() {
                this.json = this.parseJson(this.pageJson);
            },
            _onChange(e, type, index) {
                let _this = this;
                var files = e.target.files;
                if (!files.length) return;
                Utils.uploader(files, e.target, function(url) {
                    _this.$set(_this.pageJson.bgImage, 'url', url);
                });
            },
            deleteImage() {
                bus.$emit('update-pageJson', {
                    'bgImage': {
                        'url': '',
                        'coord': ''
                    }
                });
            },
            setColor(val) {
                bus.$emit('update-pageJson', {
                    'bgImage': {
                        'url': '',
                        'coord': '',
                        'backgroundColor': val
                    }
                });
            }
        }
};
</script>
