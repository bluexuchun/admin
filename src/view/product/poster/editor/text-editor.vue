<template>
    <div class="text-wrapper">
        <Collapse v-model="activeName" accordion @change="handleTitle">
            <Panel name="normal">
                普通样式
                <div slot="content">
                    <normal-editor :render-json="renderJson" :show-id="showId"></normal-editor>
                </div>
            </Panel>
            <Panel name="border">
                边框样式
                <div slot="content">
                    <border-editor :render-json="renderJson" :show-id="showId"></border-editor>
                </div>
            </Panel>
            <Panel name="shadow">
                阴影样式
                <div slot="content">
                    <shadow-editor :render-json="renderJson" :show-id="showId"></shadow-editor>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
import normalEditor from './normal-editor.vue';
import borderEditor from './border-editor.vue';
import shadowEditor from './shadow-editor.vue';
export default {
    data() {
            return {
                activeName: 'normal'
            };
        },
        props: ['renderJson', 'showId'],
        components: {
            normalEditor,
            borderEditor,
            shadowEditor
        },
        methods: {
            handleTitle(activeNames) {
                // console.info(activeNames)
                // console.info(this.renderJson)
            }
        }
};
</script>
