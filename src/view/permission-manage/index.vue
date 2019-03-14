<style lang="less" scoped>
@import "./index.less";
</style>
<template>
    <div class="search">
        <Card>
            <Row class="operation">
                <Button @click="addMenu" type="primary" icon="md-add">添加子节点</Button>
                <Button @click="addRootMenu" icon="md-add">添加一级菜单</Button>
                <Button @click="delAll" icon="md-trash">批量删除</Button>
                <Dropdown @on-click="handleDropdown">
                    <Button>
                        更多操作
                        <Icon type="md-arrow-dropdown"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="refresh">刷新</DropdownItem>
                        <DropdownItem name="expandOne">仅展开一级</DropdownItem>
                        <DropdownItem name="expandTwo">仅展开两级</DropdownItem>
                        <DropdownItem name="expandAll">展开所有</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Row>
            <Row type="flex" justify="start" class="code-row-bg">
                <Col span="8">
                <Alert show-icon>
                    当前选择编辑： <span class="select-count">{{editTitle}}</span>
                    <a class="select-clear" v-if="menuForm.id" @click="canelEdit">取消选择</a>
                </Alert>
                <Tree :data="data" show-checkbox @on-check-change="changeSelect" @on-select-change="selectTree"></Tree>
                <Spin size="large" fix v-if="loading"></Spin>
                </Col>
                <Col span="9">
                <Form ref="menuForm" :model="menuForm" :label-width="150" :rules="menuFormValidate">
                    <FormItem label="类型" prop="type">
                        <RadioGroup v-model="menuForm.type">
                            <Radio :label="0" :disabled="isButton">
                                <Icon type="ios-list-outline"></Icon>
                                <span>页面菜单</span>
                            </Radio>
                            <Radio :label="1" :disabled="isMenu">
                                <Icon type="log-in"></Icon>
                                <span>操作按钮</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="是否在侧边栏菜单显示" prop="show_in_main" v-if="menuForm.type===0">
                        <RadioGroup v-model="menuForm.show_in_main">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="名称" prop="title" v-if="menuForm.type===0">
                        <Input v-model="menuForm.title" />
                    </FormItem>
                    <FormItem label="名称" prop="title" v-if="menuForm.type===1">
                        <Poptip trigger="focus" placement="right" width="230" word-wrap title="提示" content="操作按钮名称不得重复">
                            <Input v-model="menuForm.title" />
                        </Poptip>
                    </FormItem>
                    <FormItem label="路径" prop="path" v-if="menuForm.type===0">
                        <Input v-model="menuForm.path" />
                    </FormItem>
                    <FormItem label="请求路径" prop="path" v-if="menuForm.type===1">
                        <Poptip trigger="focus" placement="right" width="230" word-wrap title="提示" content="填写后台请求URL，后台将作权限拦截，若无可填写'无'或其他">
                            <Input v-model="menuForm.path" />
                        </Poptip>
                    </FormItem>
                    <FormItem label="按钮权限类型" prop="button_type" v-if="menuForm.type===1">
                        <Select v-model="menuForm.button_type" placeholder="请选择或输入搜索" filterable clearable>
                            <Option v-for="(item, i) in optionData" :key="i" :value="item.value">{{item.title}}</Option>
                        </Select>
                    </FormItem>
                    <div v-if="menuForm.type===0">
                        <FormItem label="英文名" prop="name">
                            <Input v-model="menuForm.name" />
                        </FormItem>
                        <FormItem label="图标" prop="icon" style="margin-bottom: 5px;">
                            <Input :icon="menuForm.icon" v-model="menuForm.icon" />
                            <span>
                      图标请参考 <a target="_blank" href="https://www.iviewui.com/components/icon"><Icon type="ionic"></Icon> ionicons</a>
                    </span>
                        </FormItem>
                        <FormItem label="前端组件" prop="component">
                            <Input v-model="menuForm.component" />
                        </FormItem>
                        <FormItem label="跳转网页链接" prop="url">
                            <Poptip trigger="focus" placement="right" width="230" word-wrap title="提示" content="前端组件需为 sys/monitor/monitor 时生效">
                                <Input v-model="menuForm.url" placeholder="http://" />
                            </Poptip>
                        </FormItem>
                    </div>
                    <FormItem label="排序值" prop="displayorder">
                        <InputNumber :max="1000" :min="0" v-model="menuForm.displayorder"></InputNumber>
                        <span style="margin-left:5px">值越小越靠前，支持最多3位小数</span>
                    </FormItem>
                    <FormItem label="是否启用" prop="status">
                        <RadioGroup v-model="menuForm.status">
                            <Radio :label="1">启用</Radio>
                            <Radio :label="0">关闭</Radio>
                        </RadioGroup>
                    </FormItem>
                    <Form-item>
                        <Button style="margin-right:5px" @click="submitEdit" :loading="submitLoading" type="primary" icon="ios-create-outline">修改并保存</Button>
                        <Button @click="handleReset">重置</Button>
                    </Form-item>
                </Form>
                </Col>
            </Row>
        </Card>
        <Modal draggable :title="modalTitle" v-model="menuModalVisible" :mask-closable='false' :width="600" :styles="{top: '30px'}">
            <Form ref="menuFormAdd" :model="menuFormAdd" :label-width="150" :rules="menuFormValidate">
                <div v-if="showParent">
                    <FormItem label="上级节点：">
                        {{parentTitle}}
                    </FormItem>
                </div>
                <FormItem label="类型" prop="type">
                    <RadioGroup v-model="menuFormAdd.type">
                        <Radio :label="0" :disabled="isButtonAdd">
                            <Icon type="ios-list-outline"></Icon>
                            <span>页面菜单</span>
                        </Radio>
                        <Radio :label="1" :disabled="isMenuAdd">
                            <Icon type="log-in"></Icon>
                            <span>操作按钮</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="是否在侧边栏菜单显示" prop="show_in_main" v-if="menuFormAdd.type===0">
                    <RadioGroup v-model="menuFormAdd.show_in_main">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="名称" prop="title" v-if="menuFormAdd.type===0">
                    <Input v-model="menuFormAdd.title" />
                </FormItem>
                <FormItem label="名称" prop="title" v-if="menuFormAdd.type===1">
                    <Poptip trigger="focus" placement="right" width="230" word-wrap title="提示" content="操作按钮名称不得重复">
                        <Input v-model="menuFormAdd.title" />
                    </Poptip>
                </FormItem>
                <FormItem label="路径" prop="path" v-if="menuFormAdd.type===0">
                    <Input v-model="menuFormAdd.path" />
                </FormItem>
                <FormItem label="请求路径" prop="path" v-if="menuFormAdd.type===1">
                    <Poptip trigger="focus" placement="right" width="230" word-wrap title="提示" content="填写后台请求URL，后台将作权限拦截，若无可填写'无'或其他">
                        <Input v-model="menuFormAdd.path" />
                    </Poptip>
                </FormItem>
                <FormItem label="按钮权限类型" prop="button_type" v-if="menuFormAdd.type===1">
                    <Select v-model="menuFormAdd.button_type" placeholder="请选择或输入搜索" filterable clearable>
                        <Option v-for="(item, i) in optionData" :key="i" :value="item.value">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <div v-if="menuFormAdd.type===0">
                    <FormItem label="英文名" prop="name">
                        <Input v-model="menuFormAdd.name" />
                    </FormItem>
                    <FormItem label="图标" prop="icon" style="margin-bottom: 5px;">
                        <Input :icon="menuFormAdd.icon" v-model="menuFormAdd.icon" />
                        <span>
                  图标请参考 <a target="_blank" href="https://www.iviewui.com/components/icon"><Icon type="ionic"></Icon> ionicons</a>
                </span>
                    </FormItem>
                    <FormItem label="前端组件" prop="component">
                        <Input v-model="menuFormAdd.component" />
                    </FormItem>
                    <FormItem label="跳转网页链接" prop="url">
                        <Poptip trigger="focus" placement="right" width="230" word-wrap title="提示" content="前端组件需为 sys/monitor/monitor 时生效">
                            <Input v-model="menuFormAdd.url" placeholder="http://" />
                        </Poptip>
                    </FormItem>
                </div>
                <FormItem label="排序值" prop="displayorder">
                    <InputNumber :max="1000" :min="0" v-model="menuFormAdd.displayorder"></InputNumber>
                    <span style="margin-left:5px">值越小越靠前，支持最多3位小数</span>
                </FormItem>
                <FormItem label="是否启用" prop="status">
                    <RadioGroup v-model="menuFormAdd.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="0">关闭</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAdd">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Utils from '@/utils';
import store from '@/store';
export default {
    name: "permission-manage",
    computed: {
        token() {
            return this.$store.state.user.token;
        }
    },
    data() {
        return {
            loading: true,
            expandLevel: 1,
            menuModalVisible: false,
            selectList: [],
            selectCount: 0,
            showParent: false,
            parentTitle: "",
            isButtonAdd: false,
            isMenuAdd: false,
            isMenu: false,
            isButton: false,
            editTitle: "",
            modalTitle: "",
            menuForm: {
                id: "",
                parent_id: "",
                button_type: "",
                type: 0,
                displayorder: null,
                level: null,
                status: 1,
                url: "",
                show_in_main: 1
            },
            menuFormAdd: {
                button_type: "",
                show_in_main: 0
            },
            menuFormValidate: {
                title: [{
                    required: true,
                    message: "名称不能为空",
                    trigger: "blur"
                }],
                name: [{
                    required: true,
                    message: "英文名不能为空",
                    trigger: "blur"
                }],
                icon: [{
                    required: true,
                    message: "图标不能为空",
                    trigger: "blur"
                }],
                path: [{
                    required: true,
                    message: "路径不能为空",
                    trigger: "blur"
                }],
                component: [{
                    required: true,
                    message: "前端组件不能为空",
                    trigger: "blur"
                }],
                show_in_main: [{
                    required: true,
                    message: "请选择是否要显示在侧边栏菜单",
                    trigger: "change",
                    type: 'number'
                }]
            },
            submitLoading: false,
            data: [],
            optionData: [{
                title: "查看操作",
                value: "display"
            }, {
                title: "获取列表",
                value: "list"
            }, {
                title: "添加操作",
                value: "add"
            }, {
                title: "编辑操作",
                value: "edit"
            }, {
                title: "删除操作",
                value: "delete"
            }, {
                title: "清空操作",
                value: "clear"
            }, {
                title: "启用操作",
                value: "enable"
            }, {
                title: "禁用操作",
                value: "disable"
            }, {
                title: "搜索操作",
                value: "search"
            }, {
                title: "上传文件",
                value: "upload"
            }, {
                title: "获取文件",
                value: "fetch"
            }, {
                title: "下载文件",
                value: "download"
            }, {
                title: "导出操作",
                value: "output"
            }, {
                title: "导入操作",
                value: "import"
            }, {
                title: "分配权限",
                value: "permission"
            }, {
                title: "设为默认",
                value: "default"
            }, {
                title: "其他操作",
                value: "other"
            }]
        };
    },
    methods: {
        init() {
            this.getAllList();
        },
        handleDropdown(name) {
            if (name === "expandOne") {
                this.expandLevel = 1;
                this.getAllList();
            } else if (name === "expandTwo") {
                this.expandLevel = 2;
                this.getAllList();
            } else if (name === "expandAll") {
                this.expandLevel = 3;
                this.getAllList();
            } else if (name === "refresh") {
                this.getAllList();
            }
        },
        getAllList() {
            let _this = this;
            _this.loading = true;
            Utils.ajax.post('api.php?entry=sys&c=permission-manage&a=index&do=display', {
                    token: _this.token,
                })
                .then((response) => {
                    _this.loading = false;
                    let res = response.data;
                    if (res.status == 1) {
                        // 仅展开指定级数 默认所有展开
                        let expandLevel = _this.expandLevel;
                        res.data.forEach(function(e) {
                            if (expandLevel === 1) {
                                if (e.level === 1) {
                                    e.expand = false;
                                }
                                if (e.children && e.children.length > 0) {
                                    e.children.forEach(function(c) {
                                        if (c.level === 2) {
                                            c.expand = false;
                                        }
                                    });
                                }
                            } else {
                                if (e.children && e.children.length > 0) {
                                    e.children.forEach(function(c) {
                                        if (expandLevel === 2) {
                                            if (c.level === 2) {
                                                c.expand = false;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        _this.data = res.data;
                    } else {
                        _this.$Message.error(res.message);
                    }
                })
                .catch((response) => {
                    _this.loading = false;
                    _this.$Message.error('获取数据出错');
                });
        },
        selectTree(v) {
            if (v.length > 0) {
                if (Number(v[0].level) === 1 || Number(v[0].level) === 2) {
                    this.isButton = false;
                    this.isMenu = true;
                } else {
                    this.isButton = true;
                    this.isMenu = false;
                }
                if (Number(v[0].status) === 0) {
                    this.editStatus = true;
                } else {
                    this.editStatus = false;
                }
                // 转换null为""
                for (let attr in v[0]) {
                    if (v[0][attr] === null) {
                        v[0][attr] = "";
                    }
                }
                let str = JSON.stringify(v[0]);
                let menu = JSON.parse(str);
                this.menuForm = menu;
                this.editTitle = menu.title;
            }
        },
        canelEdit() {
            this.isMenu = false;
            this.isButton = false;
            this.$refs.menuForm.resetFields();
            delete this.menuForm.id;
            this.editTitle = "";
        },
        cancelAdd() {
            this.menuModalVisible = false;
        },
        handleReset() {
            this.$refs.menuForm.resetFields();
            this.editStatus = true;
            this.menuForm.status = 0;
        },
        submitEdit() {
            let _this = this;
            console.log(_this.menuForm)
            _this.$refs.menuForm.validate(valid => {
                if (valid) {
                    if (!_this.menuForm.id) {
                        _this.$Message.warning("请先点击选择要修改的菜单节点");
                        return;
                    }
                    _this.submitLoading = true;
                    if (_this.menuForm.displayorder === null) {
                        _this.menuForm.displayorder = "";
                    }
                    if (_this.menuForm.button_type === null) {
                        _this.menuForm.button_type = "";
                    }
                    if (_this.menuForm.type == 1) {
                        _this.menuForm.name = "";
                        _this.menuForm.icon = "";
                        _this.menuForm.component = "";
                    }
                    _this.$set(_this.menuForm, 'token', _this.token);
                    Utils.ajax.post('api.php?entry=sys&c=permission-manage&a=index&do=edit', _this.menuForm)
                        .then((response) => {
                            _this.submitLoading = false;
                            let res = response.data;
                            if (res.status == 1) {
                                _this.$Message.success(res.message);
                                _this.init();
                                _this.menuModalVisible = false;
                            } else {
                                _this.$Message.error(res.message);
                            }
                        })
                        .catch((response) => {
                            _this.submitLoading = false;
                            _this.$Message.error('获取数据出错');
                        });
                }
            });
        },
        submitAdd() {
            let _this = this;
            _this.$refs.menuFormAdd.validate(valid => {
                if (valid) {
                    _this.submitLoading = true;
                    if (_this.menuFormAdd.displayorder === null) {
                        _this.menuFormAdd.displayorder = "";
                    }
                    if (_this.menuFormAdd.button_type === null) {
                        _this.menuFormAdd.button_type = "";
                    }
                    if (_this.menuFormAdd.type == 1) {
                        _this.menuFormAdd.name = "";
                        _this.menuFormAdd.icon = "";
                        _this.menuFormAdd.component = "";
                    }
                    _this.$set(_this.menuFormAdd, 'token', _this.token);
                    Utils.ajax.post('api.php?entry=sys&c=permission-manage&a=index&do=add', _this.menuFormAdd)
                        .then((response) => {
                            _this.submitLoading = false;
                            let res = response.data;
                            if (res.status == 1) {
                                _this.$Message.success(res.message);
                                _this.init();
                                _this.menuModalVisible = false;
                            } else {
                                _this.$Message.error(res.message);
                            }
                        })
                        .catch((response) => {
                            _this.submitLoading = false;
                            _this.$Message.error('获取数据出错');
                        });
                }
            });
        },
        addMenu() {
            if (this.menuForm.id == "" || this.menuForm.id == null) {
                this.$Message.warning("请先点击选择一个菜单权限节点");
                return;
            }
            this.parentTitle = this.menuForm.title;
            this.modalTitle = "添加菜单权限(可拖动)";
            this.showParent = true;
            let type = 0;
            if (this.menuForm.level === 1) {
                type = 0;
                this.isMenuAdd = true;
                this.isButtonAdd = false;
            } else if (this.menuForm.level === 3) {
                if (this.menuForm.type == 1) {
                    this.$Modal.error({
                        title: "抱歉，不能添加啦",
                        content: "该上级类型为操作按钮，仅支持上级类型为页面菜单"
                    });
                    return;
                }
                type = 1;
                this.isMenuAdd = false;
                this.isButtonAdd = true;
            } else if (this.menuForm.level === 4) {
                this.$Modal.error({
                    title: "抱歉，不能添加啦",
                    content: "仅支持2级菜单目录"
                });
                return;
            } else {
                type = 0;
                this.isMenuAdd = false;
                this.isButtonAdd = false;
            }
            this.menuFormAdd = {
                type: type,
                parent_id: this.menuForm.id,
                level: Number(this.menuForm.level) + 1,
                displayorder: 1,
                button_type: "",
                status: 1,
                show_in_main: 1
            };
            this.menuModalVisible = true;
        },
        addRootMenu() {
            this.modalTitle = "添加一级菜单(可拖动)";
            this.isMenuAdd = true;
            this.isButtonAdd = false;
            this.showParent = false;
            this.menuFormAdd = {
                type: 0,
                level: 1,
                displayorder: 1,
                status: 1,
                show_in_main: 1
            };
            this.menuModalVisible = true;
        },
        changeSelect(v) {
            this.selectCount = v.length;
            this.selectList = v;
        },
        delAll() {
            let _this = this;
            if (_this.selectCount <= 0) {
                _this.$Message.warning("您还未勾选要删除的数据");
                return;
            }
            _this.$Modal.confirm({
                title: "确认删除",
                content: "您确认要删除所选的 " + _this.selectCount + " 条数据?",
                onOk: () => {
                    let ids = "";
                    _this.selectList.forEach(function(e) {
                        ids += e.id + ",";
                    });
                    ids = ids.substring(0, ids.length - 1);
                    Utils.ajax.post('api.php?entry=sys&c=permission-manage&a=index&do=delete', {
                            token: _this.token,
                            ids: ids
                        })
                        .then((response) => {
                            let res = response.data;
                            if (res.status == 1) {
                                _this.$Message.success(res.message);
                                _this.selectList = [];
                                _this.selectCount = 0;
                                _this.canelEdit();
                                _this.init();
                            } else {
                                _this.$Message.error(res.message);
                            }
                        })
                        .catch((response) => {
                            _this.$Message.error('获取数据出错');
                        });
                }
            });
        }
    },
    mounted() {
        this.init();
    }
};
</script>
