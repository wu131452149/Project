<template>
    <div class="budget-years-plan">
        <div class="report-form element-table less-condition">
            <el-table
                :data="budgetYearsPlanProject.budgetYearsPlanProjectList"
                tooltip-effect="light"
                @click.stop.prevent="stopPropagationPreventDef($event)"
                style="width: 100%;">
                <el-table-column show-overflow-tooltip prop="id" label="项目编号" width="100">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectInstitution" label="项目单位">
                    <template slot-scope="scope">{{scope.row.projectInstitution}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectName" label="项目名称">
                    <template slot-scope="scope"><a @click.stop="showNewProjectDetails($event,scope.row)">{{scope.row.projectName}}</a>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectType" label="项目类型">
                    <template slot-scope="scope">{{scope.row.projectType}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectMoney" label="项目估算总额（万元）" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.projectMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectMoneyFrom" label="资金来源">
                    <template slot-scope="scope">{{scope.row.projectMoneyFrom|renderMoneyFrom}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectIndustry" label="所属行业">
                    <template slot-scope="scope">{{scope.row.projectIndustry|renderIndustry}}</template>
                </el-table-column>
                <el-table-column width="70px" prop="projectCreateTime" label="拟开工时间">
                    <template slot-scope="scope">{{scope.row.projectBeginTime}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectYears" label="项目周期" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.projectYears}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="95px" prop="projectContactUserName" label="项目联系人">
                    <template slot-scope="scope">{{scope.row.projectContactUserName}}</template>
                </el-table-column>
                <el-table-column width="95px" prop="projectContactUserPhone" label="联系人电话">
                    <template slot-scope="scope">{{scope.row.projectContactUserPhone}}</template>
                </el-table-column>
                <el-table-column width="95px" prop="projectContactUserPhone" label="审核意见">
                    <template slot-scope="scope">{{scope.row.stepThreeApp|renderStatus}}</template>
                </el-table-column>
                <!--//阶段录入修改-->
                <el-table-column label="操作" width="200" class="text-c" v-if="user.grade==1 ||user.grade==0 ">
                    <template slot-scope="scope">
                        <a @click.stop="editBudgetYearsPlanTab($event,scope.row)">预算安排</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页 start-->
        <div class="text-r margin-t10">
            <div class="f-r clearFix">
                <div class="f-l pagination-total">
                    <a class="" v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"
                       @click="queryBudgetYearsPlanProjectCount">查询总数</a>
                    <span class="" v-else>共 <span>{{budgetYearsPlanProject.count}}</span> 条</span>
                </div>
                <el-pagination class="f-r"
                               @current-change="queryBudgetYearsPlanProject(false)"
                               layout="prev, pager, next, jumper"
                               :total="budgetYearsPlanProject.count"
                               :current-page.sync="budgetYearsPlanProject.currentPage"
                >
                </el-pagination>
            </div>
        </div>
        <!--分页 end-->

        <el-drawer
            title="项目信息详情"
            :visible.sync="drawerDetails"
            :direction="direction"
            custom-class="demo-drawer"
            size=55%
            :before-close="handleClose">
            <div class="scrollBar-inner" style="height: 430px;">
                <show-project-Detail @onListen="handleClose" :projectDetail="projectDetail" :step="3">

                </show-project-Detail>

                <div v-if="user.grade==1 && showEdit" class="padding-0-20">
                    <span>县级预算分年度安排</span>
                    <el-form :model="editBudgetYearsPlan" :rules="rules" class="width300" ref="editBudgetYearsPlan">
                        <!--1年显示一次-->
                        <el-form-item prop="money">
                            <el-select v-model="editBudgetYearsPlan.years" placeholder="请选择年份">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>

                            <el-select
                                v-model="editBudgetYearsPlan.type"
                                style="margin-left: 20px;"
                                placeholder="请选择类型" v-if="!projectDetail.planYearsSelfMoney">
                                <el-option
                                    v-for="item in yearsPlanType"
                                    :key="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select
                                v-model="editBudgetYearsPlan.type"
                                style="margin-left: 20px;"
                                placeholder="请选择" v-if="projectDetail.planYearsSelfMoney">
                                <el-option
                                    v-for="item in yearsOptionType"
                                    :key="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <!--累计县级预算安排总数 需小于等于预算评审金额-->
                            <el-input placeholder="请输入金额" v-model="editBudgetYearsPlan.money" maxlength="15">
                                <template slot="append">万元</template>
                            </el-input>
                        </el-form-item>
                        <!--1年显示一次-->

                    </el-form>
                    <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                        <el-button @click="closeForm">取 消</el-button>
                        <el-button type="primary" @click="commitBudgetYearsPlanForm" :loading="loading">{{ loading ? '提交中 ...' : '确定' }}
                        </el-button>
                    </div>
                </div>

            </div>
        </el-drawer>
    </div>

</template>

<script src="../../../js/view/project/step3/BudgetYearsPlanView.js"></script>

