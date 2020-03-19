<template>
    <!--在建库页面-->
    <el-tabs type="card" v-model="activeName" @tab-click="showTabPage">
        <el-tab-pane label="" name="prepare-period">
            <span slot="label" style="position: relative;">准备阶段<el-badge is-dot class="item"
                                                                         v-if="ifShowPrepareRed"></el-badge></span>
            <component v-bind:is="curComponents['prepare-period']"></component>
        </el-tab-pane>
        <el-tab-pane label="建设阶段" name="construction-period">
            <span slot="label" style="position: relative;">建设阶段<el-badge is-dot class="item"
                                                                         v-if="ifShowConstructionRed"></el-badge></span>
            <component v-bind:is="curComponents['construction-period']"></component>
        </el-tab-pane>
    </el-tabs>


</template>
<style src="../../css/NewMediaGlobal.css"></style>
<script src="../../js/view/project/ProjectDoingView.js"></script>
