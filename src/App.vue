<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
export default {
    name: 'App'
}
</script>
<style lang="less">
.size {
    width: 100%;
    height: 100%;
}

html,
body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

#app {
    .size;
}

.app-main {
    width: 100%;
    height: 100%;
}

.br button {
    margin-right: 5px;
}

.operation button,
.btn-group button {
    margin-right: 5px;
}

.ivu-btn-text:focus {
    box-shadow: none !important;
}
</style>
