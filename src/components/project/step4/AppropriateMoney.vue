<!--预算资金拨付-->
<template>

    <!--预算资金拨付-->
    <div class="create-period-project wrap-crowded position-r clearfix">
        <!--查询条件 start-->
        <div class="general-search">
            <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">所有项目查询</h5></div>
            <el-form :inline="true" ref="searchData" v-model="appropriateMoneyProject.formData" style="padding-left: 30px">
                <div style="margin-bottom: 12px;">
                </div>
                <div class="inline-block" v-if="user.grade==1">
                    <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">
                        <el-select v-model="appropriateMoneyProject.formData.projectInstitution" name="projectInstitution"
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
                            <el-option v-for="item in projectInstitutionList" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="appropriateMoneyProject.formData.projectInstitution" placeholder="请选择项目单位"
                                   @change="selectLevelTwoChange">
                            <el-option v-for="item in newInstituation" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="inline-block">
                    <el-form-item label="项目类型" prop="projectType" class="margin-r5">
                        <el-select v-model="appropriateMoneyProject.formData.projectType" name="projectType"
                                   clearable placeholder="项目类型" class="width180">
                            <el-option :label="'新建'" :value="'新建'"></el-option>
                            <el-option :label="'存量'" :value="'存量'"></el-option>
                            <el-option :label="'改扩建'" :value="'改扩建'"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="inline-block">
                    <el-form-item label="项目名称" prop="projectName" class="agent-select-label">
                        <el-input placeholder="按项目名称搜索" v-model="appropriateMoneyProject.formData.projectName"
                                  required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                </div>
                <!--其他条件-->
                <div class="width100 other-condition">
                    <el-form-item label="资金安排周期" prop="projectYears" class="margin-r5">
                        <el-select v-model="appropriateMoneyProject.formData.projectYears" clearable
                                   placeholder="资金安排周期">
                            <el-option :label="'3年'" :value="'3'"></el-option>
                            <el-option :label="'2年'" :value="'2'"></el-option>
                            <el-option :label="'1年'" :value="'1'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目编号" prop="id" class="margin-r6">
                        <el-input placeholder="按项目编号搜索" v-model="appropriateMoneyProject.formData.id"
                                  required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                    <!--<el-button plain-->
                    <!--class="margin-t4 margin-l-5 color-blue border-blue"-->
                    <!--@click="showMoreQuery =! showMoreQuery">-->
                    <!--更多条件<i class="margin-l-5"-->
                    <!--:class="{'el-icon-arrow-down':!showMoreQuery,'el-icon-arrow-up':showMoreQuery}"></i>-->
                    <!--</el-button>-->
                </div>
                <!--按钮-->
                <div class="text-c medium-btn">
                    <el-button type="primary" @click="queryAppropriateMoneyProject(true)">查询</el-button>
                    <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                </div>
            </el-form>
        </div>
        <!--查询条件 end-->
        <div class="report-form element-table less-condition">
            <el-table
                :data="appropriateMoneyProject.appropriateMoneyProjectList"
                tooltip-effect="light"
                border
                @click.stop.prevent="stopPropagationPreventDef($event)"
                style="width: 100%;height: 100%;">
                <el-table-column show-overflow-tooltip prop="id" label="编号" width="60">
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
                <el-table-column show-overflow-tooltip prop="projectMoney" label="估算额(元)" width="80">
                    <template slot-scope="scope">{{scope.row.projectMoney}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectMoneyFrom" label="资金来源">
                    <template slot-scope="scope">{{scope.row.projectMoneyFrom|renderMoneyFrom}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectIndustry" label="所属行业">
                    <template slot-scope="scope">{{scope.row.projectIndustry|renderIndustry}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectBeginTime" label="拟开工时间" width="100">
                    <template slot-scope="scope">{{scope.row.projectBeginTime|renderBeginTime}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectYears" label="周期" width="50">
                    <template slot-scope="scope">{{scope.row.projectYears}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectContactUserName" label="项目联系人" width="100">
                    <template slot-scope="scope">{{scope.row.projectContactUserName}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectContactUserPhone" label="联系人电话" width="100">
                    <template slot-scope="scope">{{scope.row.projectContactUserPhone}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="stepFourApp" label="审核意见">
                    <template slot-scope="scope">{{scope.row.stepFourApp|renderStatus}}</template>
                </el-table-column>
                <!--拨付安排修改-->
                <el-table-column label="操作" class="text-c" v-if="user.grade==1">
                    <template slot-scope="scope">
                        <a @click.stop="editAppropriatePlanTab($event,scope.row)">拨付安排</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页 start-->
        <div class="text-r margin-t10">
            <div class="f-r clearFix">
                <div class="f-l pagination-total">
                    <a class="" v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"
                       @click="queryAppropriateMoneyProjectCount">查询总数</a>
                    <span class="" v-else>共 <span>{{appropriateMoneyProject.count}}</span> 条</span>
                </div>
                <el-pagination class="f-r"
                               @current-change="queryAppropriateMoneyProject(false)"
                               layout="prev, pager, next, jumper"
                               :total="appropriateMoneyProject.count"
                               :current-page.sync="appropriateMoneyProject.currentPage"
                >
                </el-pagination>
            </div>
        </div>
        <!--分页 end-->

        <el-drawer
            title="项目信息详情"
            :visible.sync="drawerDetails"
            :direction="direction"
            ref = "approMoney"
            custom-class="demo-drawer"
            size=66%
            :before-close="handleClose">
            <div style="overflow: auto;">
                <show-project-Detail @onListen="handleClose"
                                     @appStep4="handleAppStep4"
                                     @unAppStep4="handleAppStep4"
                                     :projectDetail="projectDetail"
                                     :step="4"
                                     :showButton = "showButton"
                                     :activeNames="activeNames"
                                     :showEdit="showEdit"
                                     :grade="user.grade">

                </show-project-Detail>

                <div v-if="user.grade==1 && showEdit" class="padding-0-20">
                    <span>预算拨付</span>
                    <el-form :model="editAppropriateMoneyProject" :rules="rules" class="width300"
                             ref="editAppropriateMoneyProject">
                        <el-form-item prop="type">
                            <el-date-picker type="date" placeholder="选择预算拨付时间"
                                            v-model="editAppropriateMoneyProject.years"></el-date-picker>
                            <el-select
                                v-model="editAppropriateMoneyProject.type"
                                style="margin-left: 20px;"
                                placeholder="请选择" required>
                                <el-option
                                    v-for="item in yearsPlanType"
                                    :key="item.value"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="money">
                            <el-input style="width: 100px;" placeholder="请输入金额" type="number"
                                      v-model="editAppropriateMoneyProject.money" maxlength="15" required>
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                        <!--1年显示一次-->

                    </el-form>
                    <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                        <el-button @click="closeForm">取 消</el-button>
                        <el-button type="primary" @click="commitAppMoneyForm" :loading="loading">{{ loading ? '提交中 ...' : '确定' }}
                        </el-button>
                    </div>
                </div>

            </div>
        </el-drawer>

    </div>

</template>

<script src="../../../js/view/project/step4/AppropriateMoneyView.js"></script>


