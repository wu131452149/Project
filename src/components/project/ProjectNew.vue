<!--拟建库------------李莉红-->
<template>
    <!--录入项目信息-->

    <div class="project-new wrap wrap-crowded position-r clearfix scrollBar-inner" style="height: 520px;">
        <el-form :model="createProject" :rules="rules" class="width300" ref="createProject">
            <el-form-item label="项目单位" prop="projectInstitution">
                <el-select v-model="createProject.projectInstitution" placeholder="请选择项目单位">
                    <el-option
                        v-for="item in projectInstitution"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="财政归口股室">
                <el-select v-model="createProject.projectFinance" placeholder="请选择财政归口股室">
                    <el-option label="行政政法股" value="行政政法股"></el-option>
                    <el-option label="科教文股" value="科教文股"></el-option>
                    <el-option label="社会保障股" value="社会保障股"></el-option>
                    <el-option label="农业股" value="农业股"></el-option>
                    <el-option label="经建一股" value="经建一股"></el-option>
                    <el-option label="经建二股" value="经建二股"></el-option>
                    <el-option label="综合股" value="综合股"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="createProject.projectName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目类型">
                <!--存量，新建，改扩建-->
                <el-radio-group v-model="createProject.projectType">
                    <el-radio v-for="(item,index) in projectType" :label="item.name" :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投资估算总额" prop="projectMoney">
                <el-input placeholder="请输入投资估算总额" v-model="createProject.projectMoney" maxlength="15">
                    <template slot="append">万元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="资金来源">
                <el-checkbox-group v-model="createProject.projectMoneyFrom">
                    <el-checkbox v-for="item in moneyFrom"
                                 :label="item.name" :key="item.index"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所属行业" style="width:800px;">
                <el-select v-model="createProject.projectIndustry.first" placeholder="请选择所属行业"
                           @change="selectFirstChange">
                    <el-option v-for="item in selectIndustry" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="createProject.projectIndustry.second" placeholder="请选择所属行业"
                           @change="selectSecondChange">
                    <el-option v-for="item in newIndustry" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拟开工时间">
                <el-date-picker type="date" placeholder="选择拟开工时间" v-model="createProject.projectBeginTime"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目建设周期" prop="projectYears">
                <el-radio-group v-model="createProject.projectYears">
                    <el-radio v-for="item in getProjectYears" :label="item.name" :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="项目联系人">
                <el-input v-model="createProject.projectContactUserName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话">
                <el-input v-model="createProject.projectContactUserPhone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目基本情况">
                <el-input type="textarea" v-model="createProject.projectSituation"></el-input>
            </el-form-item>
        </el-form>
        <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
            <el-button @click="closeForm">取 消</el-button>
            <el-button v-if="!type" type="primary" @click="commitForm" :loading="loading">{{ loading ? '提交中 ...' : '提交' }}
            </el-button>
            <el-button v-if="type=='recommit'" type="primary" @click="updateForm(1)" :loading="loading">{{ loading ? '提交中 ...' : '重新提交' }}
            </el-button>
            <el-button v-if="type=='returned'" type="primary" @click="updateForm(0)" :loading="loading">{{ loading ? '提交中 ...' : '重新入库' }}
            </el-button>
        </div>

    </div>

</template>

<style src="../../css/NewMediaGlobal.css"></style>
<script src="../../js/view/project/ProjectNewView.js"></script>
<style>
    .width300 .el-form-item__label {
        width: 130px;
    }

    .width300 .el-form-item .el-form-item__content {
        display: inline-block;
    }
</style>



