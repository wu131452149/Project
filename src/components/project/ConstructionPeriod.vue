<template>
    <div class="wrap">
        <el-tabs v-model="activeName" @tab-click="showTabPage">
            <el-tab-pane name="appropriate-money" >
                <span slot="label">
                    <el-badge is-dot class="item" v-if="showStepFourRed"> 预算资金拨付</el-badge>
                    <span v-else>
                        预算资金拨付
                    </span>
                </span>
                <component  v-bind:is="curComponents['appropriate-money']"></component>
            </el-tab-pane>
            <el-tab-pane name="budget-change" >
                <span slot="label">
                    <el-badge is-dot class="item" v-if="showStepFiveRed"> 项目预算变更评审</el-badge>
                    <span v-else>
                        项目预算变更评审
                    </span>
                </span>
                <component  v-bind:is="curComponents['budget-change']"></component>
            </el-tab-pane>
            <el-tab-pane name="progress-tri" >
                <span slot="label">
                    <el-badge is-dot class="item" v-if="showStepSixRed"> 工程进度和第三方信息</el-badge>
                    <span v-else>
                        工程进度和第三方信息
                    </span>
                </span>
                <component  v-bind:is="curComponents['progress-tri']"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script src="../../js/view/project/ConstructionPeriodView.js"></script>

