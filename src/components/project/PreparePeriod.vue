<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="showTabPage">
            <el-tab-pane label="项目预算评审" name="budget-approval" >
                <component  v-bind:is="curComponents['budget-approval']"></component>
            </el-tab-pane>
            <el-tab-pane label="县级预算分年度安排" name="budget-year-plan" >
                <component  v-bind:is="curComponents['budget-year-plan']"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script src="../../js/view/project/PreparePeriodView.js"></script>
