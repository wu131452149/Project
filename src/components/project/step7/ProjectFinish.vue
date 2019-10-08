<template>
    <div class="show-finished-project-page wrap wrap-crowded clearfix">
        <!--查询条件 start-->
        <div class="general-search">
            <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">完工项目库查询</h5></div>
            <el-form :inline="true" ref="searchData" v-model="finishedProject.formData" style="padding-left: 30px">
                <div style="margin-bottom: 12px;">
                </div>
                <div class="inline-block">
                    <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">
                        <el-select v-model="finishedProject.formData.projectInstitution" name="projectInstitution"
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
                <div class="inline-block">
                    <el-form-item label="项目类型" prop="projectType" class="margin-r5">
                        <el-select v-model="finishedProject.formData.projectType" name="projectType"
                                   clearable placeholder="项目类型" class="width180">
                            <el-option :label="'新建'" :value="'新建'"></el-option>
                            <el-option :label="'存量'" :value="'存量'"></el-option>
                            <el-option :label="'改扩建'" :value="'改扩建'"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="inline-block">
                    <el-form-item label="项目名称" prop="" class="agent-select-label">
                        <el-input placeholder="按项目名称搜索" v-model="finishedProject.formData.projectName"
                                  required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                </div>
                <!--其他条件-->
                <div class="width100 other-condition">
                    <el-form-item label="项目周期" prop="projectYears" class="margin-r5">
                        <el-select v-model="finishedProject.formData.projectYears" clearable
                                   placeholder="项目周期">
                            <el-option :label="'3年'" :value="'3'"></el-option>
                            <el-option :label="'2年'" :value="'2'"></el-option>
                            <el-option :label="'1年'" :value="'1'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目编号" prop="projectContactUserName" class="margin-r6">
                        <el-input placeholder="按项目编号搜索" v-model="finishedProject.formData.id"
                                  required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                </div>
                <!--按钮-->
                <div class="text-c medium-btn">
                    <el-button type="primary" @click="queryFinishedProject(true)">查询</el-button>
                    <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                </div>
            </el-form>
        </div>
        <!--查询条件 end-->
        <div class="report-form element-table less-condition">
            <el-table
                :data="finishedProject.finishedProjectList"
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
                    <template slot-scope="scope">{{scope.row.stepSevenApp|renderStatus}}</template>
                </el-table-column>
                <el-table-column label="操作" width="200" class="text-c" v-if="user.grade==1">
                    <template slot-scope="scope">
                        <a @click.stop="editBudgetFinishTab($event,scope.row)">录入决算</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页 start-->
        <div class="text-r margin-t10">
            <div class="f-r clearFix">
                <div class="f-l pagination-total">
                    <a class="" v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"
                       @click="queryFinishedProjectCount">查询总数</a>
                    <span class="" v-else>共 <span>{{finishedProject.count}}</span> 条</span>
                </div>
                <el-pagination class="f-r"
                               @current-change="queryFinishedProject(false)"
                               layout="prev, pager, next, jumper"
                               :total="finishedProject.count"
                               :current-page.sync="finishedProject.currentPage"
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
            ref = "finishProject"
            size=55%
            :before-close="handleClose">
            <div class="scrollBar-inner" style="height: 500px;">
                <show-project-Detail @onListen="handleClose" :projectDetail="projectDetail" :step="7" :activeNames="activeNames" :showEdit="showEdit">

                </show-project-Detail>
                <!--录入决算信息-->
                <div v-if="user.grade==1 && showEdit" class="padding-0-20">
                    <span>项目决算信息录入</span>
                    <el-form :model="editBudgetFinish" :rules="rules" class="width300" ref="editBudgetPlan">
                        <el-form-item label="决算评审金额">
                            <el-input placeholder="请输入决算评审金额" v-model="editBudgetFinish.finishMoney" maxlength="15">
                                <template slot="append">万元</template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                        <el-button @click="closeForm">取 消</el-button>
                        <el-button type="primary" @click="commitFinishMoneyForm" :loading="loading">{{ loading ? '提交中 ...' : '确定' }}
                        </el-button>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script src="../../../js/view/project/step7/ProjectFinishView.js"></script>



