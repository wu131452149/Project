<template>
    <div>
        <!--查询条件 start-->
        <div class="general-search">
            <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">所有项目查询</h5></div>
            <el-form :inline="true" ref="searchData" v-model="proAndTriProject.formData" style="padding-left: 30px">
                <div style="margin-bottom: 12px;">
                </div>
                <div class="inline-block">
                    <el-form-item class="agent-select-label" label="项目单位" prop="projectInstitution">
                        <el-select v-model="proAndTriProject.formData.projectInstitution" name="projectInstitution"
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
                        <el-select v-model="proAndTriProject.formData.projectType" name="projectType"
                                   clearable placeholder="项目类型" class="width180">
                            <el-option :label="'新建'" :value="'新建'"></el-option>
                            <el-option :label="'存量'" :value="'存量'"></el-option>
                            <el-option :label="'改扩建'" :value="'改扩建'"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="inline-block">
                    <el-form-item label="项目名称" prop="" class="agent-select-label">
                        <el-input placeholder="按项目名称搜索" v-model="proAndTriProject.formData.projectName"
                                  required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                </div>
                <!--其他条件-->
                <div class="width100 other-condition">
                    <el-form-item label="项目周期" prop="projectYears" class="margin-r5">
                        <el-select v-model="proAndTriProject.formData.projectYears" clearable
                                   placeholder="项目周期">
                            <el-option :label="'3年'" :value="'3'"></el-option>
                            <el-option :label="'2年'" :value="'2'"></el-option>
                            <el-option :label="'1年'" :value="'1'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目编号" prop="projectContactUserName" class="margin-r6">
                        <el-input placeholder="按项目编号搜索" v-model="proAndTriProject.formData.id"
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
                <!--<div v-show="showMoreQuery" class="more-query">-->
                <!--<el-form-item label="项目联系人" prop="projectContactUserName" class="margin-r6">-->
                <!--<el-input placeholder="按项目联系人搜索" v-model="proAndTriProject.formData.projectContactUserName"-->
                <!--@change="changeQuickQuery('CusNickName')" required-->
                <!--prefix-icon="el-icon-search"-->
                <!--class="input-with-select nick-name-input"></el-input>-->
                <!--</el-form-item>-->
                <!--</div>-->
                <!--按钮-->
                <div class="text-c medium-btn">
                    <el-button type="primary" @click="queryProAndTriProject(true)">查询</el-button>
                    <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                </div>
            </el-form>
        </div>
        <!--查询条件 end-->
        <!--ProjectProgressAndTriInfo.vue工程进度和三方信息-->
        <div class="report-form element-table less-condition">
            <el-table
                :data="proAndTriProject.proAndTriProjectList"
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
                    <template slot-scope="scope">{{scope.row.stepSixApp|renderStatus}}</template>
                </el-table-column>
                <!--//阶段录入修改-->
                <el-table-column label="操作" class="text-c" width="200" v-if="user.grade==1">
                    <template slot-scope="scope">
                        <a @click.stop="editProgressTab($event,scope.row)">更新项目进度</a>
                        <a @click.stop="editTriTab($event,scope.row)">录入第三方信息</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--分页 start-->
        <div class="text-r margin-t10">
            <div class="f-r clearFix">
                <div class="f-l pagination-total">
                    <a class="" v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"
                       @click="queryProAndTriProjectCount">查询总数</a>
                    <span class="" v-else>共 <span>{{proAndTriProject.count}}</span> 条</span>
                </div>
                <el-pagination class="f-r"
                               @current-change="queryProAndTriProject(false)"
                               layout="prev, pager, next, jumper"
                               :total="proAndTriProject.count"
                               :current-page.sync="proAndTriProject.currentPage"
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
            ref = "proAndTri"
            size=55%
            :before-close="handleClose">
            <div style="overflow: auto;height: 500px;">
                <show-project-Detail @onListen="handleClose" :projectDetail="projectDetail" :step="6">

                </show-project-Detail>

                <div v-if="user.grade==1 && showEdit" class="padding-0-20">
                    <div v-if="showPro">
                        <span>项目进度</span>
                        <el-form :model="editPro" :rules="rules" class="width300" ref="editPro">
                            <!--1年显示一次-->
                            <el-form-item label="项目进度" prop="speed">
                                <el-input placeholder="请输入进度" v-model="editPro.speed" maxlength="3">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-form-item>
                            <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                                <el-button @click="closeForm">取 消</el-button>
                                <el-button type="primary" @click="commitProgress" :loading="loading">{{ loading ? '提交中...' : '确定' }}
                                </el-button>
                            </div>
                        </el-form>
                    </div>
                    <div v-if="showTri">
                        <span>三方信息</span>
                        <el-form :model="TriInfo" :rules="rules" class="width300" ref="TriInfo">
                            <!--1年显示一次-->
                            <el-form-item label="合同名称" prop="agreementName" class="padding-10">
                                <el-input placeholder="请输入合同名称" v-model="TriInfo.agreementName" maxlength="15">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="合同金额" prop="agreementMoney"  class="padding-10">
                                <el-input placeholder="请输入金额" v-model="TriInfo.agreementMoney" maxlength="15">
                                    <template slot="append">万元</template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="负责人" prop="agreementUserName"  class="padding-10">
                                <el-input placeholder="请输入负责人" v-model="TriInfo.agreementUserName" maxlength="15">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="负责人电话" prop="agreementUserPhone"  class="padding-10">
                                <el-input placeholder="请输入负责人电话" v-model="TriInfo.agreementUserPhone" maxlength="15">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="开户行" prop="agreementBank"  class="padding-10">
                                <el-input placeholder="请输入开户行" v-model="TriInfo.agreementBank">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="银行卡号" prop="agreementCardNo" class="padding-10">
                                <el-input placeholder="请输入银行卡号" v-model="TriInfo.agreementCardNo">
                                </el-input>
                            </el-form-item>

                        </el-form>
                        <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                            <el-button @click="closeForm">取 消</el-button>
                            <el-button type="primary" @click="commitTri" :loading="loading">{{ loading ? '提交中...' : '确定' }}
                            </el-button>
                        </div>
                    </div>
                </div>

            </div>
        </el-drawer>
    </div>
</template>
<script src="../../../js/view/project/step6/ProjectProgressAndTriInfoView.js"></script>


