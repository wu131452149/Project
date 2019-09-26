<!--项目详细信息-->
<template>
    <div class="show-project-detail wrap wrap-crowded position-r clearfix">
        <div class="pro-info">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">项目基本信息</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目单位：</span>
                        <span class="info-val">{{projectDetail.projectInstitution}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">财政归口股室：</span>
                        <span class="info-val">{{projectDetail.projectFinance}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目名称：</span>
                        <span class="info-val">{{projectDetail.projectName}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目类型：</span>
                        <span class="info-val">{{projectDetail.projectType}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">投资估算总额：</span>
                        <span class="info-val">{{projectDetail.projectMoney}}(万元）</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">资金来源：</span>
                        <span class="info-val">{{projectDetail.projectMoneyFrom|renderMoneyFrom}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">所属行业：</span>
                        <span class="info-val">{{projectDetail.projectIndustry|renderIndustry}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">拟开工时间：</span>
                        <span class="info-val">{{projectDetail.projectBeginTime|renderBeginTime}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目建设周期：</span>
                        <span class="info-val">{{projectDetail.projectYears}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目联系人：</span>
                        <span class="info-val">{{projectDetail.projectContactUserName}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">联系人电话：</span>
                        <span class="info-val">{{projectDetail.projectContactUserPhone}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目基本情况：</span>
                        <span class="info-val">{{projectDetail.projectSituation}}</span>
                    </div>
                </div>
            </div>
        </div>


        <!--项目预算-->
        <div class="budget-plan" v-if="step>1">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">项目预算评审</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">

                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">政府批示：</span>
                        <span class="info-val">{{projectDetail.gvApproval}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">预算评审金额：</span>
                        <span class="info-val">{{projectDetail.budgetReviewMoney}}（万元）</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">评审文号：</span>
                        <span class="info-val">{{projectDetail.approvalNumber}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">国有资产审批登记：</span>
                        <span class="info-val">{{projectDetail.stateOwnedRegistration|renderBoolean}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">项目政府采购：</span>
                        <span class="info-val">{{projectDetail.gvBuy|renderBoolean}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">文件：</span>
                        <div v-for="item in fileList">
                        <a class="info-val" @click="downloadUrl(item)">{{item.oname}}</a> <br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--项目预算年度安排-->
        <div class="budget-plan" v-if="step>2">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">预算年度安排</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">县级预算年度安排：</span>
                        <div>
                            <span class="info-val plan-years" v-if="projectDetail.planYearsSelfMoney">{{projectDetail.planYearsSelfMoney|renderPlanYearsSelfMoney}}</span>
                            <span class="info-val plan-years" v-if="projectDetail.planYearsMoney">{{projectDetail.planYearsMoney|renderPlanYearsMoney}}</span>
                            <span class="info-val plan-years" v-if="projectDetail.planYearsTopMoney">{{projectDetail.planYearsTopMoney|renderPlanYearsTopMoney}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--预算拨付-->
        <div class="budget-plan" v-if="step>3">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">预算拨付</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">预算拨付：</span>
                        <div v-for="item in appropriateBudget" v-if="projectDetail.appropriateBudget">
                            <span class="info-val plan-years">
                                {{item.date}},本级拨付{{parseInt(item.money)}}（万元）
                            </span>
                        </div>
                        <div v-for="item in appropriateTopBudget" v-if="projectDetail.appropriateTopBudget">
                            <span class="info-val plan-years">
                                {{item.date}},本级拨付{{parseInt(item.money)}}（万元）
                            </span>

                    </div>
                    </div>
                </div>
            </div>
        </div>
        <!--预算变更-->
        <div class="budget-plan" v-if="step>4">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">预算变更</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">预算变更：</span>
                        <div v-for="item in cutBudget" v-if="projectDetail.cutBudget">
                            <span class="info-val plan-years">
                                {{item.date}},{{item.type}}{{parseInt(item.money)}}（万元）,评审文号为{{item.No}}
                            </span>
                        </div>
                        <div v-for="item in addBudget" v-if="projectDetail.addBudget">
                            <span class="info-val plan-years">
                                {{item.date}},{{item.type}}{{parseInt(item.money)}}（万元）,评审文号为{{item.No}}
                            </span>
                        </div>
                        <span class="info-val plan-years">累计增加金额为：{{totalAdd}}（万元）</span>
                        <span class="info-val plan-years">累计减少金额为：{{totalCut}}（万元）</span>
                        <span class="info-val plan-years">预算总金额变为：{{totalMoney}}（万元）</span>
                        <!--<span class="info-val" v-if="projectDetail.cutBudget">减少{{projectDetail.cutBudget}}万元</span>-->
                        <!--<span class="info-val" v-if="projectDetail.addBudget">增加{{projectDetail.addBudget}}万元</span>-->
                    </div>
                </div>
            </div>
        </div>
        <!--工程进度-->
        <div class="budget-plan" v-if="step>5">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">工程进度</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">工程进度：</span>
                        <span class="info-val" v-if="projectDetail.speed">{{projectDetail.speed}}%</span>
                    </div>
                </div>
            </div>
        </div>
        <!--三方信息-->
        <div class="budget-plan" v-if="step>5">
            <div class="current-catalog right-header clearfix padding-0-20">
                <div class="toolbar f-l line-height-30 excessEllipsis  width-per100"><span
                    class="bold">工程进度</span></div>
            </div>
            <div class="info-content scrollBar-inner width-per100 margin-t10 padding-0-20">
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">合同名称：</span>
                        <span class="info-val">{{projectDetail.agreementName}}</span>
                    </div>
                </div>

                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">合同金额：</span>
                        <span class="info-val">{{projectDetail.agreementMoney}}(万元）</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">负责人：</span>
                        <span class="info-val">{{projectDetail.agreementUserName}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">负责人电话：</span>
                        <span class="info-val">{{projectDetail.agreementUserPhone}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">开户行：</span>
                        <span class="info-val">{{projectDetail.agreementBank}}</span>
                    </div>
                </div>
                <div class="inline-block font13 width-per45 ver-text-top margin-t-15 margin-r">
                    <div class="clearFix">
                        <span class="info-label">银行卡号：</span>
                        <span class="info-val">{{projectDetail.agreementCardNo}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="user.grade==0||user.grade==2">
            <div class="demo-drawer__footer margin-t-25" style="text-align: center;" v-if="step!=7">
                <el-button type="primary" @click="approvalProject" :loading="loading">{{ loading ? '提交中 ...' : '审核通过' }}
                </el-button>
            </div>
        </div>


    </div>
</template>
<script src="../../js/view/project/ShowProjectDetailView.js"></script>
<style>
    .toolbar {
        background-color: #f2f6ff
    }

    .right-header {
        background-color: #f2f6ff
    }
    .plan-years{
        width: 100%;
    }

    .info-label {
        color: #55677d;
        margin-right: 10px;
        float: left;
        display: inline-block;
        word-break: break-all;
    }

    .info-val {
        float: left;
        display: inline-block;
        word-break: break-all;
    }
</style>

