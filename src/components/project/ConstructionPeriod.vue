<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="showTabPage">
            <el-tab-pane label="预算资金拨付" name="appropriate-money" >
                <component  v-bind:is="curComponents['appropriate-money']"></component>
            </el-tab-pane>
            <el-tab-pane label="项目预算变更评审" name="budget-change" >
                <component  v-bind:is="curComponents['budget-change']"></component>
            </el-tab-pane>
            <el-tab-pane label="工程进度和第三方信息" name="progress-tri" >
                <component  v-bind:is="curComponents['progress-tri']"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script src="../../js/view/project/ConstructionPeriodView.js"></script>

