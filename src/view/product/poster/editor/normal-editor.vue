<template>
    <div class="normal-style">
        <div class="form-group">
            <label>宽高</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Form inline>
                        <FormItem style="width:40%;">
                            <Input v-model="width" @change="addHistroy">
                            <span slot="prepend">宽</span>
                            </Input>
                        </FormItem>
                        <FormItem style="width:40%;">
                            <Input v-model="height" @change="addHistroy">
                            <span slot="prepend">高</span>
                            </Input>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3">
            <label>文字内容</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Input type="textarea" class placeholder="请输入内容" v-model="content" @change="addHistroy" @focus="contentChange(true)" @blur="contentChange(false)" :disabled="ctype === 3"></Input>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>背景颜色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <ColorPicker v-model="bgColorInput" @change="addHistroy"></ColorPicker>
                </div>
                <div class="form-right w140">
                    <Input v-model="bgColorInput" placeholder=""></Input>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3||ctype===7">
            <label>文字颜色</label>
            <div class="clearfix">
                <div class="form-center w35">
                    <ColorPicker v-model="textColorInput" @change="addHistroy"></ColorPicker>
                </div>
                <div class="form-right w140">
                    <Input v-model="textColorInput" placeholder=""></Input>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3">
            <label>字体</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Select v-model="fontFamily" placeholder="请选择" @change="addHistroy">
                        <Option v-for="(item, index) in familyOptions" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index">
                        </Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3">
            <label>对齐方式</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Select v-model="textAlign" placeholder="请选择" @change="addHistroy">
                        <Option v-for="(item, index) in textAlignOptions" :label="item.label" :value="item.value" :disabled="item.disabled" :key="index">
                        </Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>透明度</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Slider v-model="valueOpacity" show-input @change="addHistroy">
                    </Slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype!==7">
            <label>边距</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Slider v-model="valuePadding" :max="valuePaddingMax" show-input @change="addHistroy">
                    </Slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3">
            <label>行高</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Slider v-model="valueLineH" :max="valueLineHMAx" show-input @change="addHistroy">
                    </Slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3">
            <label>大小</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Slider v-model="fontSize" :max="fontSizeMAx" show-input @change="addHistroy">
                    </Slider>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>旋转角度</label>
            <div class="clearfix">
                <div class="form-center w168">
                    <Slider v-model="rotate" :max="rotateMax" show-input @change="addHistroy">
                    </Slider>
                </div>
            </div>
        </div>
        <div class="form-group" v-if="ctype===1||ctype===3">
            <Tooltip class="bold" effect="dark" content="加粗" placement="bottom">
                <Button :class="{ active: boldActive }" @click="toggleActive('boldActive','fontWeight','bolder','normal')">B</Button>
            </Tooltip>
            <Tooltip class="italic" effect="dark" content="斜体" placement="bottom">
                <Button :class="{ active: italicActive }" @click="toggleActive('italicActive','fontStyle','italic','normal')">I</Button>
            </Tooltip>
            <Tooltip class="underline" effect="dark" content="下划线" placement="bottom">
                <Button :class="{ active: underlineActive }" @click="toggleActive('underlineActive','textDecoration','underline','none')">U</Button>
            </Tooltip>
            <Tooltip effect="dark" content="清除格式" placement="bottom">
                <Button @click="resetStyle"><i class="el-icon-delete"></i></Button>
            </Tooltip>
        </div>
    </div>
</template>
<script>
import mainEditor from './main-editor.vue';
import bus from '@/view/product/poster/js/bus';
export default {
    data() {
            return {
                boldActive: false,
                italicActive: false,
                underlineActive: false,
                id: this.showId,
                ctype: '',
                json: {},
                content: '',
                bgColorInput: '',
                textColorInput: '',
                valueOpacity: 1,
                valuePadding: 0,
                fontSize: 0,
                fontFamily: '',
                valueLineH: 1,
                textAlign: '',
                rotate: 0,
                themeColorInput: '',
                valueLineHMAx: 3,
                valuePaddingMax: 20,
                fontSizeMAx: 100,
                rotateMax: 360,
                familyOptions: [{
                    value: 'none',
                    label: '默认字体'
                }, {
                    value: 'Microsoft YaHei',
                    label: '微软雅黑'

                }, {
                    value: 'HT',
                    label: '黑体'
                }],

                textAlignOptions: [{
                    value: 'left',
                    label: '居左'
                }, {
                    value: 'center',
                    label: '居中'

                }, {
                    value: 'right',
                    label: '居右'
                }]
            }
        },
        props: ['renderJson', 'showId'],
        created() {
            this.json = this.parseJson(this.renderJson);
            this.setInput();
        },
        computed: {
            width() {
                if (this.json[this.id]) {
                    return this.json[this.id].width;
                }
            },
            height() {
                if (this.json[this.id]) {
                    return this.json[this.id].height;
                }
            }
        },
        watch: {
            json: {
                handler: function() {},
                deep: true
            },
            width(newValue, oldValue) {
                console.log('width', newValue, oldValue);
                this.json[this.id].width = this.width;
                this.triggerApp();
            },
            height() {
                this.json[this.id].width = this.width;
                this.triggerApp();
            },
            content() {
                this.json[this.id].content = this.content.replace(/\n/g, '<br>');
                this.triggerApp();
            },
            bgColorInput() {
                this.json[this.id].text.backgroundColor = this.bgColorInput;
                this.triggerApp();
            },
            textColorInput() {
                this.json[this.id].text.color = this.textColorInput;
                this.triggerApp();
            },
            valueOpacity() {
                this.json[this.id].text.opacity = this.valueOpacity;
                this.triggerApp();
            },
            valuePadding() {
                this.json[this.id].text.padding = this.valuePadding;
                this.triggerApp();
            },
            valueLineH() {
                this.json[this.id].text.lineHeight = this.valueLineH;
                this.triggerApp();
            },
            fontFamily() {
                this.json[this.id].text.fontFamily = this.fontFamily;
                this.triggerApp();
            },
            fontSize() {
                this.json[this.id].text.fontSize = this.fontSize;
                this.triggerApp();
            },
            textAlign() {
                this.json[this.id].text.textAlign = this.textAlign;
                this.triggerApp();
            },
            rotate() {
                this.json[this.id].text.rotate = this.rotate;
                this.triggerApp();
            },
            renderJson() {
                this.json = this.parseJson(this.renderJson);
            },
            showId() {
                this.id = this.showId;
                this.setInput();
            },
            themeColorInput(val) {
                this.json[this.id].text.borderColor = val;
                this.json[this.id].text.themeColor = val;
                this.triggerApp();
            }


        },
        methods: {
            //应用所有表单以主题色
            changeThemecolorAll() {
                bus.$emit('update-themecolor', this.json[this.id].text.themeColor);
            },
            //调整高度为auto
            contentChange(isFocus) {
                bus.$emit('show-text-resize', isFocus);
            },
            //添加历史
            addHistroy(val) {
                bus.$emit('add-histroy');
            },
            triggerApp() {
                bus.$emit('update-json', this.json);
            },
            toggleActive(active, jsonKey, value, isDefault) {
                if (this[active]) {
                    this[active] = false;
                    this.json[this.id].text[jsonKey] = isDefault;
                } else {
                    this[active] = true;
                    this.json[this.id].text[jsonKey] = value;
                }
                this.addHistroy();
                bus.$emit('update-json', this.json);
            },
            setInput() {
                let json = this.renderJson[this.showId];
                let text = json.text;
                this.ctype = json.type;
                this.bgColorInput = text.backgroundColor;
                this.valueOpacity = text.opacity;
                this.valuePadding = text.padding;
                this.themeColorInput = text.themeColor;
                if (this.ctype === 1) {
                    this.fontFamily = text.fontFamily;
                    this.valueLineH = text.lineHeight;
                    this.textAlign = text.textAlign;
                    this.boldActive = text.fontWeight === 'bolder' ? true : false;
                    this.italicActive = text.fontStyle === 'italic' ? true : false;
                    this.underlineActive = text.textDecoration === 'underline' ? true : false;
                }
                if (this.ctype === 1 || this.ctype === 6 || this.ctype === 7) {
                    this.fontSize = text.fontSize;
                }
                if (this.ctype === 1 || this.ctype === 3 || this.ctype === 7) {
                    this.textColorInput = text.color;
                    this.content = json.content.replace(/<br>/g, '\n');
                }
                if (this.ctype === 2) {
                    this.rotate = text.rotate;
                }
            },
            parseJson(json) {
                return JSON.parse(JSON.stringify(json));
            },
            resetStyle() {
                bus.$emit('reset-json');
            }
        }
};
</script>
