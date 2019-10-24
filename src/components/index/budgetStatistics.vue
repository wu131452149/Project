<template>
    <div>
        <div class="inline-block">
            <el-checkbox-group v-model="checkList">
                <el-checkbox label="主管部门" key="userName" v-if="user.grade==3||user.grade==0"></el-checkbox>
                <el-checkbox label="类型" key="type"></el-checkbox>
                <el-checkbox label="项目单位" key="role" v-if="user.grade==3||user.grade==0"></el-checkbox>
            </el-checkbox-group>
            <el-button type="primary" @click="queryData()">查询</el-button>
        </div>
        <div><i class="fa fa-bar-chart"></i><h5 class="inline-block">预算年度安排统计</h5></div>
        <div class="report-form element-table less-condition">
            <el-table
                :data="allBudgetPlanMoneyList"
                tooltip-effect="light"
                @click.stop.prevent="stopPropagationPreventDef($event)"
                style="width: 100%;">
                <el-table-column show-overflow-tooltip prop="years" label="年份">
                    <template slot-scope="scope">{{scope.row.years}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="userName" label="主管部门">
                    <template slot-scope="scope" v-if="scope.row.userName">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="role" label="项目单位">
                    <template slot-scope="scope" v-if="scope.row.role">{{scope.row.role}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="type" label="类型">
                    <template slot-scope="scope" v-if="scope.row.type">{{scope.row.type}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="money" label="金额总计">
                    <template slot-scope="scope" v-if="scope.row.money">{{scope.row.money}}</template>
                </el-table-column>
            </el-table>
        </div>
        <div><i class="fa fa-bar-chart"></i><h5 class="inline-block">资金拨付情况统计</h5></div>
        <div class="report-form element-table less-condition">
            <el-table
                :data="allAppropriateMoneyList"
                tooltip-effect="light"
                @click.stop.prevent="stopPropagationPreventDef($event)"
                style="width: 100%;">
                <el-table-column show-overflow-tooltip prop="years" label="年份">
                    <template slot-scope="scope">{{scope.row.years}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="userName" label="主管部门">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectInstitution" label="项目单位">
                    <template slot-scope="scope">{{scope.row.role}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="type" label="类型">
                    <template slot-scope="scope">{{scope.row.type}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="money" label="金额总计">
                    <template slot-scope="scope" v-if="scope.row.money">{{scope.row.money}}</template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script src="../../js/view/index/budgetStatisticsView.js"></script>
