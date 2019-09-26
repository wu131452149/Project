<template>
    <div class="home-contain wrap">
        <!--监控地方-->
        <el-tabs v-model="userInfoActiveName">
            <el-tab-pane label="项目监控" name="pro-monitor">
                <div class="home-monitor element-table th-bold">
                    <div><i class="fa fa-bar-chart"></i><h5 class="inline-block">项目统计</h5></div>
                    <div class="el-row is-justify-space-around el-row--flex">
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>待审核项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                    <div><span>金额：</span>
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>审核通过项目</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                    <div><span>金额：</span>
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="el-col el-col-4">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>入库项目（已发布）</span>
                                </div>
                                <div class="text item">
                                    <div><span>个数：</span>
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                    <div><span>金额：</span>
                                        <el-button>{{ o }}</el-button>
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
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                    <div><span>金额：</span>
                                        <el-button>{{ o }}</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>

                    </div>
                </div>
                <div class="home-monitor-hint">
                    <div><i class="fa fa-bar-chart"></i><h5 class="inline-block">项目流程</h5></div>
                    <el-container style="height: 500px; border: 1px solid #eee">
                        <el-main class="scrollBar-inner">
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
                        </el-main>

                    </el-container>
                </div>
            </el-tab-pane>
            <el-tab-pane label="项目统计详情" name="all-pro-details">
                <!--查询条件 start-->
                <div class="general-search">
                    <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">所有项目查询</h5></div>
                    <el-form :inline="true" ref="searchData" v-model="allProject.formData" style="padding-left: 30px">
                        <div style="margin-bottom: 12px;">
                        </div>
                        <div class="inline-block">
                            <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">
                                <el-select v-model="allProject.formData.projectInstitution" name="skillGroup"
                                           @change="changeQuickQuery('projectInstitution')" clearable placeholder="项目单位"
                                           class="width180">
                                    <el-option
                                        v-for="item in projectInstitutionList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="inline-block">
                            <el-form-item label="项目类型" prop="projectType" class="margin-r5">
                                <el-select v-model="allProject.formData.projectType" name="skillGroup"
                                           @change="changeQuickQuery('projectType')" clearable placeholder="项目类型"
                                           class="width180">
                                    <el-option :label="'新建'" :value="'new'"></el-option>
                                    <el-option :label="'存量'" :value="'old'"></el-option>
                                    <el-option :label="'改扩建'" :value="'edit'"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="inline-block">
                            <el-form-item label="项目名称" prop="" class="agent-select-label">
                                <el-input placeholder="按项目名称搜索" v-model="allProject.formData.projectName"
                                          @change="changeQuickQuery('CusNickName')" required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                        </div>
                        <!--其他条件-->
                        <div class="width100 other-condition">
                            <el-form-item label="资金来源" prop="" class="margin-r5">
                                <el-select v-model="allProject.formData.projectMoneyFrom"
                                           @change="changeQuickQuery('projectMoneyFrom')" clearable
                                           placeholder="资金来源">
                                    <el-option :label="'财政资金（上级）'" :value="'highFinance'"></el-option>
                                    <el-option :label="'财政资金（本级）'" :value="'localFinance'"></el-option>
                                    <el-option :label="'自筹'" :value="'independently'"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="项目联系人" prop="projectContactUserName" class="margin-r6">
                                <el-input placeholder="按项目联系人搜索" v-model="allProject.formData.projectContactUserName"
                                          @change="changeQuickQuery('CusNickName')" required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                            <el-button plain
                                       class="margin-t4 margin-l-5 color-blue border-blue"
                                       @click="showMoreQuery =! showMoreQuery">
                                更多条件<i class="margin-l-5"
                                       :class="{'el-icon-arrow-down':!showMoreQuery,'el-icon-arrow-up':showMoreQuery}"></i>
                            </el-button>
                        </div>
                        <!--更多查询条件-->
                        <div v-show="showMoreQuery" class="more-query">
                            <el-form-item label="项目联系人" prop="projectContactUserName" class="margin-r6">
                                <el-input placeholder="按项目联系人搜索" v-model="allProject.formData.projectContactUserName"
                                          @change="changeQuickQuery('CusNickName')" required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                        </div>
                        <!--按钮-->
                        <div class="text-c medium-btn">
                            <el-button type="primary" @click="queryallProject(true)">查询</el-button>
                            <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                        </div>
                    </el-form>
                </div>
                <!--查询条件 end-->
                <!--表格start-->
                <div class="report-form element-table less-condition">
                    <el-table
                        :data="allProject.allProjectList"
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
                            <template slot-scope="scope"><a @click.stop="showAllProjectDetails($event,scope.row)">{{scope.row.projectName}}</a>
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
                            <template slot-scope="scope">{{scope.row.stepOneApp|renderStatus}}</template>
                        </el-table-column>
                        <!--//阶段录入修改-->
                        <el-table-column label="操作" class="text-c" v-if="user.grade==1">
                            <template slot-scope="scope">
                                <a @click.stop="updateNewProject($event,scope.row)">重新入库</a>
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
                               @click="queryAllProjectCount">查询总数</a>
                            <span class="" v-else>共 <span>{{allProject.count}}</span> 条</span>
                        </div>
                        <el-pagination class="f-r"
                                       @current-change="queryReturnProjectCount(false)"
                                       layout="prev, pager, next, jumper"
                                       :total="allProject.count"
                                       :current-page.sync="allProject.currentPage"
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
                    <show-project-Detail @onListen="handleClose" :projectDetail="projectDetail" :step="7">

                    </show-project-Detail>
                </el-drawer>
                <!--新建项目页面 end-->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script src="../../js/view/index/Home.js"></script>
<style src="../../css/index/knowledge.css" scoped></style>

