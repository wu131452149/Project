<template>
    <div class="wrap">
        <el-tabs v-model="activeName" @tab-click="showTabPage">
            <el-tab-pane name="budget-approval" >
                <span slot="label">
                    <el-badge is-dot class="item" v-if="showStepTwoRed"> 项目预算评审</el-badge>
                    <span v-else>
                        项目预算评审
                    </span>
                </span>
                <component  v-bind:is="curComponents['budget-approval']"></component>
            </el-tab-pane>
            <el-tab-pane name="budget-year-plan" >
                <span slot="label">
                    <el-badge is-dot class="item" v-if="showStepThreeRed"> 县级预算分年度安排</el-badge>
                    <span v-else>
                        县级预算分年度安排
                    </span>
                </span>
                <component  v-bind:is="curComponents['budget-year-plan']"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script src="../../js/view/project/PreparePeriodView.js"></script>
