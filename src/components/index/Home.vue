<template>
    <div class="home-contain wrap">
        <!--监控地方-->
        <el-tabs v-model="userInfoActiveName">
            <el-tab-pane label="项目流程" name="pro-step">
                <div class="home-monitor-hint">
                    <div class="scrollBar-inner">
                        <div class="padding-t-15 padding-r-10 padding-l-10 padding-b-10">
                            <div class="padding-t-5 padding-l padding-r padding-b-10 bg-color-active">
                                <h4>1. 拟建库</h4>
                                <div class="padding-t-10 padding-l line-height-25">
                                    <div><p>1.1 录入项目信息，通过财政审核后，可以进入在建阶段在建库</p></div>
                                </div>
                            </div>
                        </div>
                        <div class="padding-t-15 padding-r-10 padding-l-10 padding-b-10">
                            <div class="padding-t-5 padding-l padding-r padding-b-10 bg-color-active">
                                <h4>2. 在建库</h4>
                                <div class="padding-t-10 padding-l line-height-25">
                                    <div><p>2.1 在建库分准备阶段和建设阶段</p></div>
                                    <div><p>2.2 准备阶段 :</p>
                                        <div class="margin-l">
                                            <p>• 分为项目预算评审和县级预算分年度安排,共2个财政审核环节</p>
                                            <p class="bold">注意
                                                :录入项目预算评审后可录入县级预算分年度安排，财政确认顺序亦相同，县级预算分年度安排通过财政审核后进入建设阶段</p>
                                        </div>
                                    </div>
                                    <div><p>2.3 建设阶段 :</p>
                                        <div class="margin-l">
                                            <p>• 分为预算资金拨付、项目预算变更评审、工程进度和第三方信息，共3个财政审核环节，其中工程进度不审核</p>
                                            <p class="bold">注意 :工程进度为100%后，可进入完工阶段</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="padding-t-15 padding-r-10 padding-l-10 padding-b-10">
                            <div class="padding-t-5 padding-l padding-r padding-b-10 bg-color-active">
                                <h4>3. 完工库</h4>
                                <div class="padding-t-10 padding-l line-height-25">
                                    <div><p>3.1 录入财政决算评审信息，通过财政审核后，进入完工库</p></div>
                                </div>
                            </div>
                        </div>
                        <div class="padding-t-15 padding-r-10 padding-l-10 padding-b-10">
                            <div class="padding-t-5 padding-l padding-r padding-b-10 bg-color-active">
                                <h4>4. 退库</h4>
                                <div class="padding-t-10 padding-l line-height-25">
                                    <div><p>4.1 录入项目信息后，未进入在建阶段，可申请退库，通过财政审核后，完成退库</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="项目监控" name="pro-monitor">
                <div class="home-monitor element-table th-bold">
                    <div><i class="fa fa-bar-chart"></i><h5 class="inline-block">项目数量统计</h5></div>
                    <div class="el-row is-justify-space-around el-row--flex">
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>总项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <span>{{ allProject.count}}</span>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>新建项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <span>{{ monitor.newProjectCount }}</span>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>在建项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <span>{{ allProject.count-monitor.finishedProjectCount-monitor.returnedProjectCount-monitor.newProjectCount}}</span>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>完工项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <span>{{monitor.finishedProjectCount}}</span>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>已退库项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <span>{{ monitor.returnedProjectCount}}</span>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </div>
                    <div class="home-monitor element-table th-bold">
                        <div><i class="fa fa-bar-chart"></i><h5 class="inline-block">项目金额统计</h5></div>
                        <div class="el-row is-justify-space-around el-row--flex">
                            <div class="el-col el-col-4">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span>项目估算总额</span>
                                    </div>
                                    <div class="text item">
                                        <div>
                                            <span>{{ allBudgetReviewMoney.projectMoney}}(元）</span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <div class="el-col el-col-4">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span>预算评审金额</span>
                                    </div>
                                    <div class="text item">
                                        <div>
                                            <span>{{ allBudgetReviewMoney.budgetReviewMoney}}(元）</span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <div class="el-col el-col-4">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span>预算年度安排统计</span>
                                    </div>
                                    <div class="text item">
                                        <div>
                                            <span>{{ allBudgetPlanMoney.money}}(元）</span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <div class="el-col el-col-4">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span>资金拨付情况</span>
                                    </div>
                                    <div class="text item">
                                        <div>
                                            <span>{{ allAppropriateMoney.money}}(元）</span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <div class="el-col el-col-4">
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span>已安排未拨付</span>
                                    </div>
                                    <div class="text item">
                                        <div>
                                            <span>{{ allBudgetReviewMoney.nonPaymentTotalMoneyNo}}(元）</span>
                                        </div>
                                    </div>
                                </el-card>
                            </div>

                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="项目统计详情" name="all-pro-details">
                <!--查询条件 start-->
                <div class="general-search">
                    <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">所有项目查询</h5></div>
                    <el-form :inline="true" ref="searchData" v-model="allProject.formData" style="padding-left: 30px">
                        <div style="margin-bottom: 12px;">
                        </div>
                        <div class="inline-block" v-if="user.grade==1">
                            <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">
                                <el-select v-model="allProject.formData.projectInstitution" name="projectInstitution"
                                           clearable placeholder="项目单位"
                                           class="width180">
                                    <el-option
                                        v-for="item in projectInstitutionList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="inline-block" v-else>
                            <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">

                                <el-select v-model="levelOne" placeholder="请选择项目单位"
                                           @change="selectLevelOneChange">
                                    <el-option v-for="item in projectInstitutionList" :label="item.name"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-model="allProject.formData.projectInstitution" placeholder="请选择项目单位"
                                           @change="selectLevelTwoChange">
                                    <el-option v-for="item in newInstituation" :label="item.name" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="inline-block">
                            <el-form-item label="项目类型" prop="projectType" class="margin-r5">
                                <el-select v-model="allProject.formData.projectType" name="projectType"
                                           clearable placeholder="项目类型" class="width180">
                                    <el-option :label="'新建'" :value="'新建'"></el-option>
                                    <el-option :label="'存量'" :value="'存量'"></el-option>
                                    <el-option :label="'改扩建'" :value="'改扩建'"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="inline-block">
                            <el-form-item label="项目名称" prop="" class="agent-select-label">
                                <el-input placeholder="按项目名称搜索" v-model="allProject.formData.projectName"
                                          required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                        </div>
                        <!--其他条件-->
                        <div class="width100 other-condition">
                            <el-form-item label="资金安排周期" prop="projectYears" class="margin-r5">
                                <el-select v-model="allProject.formData.projectYears" clearable
                                           placeholder="资金安排周期">
                                    <el-option :label="'3年'" :value="'3'"></el-option>
                                    <el-option :label="'2年'" :value="'2'"></el-option>
                                    <el-option :label="'1年'" :value="'1'"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="项目编号" prop="projectContactUserName" class="margin-r6">
                                <el-input placeholder="按项目编号搜索" v-model="allProject.formData.id"
                                          required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                            <el-form-item label="项目阶段" prop="projectYears" class="margin-r5">
                                <el-select v-model="allProject.formData.approvalStep" clearable
                                           placeholder="项目阶段">
                                    <el-option :label="'新建库'" :value="'1'"></el-option>
                                    <el-option :label="'在建库'" :value="'2-6'"></el-option>
                                    <el-option :label="'完工库'" :value="'7'"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <!--更多查询条件-->
                        <!--按钮-->
                        <div class="text-c medium-btn">
                            <el-button type="primary" @click="queryAllProject(true)">查询</el-button>
                            <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                        </div>
                    </el-form>
                </div>
                <!--查询条件 end-->
                <!--表格start-->
                <div class="report-form element-table less-condition">
                    <el-table
                        :data="allProject.allProjectList"
                        border
                        tooltip-effect="light"
                        :summary-method="getSummary"
                        show-summary
                        @click.stop.prevent="stopPropagationPreventDef($event)"
                        style="width: 100%;height:100%">
                        <el-table-column show-overflow-tooltip prop="commitName" label="主管部门" width="100">
                            <template slot-scope="scope">{{scope.row.commitName}}</template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="projectInstitution" label="项目单位">
                            <template slot-scope="scope">{{scope.row.projectInstitution}}</template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="projectName" label="项目名称">
                            <template slot-scope="scope"><a @click.stop="showAllProjectDetails($event,scope.row)">{{scope.row.projectName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="projectType" label="项目类型">
                            <template slot-scope="scope">{{scope.row.projectType}}</template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="projectMoney" label="项目估算总额（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.projectMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="projectYears" label="资金安排周期" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.projectYears}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="budgetReviewMoney" label="预算评审金额（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.budgetReviewMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="contractMoney" label="合同金额（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.contractMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="finishMoney" label="最终金额（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.finishMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="yearsPlanTotalMoneyNo" label="合计安排（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.yearsPlanTotalMoneyNo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="yearsPlanTotalMoney" label="以前年度累计安排（元）"
                                         width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.beforeYearPlanMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="yearsPlanTotalMoney" label="当年安排（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.thisYearPlanMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="yearsPlanTotalMoney" label="次年安排（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.nextYearPlanMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="yearsPlanTotalMoney" label="第三年安排（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.nextAYearPlanMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="approTotalMoney" label="资金当年拨付（元）" width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.thisYearGiveMoney}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip prop="approTotalPlanMoneyNo" label="资金累计拨付（元）"
                                         width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.approTotalPlanMoneyNo}}</span>
                            </template>
                        </el-table-column>
                        <!--<el-table-column show-overflow-tooltip prop="nonPaymentTotalMoneyNo" label="已安排未拨付（元）"-->
                                         <!--width="80">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{scope.row.nonPaymentTotalMoneyNo}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column show-overflow-tooltip prop="nonPaymentTotalMoneyNo" label="总欠付（元）"
                                         width="80">
                            <template slot-scope="scope">
                                <span>{{scope.row.totalNoPay}}</span>
                            </template>
                        </el-table-column>
                        <!--项目修改权限-->
                        <el-table-column label="操作" class="text-c" v-if="user.grade==0" width="160">
                            <template slot-scope="scope">
                                <a @click.stop="editProject($event,scope.row)">修改项目</a>
                                <a @click.stop="deleteWrongProject($event,scope.row)">删除项目</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--合计行-->
                <div>

                </div>
                <!--表格end-->
                <!--分页 start-->
                <div class="text-r margin-t10">
                    <div class="f-r clearFix">
                        <div class="f-l pagination-total">
                            <a class="" v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"
                               @click="queryAllProjectCount">查询总数</a>
                            <span class="" v-else>共 <span>{{allProject.count}}</span> 条</span>
                        </div>
                        <el-pagination class="f-r"
                                       @current-change="queryAllProject(false)"
                                       layout="prev, pager, next, jumper"
                                       :total="allProject.count"
                                       :current-page.sync="allProject.currentPage"
                        >
                        </el-pagination>
                    </div>
                    <div class="f-l medium-btn">
                        <el-button type="primary" @click.stop="ExportFinishedProject">导出</el-button>
                    </div>
                    <div class="small-tips f-l font13 margin-l10">
                        <span class="color-tips">注 : </span><span class="color-tips"> 仅对当前查询结果生效</span>
                    </div>
                </div>
                <!--分页 end-->
                <!--项目信息详情 start-->
                <el-drawer
                    title="项目信息详情"
                    :visible.sync="drawerDetails"
                    :direction="direction"
                    custom-class="demo-drawer"
                    size=66%
                    :before-close="handleClose">
                    <div class="scrollBar-inner">
                        <show-project-Detail @onListen="handleClose"
                                             :projectDetail="projectDetail"
                                             :step="7"
                                             :showButton="showButton"
                                             :activeNames="activeNames">

                        </show-project-Detail>
                    </div>
                </el-drawer>
                <!--项目信息详情 end-->
                <!--修改项目信息 start-->
                <el-drawer
                    title="修改项目信息"
                    :visible.sync="drawerEdit"
                    ref="editPane"
                    :direction="direction"
                    custom-class="demo-drawer"
                    size=66%
                    :before-close="handleClose">
                    <div class="scrollBar-inner" style="height: 500px;">
                        <show-all-Detail @onListen="handleClose"
                                         :projectDetail="projectDetail"
                                         :drawerClick="objDrawer"
                                         :step="7"
                                         :showButton="showButton"
                                         :activeNames="activeNames">

                        </show-all-Detail>
                    </div>
                </el-drawer>
                <!--修改项目信息 end-->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script src="../../js/view/index/Home.js"></script>
<style src="../../css/index/knowledge.css" scoped></style>
<style>
    .all-form-without-page .el-table__header-wrapper {
        display: none;
    }

    .all-form-without-page .el-table__body-wrapper {
        display: none;
    }

    .all-form-without-page .el-table__footer-wrapper {
        overflow: auto;
    }

    .all-form-without-page .el-table .el-table__footer-wrapper .el-table__footer td .cell {
        white-space: normal !important;
    }

    .all-form-without-page .el-table {
        height: 7% !important;
    }
</style>

