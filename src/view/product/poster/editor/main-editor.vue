<template>
    <div class="poster-rightContainer mt5">
        <div class="poster-editorWrapper" @click.stop="">
            <textEditor :render-json="renderJson" :show-id="showId" v-if="showId"></textEditor>
            <bgEditor :render-json="renderJson" :show-id="showId" :pageJson='pageJson' v-else-if="showBg"></bgEditor>
        </div>
    </div>
</template>
<script>
import textEditor from './text-editor.vue';
import bgEditor from './bg-editor.vue';
import bus from '@/view/product/poster/js/bus';
let arr = ['textEditor'];
export default {
    data() {
            return {
                activeName2: 'first',
                id: this.showId,
                activeName: 'first',
                showBg: false
                    // currentView: 'textEditor'
            }
        },
        props: ['renderJson', 'showId', 'pageJson'],
        components: {
            textEditor,
            bgEditor
        },
        created() {
            this.handleView();
        },
        methods: {
            handleView() {
                this.id = this.showId;
            },
            toggleBgEditor(isActive) {
                console.log(isActive);
                if (isActive !== null) {
                    this.showBg = isActive;
                    return false;
                }
                this.showBg = !this.showBg;
            }
        },
        watch: {
            renderJson: {
                handler(val, oldVal) {
                    this.handleView();
                },
                deep: true
            },
            showId(val) {
                this.handleView();
            }
        },
};
</script>
