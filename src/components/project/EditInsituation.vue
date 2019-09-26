<!--添加二级单位-->
<template>
    <div class="edit-department scrollBar-inner wrap" style="height: 514px;">
        <!--查询条件 start-->
        <div class="general-search">
            <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">单位查询</h5></div>
            <el-form :inline="true" ref="searchData" v-model="institution.formData" style="padding-left: 30px">
                <!--快捷查询 start-->
                <div class="quick-search clearFix">
                    <div class="f-l color-label">新建单位 </div>
                    <div class="f-l el-tag-list margin-l-12 width188">
                        <el-input v-model="newInstitution"></el-input>
                        <el-tag
                            class="margin-b5">
                            <el-button type="text" @click.stop="createInstitution($event)">保存</el-button>
                        </el-tag>
                    </div>
                </div>
                <!--快捷查询 end-->
                <div style="margin-bottom: 12px;">
                <div class="inline-block">
                    <el-form-item label="单位名称" prop="" class="agent-select-label">
                        <el-input placeholder="按单位名称搜索" v-model="queryInstitutionName"
                                  @change="changeQuickQuery('name')" required
                                  prefix-icon="el-icon-search"
                                  class="input-with-select nick-name-input"></el-input>
                    </el-form-item>
                </div>
                </div>
                <!--按钮-->
                <div class="text-c medium-btn">
                    <el-button type="primary" @click="queryInstitution(true)">查询</el-button>
                    <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                </div>
            </el-form>
        </div>
        <!--查询条件 end-->
        <!--表格start-->
        <div class="report-form element-table less-condition">
            <el-table
                ref="multipleTable"
                :data="institution.institutionList"
                tooltip-effect="light"
                @click.stop.prevent="stopPropagationPreventDef($event)"
                @selection-change="handleSelectionChange"
                style="width: 100%;">
                <el-table-column show-overflow-tooltip prop="name" label="单位名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="userName" label="添加单位用户">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="time" label="时间">
                    <template slot-scope="scope">{{scope.row.time}}</template>
                </el-table-column>
            </el-table>
        </div>
        <!--表格end-->
        <!--分页 start-->
        <div class="text-r margin-t10">
            <div class="f-r clearFix">
                <div class="f-l pagination-total">
                    <a class=""v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"  @click="queryInstitutionCount">查询总数</a>
                    <span class=""  v-else >共 <span>{{institution.count}}</span> 条</span>
                </div>
                <el-pagination class="f-r"
                               @current-change ="queryInstitution(false)"
                               layout="prev, pager, next, jumper"
                               :total="institution.count"
                               :current-page.sync ="institution.currentPage"
                >
                </el-pagination>
            </div>

        </div>
        <!--分页 end-->

    </div>
</template>
<script src="../../js/view/project/EditInsituationView.js"></script>

