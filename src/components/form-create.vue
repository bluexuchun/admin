<template>
    <div class="wrapper">
        <Form ref="createForm">
            <FormItem v-for="(fieldValue, fieldKey) in fields" :key="fieldKey" :label="'字段' + (fieldKey + 1)">
                <Row>
                    <Col :xs="24" :sm="24" :md="7" :lg="7">
                    <Input type="text" v-model="fieldValue.title" placeholder="字段名称"></Input>
                    </Col>
                    <Col :xs="24" :sm="24" :md="{ span: 4, offset: 1 }" :lg="{ span: 4, offset: 1 }">
                    <Select v-model="fieldValue.type" @on-change="changeType">
                        <Option value="input">输入框</Option>
                        <Option value="radio">单选框</Option>
                        <Option value="checkbox">多选框</Option>
                        <Option value="switch">开关</Option>
                        <Option value="select">选择器</Option>
                        <Option value="DatePicker">日期选择器</Option>
                        <Option value="TimePicker">时间选择器</Option>
                        <Option value="InputNumber">数字增减框</Option>
                        <Option value="ColorPicker">颜色选择器</Option>
                        <Option value="Upload">上传组件</Option>
                    </Select>
                    </Col>
                    <Col :xs="24" :sm="24" :md="{ span: 4, offset: 1 }" :lg="{ span: 4, offset: 1 }">
                    <Button type="ghost" @click="fieldEdit(fieldKey)">编辑</Button>
                    </Col>
                    <Col :xs="24" :sm="24" :md="{ span: 4, offset: 1 }" :lg="{ span: 4, offset: 1 }">
                    <Button type="ghost" @click="fieldRemove(fieldKey)">删除</Button>
                    </Col>
                </Row>
                <Modal v-model="fieldValue.modalShow" title="编辑字段" width="50%" :mask-closable="false" @on-ok="editConfirm(fieldKey)" @on-cancel="fieldValue.modalShow = false">
                    <Row>
                        <Form ref="editForm[fieldKey]" :label-width="150" inline>
                            <Col :xs="24" :sm="24" :md="12" :lg="12">
                            <FormItem label="字段类型" style="width:100%;">
                                <Select v-model="fieldValue.type" @on-change="changeType">
                                    <Option value="input">输入框</Option>
                                    <Option value="radio">单选框</Option>
                                    <Option value="checkbox">多选框</Option>
                                    <Option value="switch">开关</Option>
                                    <Option value="select">选择器</Option>
                                    <Option value="DatePicker">日期选择器</Option>
                                    <Option value="TimePicker">时间选择器</Option>
                                    <Option value="InputNumber">数字增减框</Option>
                                    <Option value="ColorPicker">颜色选择器</Option>
                                    <Option value="Upload">上传组件</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12">
                            <FormItem label="必选项" style="width:100%;">
                                <i-switch v-model="fieldValue.validate[0].required"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12">
                            <FormItem label="字段名称" style="width:100%;">
                                <Input v-model="fieldValue.title"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="strornum(fieldValue.value)">
                            <FormItem label="字段初始值" style="width:100%;">
                                <Input v-model="fieldValue.value"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type != 'Upload'">
                            <FormItem label="输入框尺寸" style="width:100%;">
                                <RadioGroup v-model="fieldValue.props.size">
                                    <Radio label="default">默认</Radio>
                                    <Radio label="large">大</Radio>
                                    <Radio label="small">小</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input'">
                            <FormItem label="输入框类型" style="width:100%;">
                                <Select v-model="fieldValue.props.type">
                                    <Option value="text">单行文本</Option>
                                    <Option value="password">密码</Option>
                                    <Option value="textarea">多行文本</Option>
                                    <Option value="url">链接</Option>
                                    <Option value="email">邮件</Option>
                                    <Option value="date">日期</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input' && fieldValue.props.type == 'textarea'">
                            <FormItem label="文本域默认行数" style="width:100%;">
                                <Input v-model="fieldValue.props.rows"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input' && fieldValue.props.type == 'textarea'">
                            <FormItem label="高度自适应" style="width:100%;">
                                <i-switch v-model="fieldValue.props.autosize"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input'">
                            <FormItem label="转换值为数字类型" style="width:100%;">
                                <i-switch v-model="fieldValue.props.number"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input'">
                            <FormItem label="自动获取焦点" style="width:100%;">
                                <i-switch v-model="fieldValue.props.autofocus"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input'">
                            <FormItem label="自动完成" style="width:100%;">
                                <RadioGroup v-model="fieldValue.props.autocomplete">
                                    <Radio label="on">开启</Radio>
                                    <Radio label="off">关闭</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input'">
                            <FormItem label="拼写和语法检查" style="width:100%;">
                                <i-switch v-model="fieldValue.props.spellcheck"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'radio'">
                            <FormItem label="单选框类型" style="width:100%;">
                                <Select v-model="fieldValue.props.type">
                                    <Option value="undefined">默认</Option>
                                    <Option value="button">按钮</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'radio'">
                            <FormItem label="垂直排列" style="width:100%;">
                                <i-switch v-model="fieldValue.props.vertical"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input' || fieldValue.type == 'select' || fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker'">
                            <FormItem label="是否显示清空按钮" style="width:100%;">
                                <i-switch v-model="fieldValue.props.clearable"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input' || fieldValue.type == 'switch' || fieldValue.type == 'select' || fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker' || fieldValue.type == 'InputNumber'">
                            <FormItem label="禁用" style="width:100%;">
                                <i-switch v-model="fieldValue.props.disabled"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input' || fieldValue.type == 'select' || fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker'">
                            <FormItem label="占位文本" style="width:100%;">
                                <Input v-model="fieldValue.props.placeholder"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'input' || fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker' || fieldValue.type == 'InputNumber'">
                            <FormItem label="输入框为只读" style="width:100%;">
                                <i-switch v-model="fieldValue.props.readonly"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker'">
                            <FormItem label="日期格式" style="width:100%;">
                                <Input v-model="fieldValue.props.format"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker'">
                            <FormItem label="弹窗方向" style="width:100%;">
                                <Select v-model="fieldValue.props.placement">
                                    <Option value="top-start">上左</Option>
                                    <Option value="top">上边</Option>
                                    <Option value="top-end">上右</Option>
                                    <Option value="left-start">左上</Option>
                                    <Option value="left">左边</Option>
                                    <Option value="left-end">左下</Option>
                                    <Option value="right-start">右上</Option>
                                    <Option value="right">右边</Option>
                                    <Option value="right-end">右下</Option>
                                    <Option value="bottom-start">下左</Option>
                                    <Option value="bottom">下边</Option>
                                    <Option value="bottom-end">下右</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker'">
                            <FormItem label="显示控制栏" style="width:100%;">
                                <i-switch v-model="fieldValue.props.confirm"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'DatePicker' || fieldValue.type == 'TimePicker' || fieldValue.type == 'InputNumber'">
                            <FormItem label="允许手动输入" style="width:100%;">
                                <i-switch v-model="fieldValue.props.editable"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'switch'">
                            <FormItem label="对应值" style="width:100%;">
                                <Input v-model="fieldValue.props.trueValue" placeholder="选中时的值" style="width:45%;"></Input>
                                <Input v-model="fieldValue.props.falseValue" placeholder="未选中时的值" style="width:45%;margin-left:5%;"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'select'">
                            <FormItem label="支持搜索" style="width:100%;">
                                <i-switch v-model="fieldValue.props.filterable"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'select'">
                            <FormItem label="列表为空时的文本" style="width:100%;">
                                <Input v-model="fieldValue.props['not-found-text']"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'select'">
                            <FormItem label="弹窗方向" style="width:100%;">
                                <RadioGroup v-model="fieldValue.props.placement">
                                    <Radio label="bottom">下方</Radio>
                                    <Radio label="top">上方</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'DatePicker'">
                            <FormItem label="显示类型" style="width:100%;">
                                <Select v-model="fieldValue.props.type" @on-change="setValue">
                                    <Option value="date">日期</Option>
                                    <Option value="daterange">日期区间</Option>
                                    <Option value="datetime">带时间</Option>
                                    <Option value="datetimerange">带时间区间</Option>
                                    <Option value="year">仅年份</Option>
                                    <Option value="month">仅月份</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'TimePicker'">
                            <FormItem label="显示类型" style="width:100%;">
                                <Select v-model="fieldValue.props.type" @on-change="setValue">
                                    <Option value="time">时间</Option>
                                    <Option value="timerange">时间区间</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'TimePicker'">
                            <FormItem label="时间间隔" style="width:100%;">
                                <InputNumber :max="24" :min="1" v-model="fieldValue.props.steps[0]" size="small" style="width:30%;"></InputNumber>
                                <InputNumber :max="60" :min="1" v-model="fieldValue.props.steps[1]" size="small" style="width:30%;margin-left:3%;"></InputNumber>
                                <InputNumber :max="60" :min="1" v-model="fieldValue.props.steps[2]" size="small" style="width:30%;margin-left:3%;"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'InputNumber'">
                            <FormItem label="最大值" style="width:100%;">
                                <Input v-model="fieldValue.props.max"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'InputNumber'">
                            <FormItem label="最小值" style="width:100%;">
                                <Input v-model="fieldValue.props.min"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'InputNumber'">
                            <FormItem label="步长" style="width:100%;">
                                <Input v-model="fieldValue.props.step"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'InputNumber'">
                            <FormItem label="数值精度" style="width:100%;">
                                <Input v-model="fieldValue.props.precision"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'ColorPicker'">
                            <FormItem label="支持透明度" style="width:100%;">
                                <i-switch v-model="fieldValue.props.alpha"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'ColorPicker'">
                            <FormItem label="支持色彩" style="width:100%;">
                                <i-switch v-model="fieldValue.props.hue"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'ColorPicker'">
                            <FormItem label="显示颜色预设" style="width:100%;">
                                <i-switch v-model="fieldValue.props.recommend"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'ColorPicker'">
                            <FormItem label="显示格式" style="width:100%;">
                                <Select v-model="fieldValue.props.format">
                                    <Option value="hsl">hsl</Option>
                                    <Option value="hsv">hsv</Option>
                                    <Option value="hex">hex</Option>
                                    <Option value="rgb">rgb</Option>
                                </Select>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'ColorPicker'">
                            <FormItem label="自定义颜色" style="width:100%;">
                                <Tag v-for="(item, index) in fieldValue.props.colors" :key="index" :name="item" closable @on-close="colorDelete">{{ item }}</Tag>
                                <Input v-model="newColor" @keyup.13.native="colorAdd(fieldKey,$event)" placeholder="添加颜色，回车分隔"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'Upload'">
                            <FormItem label="控件类型" style="width:100%;">
                                <RadioGroup v-model="fieldValue.props.type">
                                    <Radio label="select">点击选择</Radio>
                                    <Radio label="drag">支持拖拽</Radio>
                                </RadioGroup>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'Upload'">
                            <FormItem label="上传地址" style="width:100%;">
                                <Input v-model="fieldValue.props.action"></Input>
                                <p>一般不用修改，默认地址为{{uploadUrl}}</p>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'Upload'">
                            <FormItem label="支持多选" style="width:100%;">
                                <i-switch v-model="fieldValue.props.multiple"></i-switch>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'Upload'">
                            <FormItem label="支持文件后缀" style="width:100%;">
                                <Tag v-for="(item, index) in fieldValue.props.format" :key="index" :name="item" closable @on-close="formatDelete">{{ item }}</Tag>
                                <Input v-model="newFormat" @keyup.13.native="formatAdd(fieldKey,$event)" placeholder="添加文件后缀名，回车分隔"></Input>
                            </FormItem>
                            </Col>
                            <Col :xs="24" :sm="24" :md="12" :lg="12" v-if="fieldValue.type == 'Upload'">
                            <FormItem label="文件大小限制" style="width:100%;">
                                <Input v-model="fieldValue.props['max-size']">
                                <p slot="append">KB</p>
                                </Input>
                            </FormItem>
                            </Col>
                            <div v-if="fieldValue.type == 'radio' ||fieldValue.type == 'checkbox' ||  fieldValue.type == 'select'">
                                <Col :xs="24" :sm="24" :md="24" :lg="24">
                                <FormItem v-for="(row, index) in fieldValue.options" :key="index" :label="'选项' + (index + 1)" style="width:100%;">
                                    <Row>
                                        <Col span="5">
                                        <Input type="text" v-model="row.label" placeholder="选项名称"></Input>
                                        </Col>
                                        <Col span="5" offset="1">
                                        <Input type="text" v-model="row.value" placeholder="选项值"></Input>
                                        </Col>
                                        <Col span="4" offset="1">
                                        <i-switch v-model="row.disabled" size="large">
                                            <span slot="open">禁用</span>
                                            <span slot="close">不禁用</span>
                                        </i-switch>
                                        </Col>
                                        <Col span="3" offset="1">
                                        <Button type="ghost" @click="optionRemove(fieldKey,index)">删除</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem style="width:100%;">
                                    <Row>
                                        <Col span="12">
                                        <Button type="dashed" long @click="optionAdd(fieldKey)" icon="plus-round">增加</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                                </Col>
                            </div>
                            <div v-if="fieldValue.type == 'Upload'">
                                <Col :xs="24" :sm="24" :md="24" :lg="24">
                                <FormItem v-for="(row, index) in fieldValue.props['default-file-list']" :key="index" :label="'已上传文件' + (index + 1)" style="width:100%;">
                                    <Row>
                                        <Col span="5">
                                        <Input type="text" v-model="row.name" placeholder="文件名称"></Input>
                                        </Col>
                                        <Col span="8" offset="1">
                                        <Input type="text" v-model="row.url" placeholder="文件地址"></Input>
                                        </Col>
                                        <Col span="3" offset="1">
                                        <Button type="ghost" @click="fileRemove(fieldKey,index)">删除</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem style="width:100%;">
                                    <Row>
                                        <Col span="12">
                                        <Button type="dashed" long @click="fileAdd(fieldKey)" icon="plus-round">增加</Button>
                                        </Col>
                                    </Row>
                                </FormItem>
                                </Col>
                            </div>
                        </Form>
                    </Row>
                    <Row slot="footer">
                        <Button type="text" @click="fieldValue.modalShow = false">取消</Button>
                        <Button type="primary" @click="editConfirm(fieldKey)">确定</Button>
                    </Row>
                </Modal>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="12" offset="6">
                    <Button type="dashed" long @click="fieldAdd" icon="plus-round">增加</Button>
                    </Col>
                </Row>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import is from 'is'
import base from 'base'
export default {
    props: {
        value: {
            default: []
        },
    },
    data() {
        return {
            isInit: false,
            uploadUrl: base.target + 'api.php?entry=app&c=utility&a=file&do=upload&type=image',
            fields: [],
            editFields: [],
            editShow: false,
            editIndex: 0,
            colors: [],
            newColor: '',
            newFormat: '',
        }
    },
    watch: {
        value(val) {
            console.log('传值');
            let _this = this;
            if (val && !_this.isInit && val !== _this.fields) {
                _this.fields = val;
                _this.isInit = true;
            }
        },
        fields: {
            handler(newValue, oldValue) {
                console.log(newValue);　　　　　　
                this.$emit('input', newValue);　　　
            },
            deep: true
        }
    },
    methods: {
        randomString(len) {　　
            len = len || 32;　　
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
            var maxPos = $chars.length;　　
            var pwd = '';　　
            for (let i = 0; i < len; i++) {　　　　
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
            }　　
            return pwd;
        },
        strornum(value) {
            return (typeof(value) == 'string' || typeof(value) == 'number');
        },
        fieldRemove(index) {
            this.fields.splice(index, 1);
        },
        fieldAdd() {
            let _this = this;
            _this.fields.push({
                type: "input",
                title: "", //label名称
                field: _this.randomString(32), //字段名称
                value: "", //input值,
                options: [],
                props: {
                    "type": "text", //输入框类型，可选值为 text、password、textarea、url、email、date
                    "clearable": false, //是否显示清空按钮
                    "disabled": false, //设置输入框为禁用状态
                    "readonly": false, //设置输入框为只读
                    "rows": 4, //文本域默认行数，仅在 textarea 类型下有效
                    "autosize": false, //自适应内容高度，仅在 textarea 类型下有效，可传入对象，如 { minRows: 2, maxRows: 6 }
                    "number": false, //将用户的输入转换为 Number 类型
                    "autofocus": false, //自动获取焦点
                    "autocomplete": "off", //原生的自动完成功能，可选值为 off 和 on
                    "placeholder": "", //占位文本
                    "size": "default", //输入框尺寸，可选值为large、small、default或者不设置,
                    "spellcheck": false //原生的 spellcheck 属性
                },
                validate: [{
                    required: false,
                    message: '请填写完整',
                    trigger: 'blur'
                }]
            });
        },
        fieldEdit(index) {
            let _this = this;
            _this.editIndex = index;
            _this.$set(_this.fields[index], 'modalShow', true);
        },
        editConfirm(index) {
            let _this = this;
            _this.editIndex = index;
            _this.$set(_this.fields[index], 'modalShow', false);
        },
        optionAdd(index) {
            this.fields[index].options.push({
                label: '',
                value: '',
                disabled: false
            });
        },
        optionRemove(index, key) {
            this.fields[index].options.splice(key, 1);
        },
        colorAdd(index, e) {
            console.log(index, e.target.value, e);
            let _this = this;
            if (is.empty(_this.fields[index].props.colors)) {
                _this.$set(_this.fields[index].props, 'colors', []);
            }
            _this.fields[index].props.colors.push(e.target.value);
            _this.newColor = '';
        },
        colorDelete(event, name) {
            let _this = this;
            let index = _this.fields[_this.editIndex].props.colors.indexOf(name);
            _this.fields[_this.editIndex].props.colors.splice(index, 1);
        },
        formatAdd(index, e) {
            console.log(index, e.target.value, e);
            let _this = this;
            if (is.empty(_this.fields[index].props.format)) {
                _this.$set(_this.fields[index].props, 'format', []);
            }
            _this.fields[index].props.format.push(e.target.value);
            _this.newFormat = '';
        },
        formatDelete(event, name) {
            let _this = this;
            let index = _this.fields[_this.editIndex].props.format.indexOf(name);
            _this.fields[_this.editIndex].props.format.splice(index, 1);
        },
        fileAdd(index) {
            let _this = this;
            console.log(_this.fields[index].props["default-file-list"]);
            _this.fields[index].props["default-file-list"].push({
                name: '',
                url: ''
            });
        },
        fileRemove(index, key) {
            this.fields[index].props["default-file-list"].splice(key, 1);
        },
        changeType(type) {
            let _this = this;
            if (type == 'input') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "type": "text", //输入框类型，可选值为 text、password、textarea、url、email、date
                    "clearable": false, //是否显示清空按钮
                    "disabled": false, //设置输入框为禁用状态
                    "readonly": false, //设置输入框为只读
                    "rows": 4, //文本域默认行数，仅在 textarea 类型下有效
                    "autosize": false, //自适应内容高度，仅在 textarea 类型下有效，可传入对象，如 { minRows: 2, maxRows: 6 }
                    "number": false, //将用户的输入转换为 Number 类型
                    "autofocus": false, //自动获取焦点
                    "autocomplete": "off", //原生的自动完成功能，可选值为 off 和 on
                    "placeholder": "", //占位文本
                    "size": "default", //输入框尺寸，可选值为large、small、default或者不设置,
                    "spellcheck": false //原生的 spellcheck 属性
                });
            } else if (type == 'radio') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'options', []);
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "type": undefined, //可选值为 button 或不填，为 button 时使用按钮样式
                    "size": "default", //单选框的尺寸，可选值为 large、small、default 或者不设置
                    "vertical": false //是否垂直排列，按钮样式下无效
                });
            } else if (type == 'checkbox') {
                _this.$set(_this.fields[_this.editIndex], 'value', []);
                _this.$set(_this.fields[_this.editIndex], 'options', []);
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "size": "default", //多选框组的尺寸，可选值为 large、small、default 或者不设置
                });
            } else if (type == 'switch') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "size": "default", //开关的尺寸，可选值为large、small、default或者不写。建议开关如果使用了2个汉字的文字，使用 large。
                    "disabled": false, //禁用开关
                    "trueValue": "1", //选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
                    "falseValue": "0" //没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
                });
            } else if (type == 'select') {
                _this.$set(_this.fields[_this.editIndex], 'value', []);
                _this.$set(_this.fields[_this.editIndex], 'options', []);
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "multiple": true, //是否支持多选
                    "clearable": false, //是否可以清空选项，只在单选时有效
                    "filterable": false, // 是否支持搜索
                    "size": "default", //选择框大小，可选值为large、small、default或者不填
                    "placeholder": "请选择", //选择框默认文字
                    "not-found-text": "无匹配数据", //当下拉列表为空时显示的内容
                    "placement": "bottom", //弹窗的展开方向，可选值为 bottom 和 top
                    "disabled": false //是否禁用
                });
            } else if (type == 'DatePicker') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "type": "date", //显示类型，可选值为 date、daterange、datetime、datetimerange、year、month
                    "format": "yyyy-MM-dd", //展示的日期格式
                    "placement": "bottom-start", // 日期选择器出现的位置，可选值为toptop-starttop-endbottombottom-startbottom-endleftleft-startleft-endrightright-startright-end
                    "placeholder": "请选择获得时间", //占位文本
                    "confirm": false, //是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭
                    "size": "default", //尺寸，可选值为large、small、default或者不设置
                    "disabled": false, //是否禁用选择器
                    "clearable": true, //是否显示清除按钮
                    "readonly": false, //完全只读，开启后不会弹出选择器
                    "editable": false, //文本框是否可以输入
                });
            } else if (type == 'TimePicker') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "type": "timerange", //显示类型，可选值为 time、timerange
                    "format": "HH:mm:ss", //展示的时间格式
                    "steps": [], //下拉列表的时间间隔，数组的三项分别对应小时、分钟、秒。例如设置为 [1, 15] 时，分钟会显示：00、15、30、45。
                    "placement": "bottom-start", // 时间选择器出现的位置，可选值为toptop-starttop-endbottombottom-startbottom-endleftleft-startleft-endrightright-startright-end
                    "placeholder": "请选择获得时间", //占位文本
                    "confirm": false, //是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭
                    "size": "default", //尺寸，可选值为large、small、default或者不设置
                    "disabled": false, //是否禁用选择器
                    "clearable": true, //是否显示清除按钮
                    "readonly": false, //完全只读，开启后不会弹出选择器
                    "editable": false, //文本框是否可以输入
                });
            } else if (type == 'InputNumber') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "max": undefined, //最大值
                    "min": undefined, //最小值
                    "step": 1, //每次改变的步伐，可以是小数
                    "size": "default", //输入框尺寸，可选值为large、small、default或者不填
                    "disabled": false, //设置禁用状态
                    "readonly": false, //是否设置为只读
                    "editable": true, //是否可编辑
                    "precision": 0, //数值精度
                });
            } else if (type == 'ColorPicker') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "alpha": false, //是否支持透明度选择
                    "hue": true, //是否支持色彩选择
                    "recommend": false, //是否显示推荐的颜色预设
                    "size": "default", //尺寸，可选值为large、small、default或者不设置
                    "colors": [], //自定义颜色预设
                    "format": "hex" //颜色的格式，可选值为 hsl、hsv、hex、rgb,开启 alpha 时为 rgb，其它为 hex
                });
            } else if (type == 'Upload') {
                _this.$set(_this.fields[_this.editIndex], 'value', []);
                _this.$set(_this.fields[_this.editIndex], 'props', {
                    "type": "select", //上传控件的类型，可选值为 select（点击选择），drag（支持拖拽）
                    "action": _this.uploadUrl, //上传的地址，必填
                    "headers": {}, //设置上传的请求头部
                    "multiple": false, //是否支持多选文件
                    "data": {}, //上传时附带的额外参数
                    "name": "file", //上传的文件字段名
                    "with-credentials": false, //支持发送 cookie 凭证信息
                    "show-upload-list": true, //是否显示已上传文件列表
                    "accept": "", //接受上传的文件类型
                    "format": [], //支持的文件类型，与 accept 不同的是，format 是识别文件的后缀名，accept 为 input 标签原生的 accept 属性，会在选择文件时过滤，可以两者结合使用
                    "max-size": undefined, //文件大小限制，单位 kb
                    "default-file-list": [] // 默认已上传的文件列表
                });
            }
        },
        setValue(type) {
            let _this = this;
            if (type == 'date' || type == 'datetime' || type == 'year' || type == 'month' || type == 'time') {
                _this.$set(_this.fields[_this.editIndex], 'value', '');
            } else if (type == 'daterange' || type == 'datetimerange' || type == 'timerange') {
                _this.$set(_this.fields[_this.editIndex], 'value', []);
            }
        }
    }
}
</script>
<style lang="less">
.wrapper {
    margin: auto;
}
</style>
