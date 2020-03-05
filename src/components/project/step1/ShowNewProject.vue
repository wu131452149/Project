<!--新建库、创建查看-审核-->
<template>
    <div class="show-new-project-page wrap wrap-crowded clearfix">
        <!--查询条件 start-->
        <div class="general-search">
            <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">新建项目库查询</h5></div>
            <el-form :inline="true" ref="searchData" v-model="newProject.formData" style="padding-left: 30px">
                <!--快捷查询 start-->
                <div class="quick-search clearFix" v-if="user.grade==0||user.grade==1">
                    <div class="f-l color-label">操作</div>
                    <div class="f-l el-tag-list margin-l-5">
                        <el-tag
                            class="margin-b5">
                            <el-button type="text" @click.stop="createNewProject($event)">新建项目</el-button>
                        </el-tag>
                    </div>
                </div>
                <!--快捷查询 end-->
                <div style="margin-bottom: 12px;">
                </div>
                <div class="inline-block" v-if="user.grade==1">
                    <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">
                        <el-select v-model="newProject.formData.projectInstitution" name="projectInstitution"
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
                        <el-select v-model="newProject.formData.projectInstitution" placeholder="请选择项目单位"
                                   @change="selectLevelTwoChange">
                            <el-option v-for="item in newInstituation" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="inline-block">
                    <el-form-item label="项目类型" prop="projectType" class="margin-r5">
                        <el-select v-model="newProject.formData.projectType" name="projectType"
                                   clearable placeholder="项目类型" class="width180">
                            <el-option :label="'新建'" :value="'新建'"></el-option>
                            <el-option :label="'存量'" :value="'存量'"></el-option>
                            <el-option :label="'改扩建'" :value="'改扩建'"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="inline-block">
                    <el-form-item label="项目名称" prop="projectName" class="agent-select-label">
                        <el-input placeholder="按项目名称搜索" v-model="newProject.formData.projectName"
                                  required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                </div>
                <!--其他条件-->
                <div class="width100 other-condition">
                    <el-form-item label="项目周期" prop="projectYears" class="margin-r5">
                        <el-select v-model="newProject.formData.projectYears" clearable
                                   placeholder="项目周期">
                            <el-option :label="'3年'" :value="'3'"></el-option>
                            <el-option :label="'2年'" :value="'2'"></el-option>
                            <el-option :label="'1年'" :value="'1'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目编号" prop="id" class="margin-r6">
                        <el-input placeholder="按项目编号搜索" v-model="newProject.formData.id"
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
                <!--更多查询条件-->
                <!--按钮-->
                <div class="text-c medium-btn">
                    <el-button type="primary" @click="queryNewProject(true)">查询</el-button>
                    <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                </div>
            </el-form>
        </div>
        <!--查询条件 end-->
        <!--表格start-->
        <div class="report-form element-table less-condition">
            <el-table
                :data="newProject.newProjectList"
                tooltip-effect="light"
                @click.stop.prevent="stopPropagationPreventDef($event)"
                style="width: 100%;height: 100%;">
                <el-table-column show-overflow-tooltip prop="id" label="项目编号" width="50">
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
                <el-table-column show-overflow-tooltip prop="projectMoney" label="项目估算总额（万元）">
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
                <el-table-column show-overflow-tooltip prop="projectYears" label="项目周期" width="50">
                    <template slot-scope="scope">{{scope.row.projectYears}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectContactUserName" label="项目联系人">
                    <template slot-scope="scope">{{scope.row.projectContactUserName}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="projectContactUserPhone" label="联系人电话">
                    <template slot-scope="scope">{{scope.row.projectContactUserPhone}}</template>
                </el-table-column>
                <el-table-column  show-overflow-tooltip prop="stepOneApp" label="审核意见">
                    <template slot-scope="scope">{{scope.row.stepOneApp|renderStatus}}</template>
                </el-table-column>
                <!--//阶段录入修改-->
                <el-table-column label="操作" class="text-c" v-if="user.grade==0||user.grade==1" width="150">
                    <template slot-scope="scope">
                        <a v-if="scope.row.stepOneApp==0" @click.stop="commitProjectAgain($event,scope.row)">重新录入</a>
                        <!--如果是未审核阶段才可以退库-->
                        <a v-if="scope.row.stepOneApp==2" @click.stop="returnProject($event,scope.row)">申请退库</a>
                        <a v-if="scope.row.stepOneApp==2 || scope.row.stepOneApp==0" @click.stop="deleteProject($event,scope.row)">删除</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--表格end-->
        <!--分页 start-->
        <div class="text-r margin-t10">
            <div class="f-r clearFix">
                <div class="f-l pagination-total">
                    <a class="" v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"
                       @click="queryNewProjectCount">查询总数</a>
                    <span class="" v-else>共 <span>{{newProject.count}}</span> 条</span>
                </div>
                <el-pagination class="f-r"
                               @current-change="queryNewProject(false)"
                               layout="prev, pager, next, jumper"
                               :total="newProject.count"
                               :current-page.sync="newProject.currentPage"
                >
                </el-pagination>
            </div>
        </div>
        <!--分页 end-->
        <!--储备项目列表 start-->
        <el-drawer
            title="项目信息录入"
            :visible.sync="drawerCreate"
            :direction="direction"
            custom-class="demo-drawer"
            ref="drawerNew"
            size=60%
            :before-close="handleClose">
            <project-new @onListen="closeDrawer"
                         :drawerClick="objDrawer"
                         @refreshPro="queryNewProject"
                         :reCommitProjectInfo = "projectDetail"
                         :type="commitType">

            </project-new>
        </el-drawer>
        <!--新建项目页面 end-->
        <!--储备项目列表 start-->
        <el-drawer
            title="项目信息详情"
            :visible.sync="drawerDetails"
            :direction="direction"
            custom-class="demo-drawer"
            ref="editProjectNew"
            size=66%
            :before-close="handleClose">
            <show-project-Detail @onListen="handleClose"
                                 @appStep1="handleAppStep1"
                                 @unAppStep1="handleAppStep1"
                                 :projectDetail="projectDetail"
                                 :step="1"
                                 :showButton = "showButton"
                                 :activeNames="activeNames">

            </show-project-Detail>
        </el-drawer>
        <!--新建项目页面 end-->
    </div>
</template>
<script src="../../../js/view/project/step1/ShowNewProjectView.js"></script>


