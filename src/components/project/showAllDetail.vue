<!--拟建库------------李莉红-->
<template>
    <!--录入项目信息-->
    <div class="project-new wrap wrap-crowded position-r clearfix scrollBar-inner">
        <el-form :model="editProject" :rules="rules" class="width300" ref="editProject">
            <!--新建step1-->
            <el-form-item label="项目单位" prop="projectInstitution">
                <el-select v-model="editProject.projectInstitution" placeholder="请选择项目单位">
                    <el-option
                        v-for="item in projectInstitution"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="财政归口股室" prop="projectFinance">
                <el-select v-model="editProject.projectFinance" placeholder="请选择财政归口股室">
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
                <el-input v-model="editProject.projectName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目类型">
                <!--存量，新建，改扩建-->
                <el-radio-group v-model="editProject.projectType">
                    <el-radio v-for="(item,index) in projectType" :label="item.name" :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="投资估算总额" prop="projectMoney">
                <el-input placeholder="请输入投资估算总额" type="number" v-model="editProject.projectMoney" maxlength="15">
                    <template slot="append">万元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="资金来源">
                <el-checkbox-group v-model="editProject.projectMoneyFrom">
                    <el-checkbox v-for="(item,index) in moneyFrom"
                                 :label="item.name" :key="item.index"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所属行业" style="width:800px;">
                <el-select v-model="editProject.projectIndustry.first" placeholder="请选择所属行业"
                           @change="selectFirstChange">
                    <el-option v-for="item in selectIndustry" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="editProject.projectIndustry.second" placeholder="请选择所属行业"
                           @change="selectSecondChange">
                    <el-option v-for="item in newIndustry" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="拟开工时间" prop="projectBeginTime">
                <el-date-picker type="date" placeholder="选择拟开工时间" v-model="editProject.projectBeginTime"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目建设周期" prop="projectYears">
                <el-radio-group v-model="editProject.projectYears">
                    <el-radio v-for="item in getProjectYears" :label="item.name" :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="项目联系人">
                <el-input v-model="editProject.projectContactUserName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话">
                <el-input v-model="editProject.projectContactUserPhone" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目基本情况">
                <el-input type="textarea" v-model="editProject.projectSituation"></el-input>
            </el-form-item>
            <!--step2-->
            <el-form-item label="政府批示" prop="gvApproval">
                <el-radio-group v-model="editProject.gvApproval">
                    <el-radio v-for="(item,index) in booleanData" :label="item.name"
                              :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="预算评审金额" prop="budgetReviewMoney">
                <el-input placeholder="请输入预算评审金额" type="number" v-model="editProject.budgetReviewMoney"
                          maxlength="15">
                    <template slot="append">万元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="评审文号" prop="approvalNumber" placeholder="请输入评审文号">
                <el-input v-model="editProject.approvalNumber" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="国有资产审批登记">
                <el-radio-group v-model="editProject.stateOwnedRegistration">
                    <el-radio v-for="(item,index) in booleanData" :label="item.name"
                              :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="项目政府采购">
                <el-radio-group v-model="editProject.gvBuy">
                    <el-radio v-for="(item,index) in booleanData" :label="item.name"
                              :value="item.value"></el-radio>
                </el-radio-group>
            </el-form-item>
            <!--step3-->
            <span v-if="editProject.planYearsMoneyList3.length>0">本级安排：</span>
            <div  v-for="(item,index31) in editProject.planYearsMoneyList3"  :key="index31+'-bjap'">
                <el-form-item :label="item.years"
                              :prop="'planYearsMoneyList3.'+index31+'.money'"
                              :rules="[{required: true, trigger: 'blur', validator: checkMoney3}]">
                    <!--累计县级预算安排总数 需小于等于预算评审金额-->
                    <el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
            </div>

            <span v-if="editProject.planYearsTopMoneyList3.length>0">上级安排：</span>
            <div  v-for="(item,index32) in editProject.planYearsTopMoneyList3"  :key="index32+'-sjap'">
                <el-form-item :label="item.years"
                              :prop="'planYearsTopMoneyList3.'+index32+'.money'"
                              :rules="[{required: true, trigger: 'blur', validator: checkMoney3}]">
                    <!--累计县级预算安排总数 需小于等于预算评审金额-->
                    <el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
            </div>
            <!--step4-->
            <span v-if="editProject.appropriateBudgetList4.length>0">本级拨付：</span>
            <div v-for="(item,index41) in editProject.appropriateBudgetList4" :key="index41+'-bjbf'">
                <el-form-item :label="item.date"
                              :prop="'appropriateBudgetList4.'+index41+'.money'"
                              :rules="[{required: true, trigger: 'blur', validator: checkMoney4}]">
                    <!--累计县级预算安排总数 需小于等于预算评审金额-->
                    <el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
            </div>

            <span v-if="editProject.appropriateTopBudgetList4.length>0">上级拨付：</span>
            <div v-for="(item,index42) in editProject.appropriateTopBudgetList4" :key="index42+'-sjbf'">
                <el-form-item :prop="'appropriateTopBudgetList4.'+index42+'.money'"
                              :label="item.date"
                              :rules="[{required: true, trigger: 'blur', validator: checkMoney4}]">
                    <!--累计县级预算安排总数 需小于等于预算评审金额-->
                    <el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
            </div>

            <!--step5-->
            <span v-if="editProject.addBudget.length>0">增加预算：</span>
            <div v-for="(item,index1) in editProject.addBudget" :key="index1+'-add'">
                <el-form-item :prop="'addBudget.'+index1+'.money'"
                              :label="item.date"
                              :rules="[{required: true, trigger: 'blur', validator: check2Money}]">
                    <el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
                <el-form-item :prop="'addBudget.'+index1+'.No'"
                              label="评审文号"
                              :rules="[{required: true, trigger: 'blur', validator: checkApprovalChangeNo}]">
                    <el-input placeholder="请输入评审文号" type="number" v-model="item.No" maxlength="20">
                    </el-input>
                </el-form-item>
                <el-form-item></el-form-item>
            </div>

            <span v-if="editProject.cutBudget.length>0">减少预算：</span>
            <div v-for="(item,index) in editProject.cutBudget" :key="index">
                <el-form-item :prop="'cutBudget.'+index+'.money'" :label="item.date"
                              :rules="[{required: true, trigger: 'blur', validator: checkMoney}]">
                    <el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
                <el-form-item :prop="'cutBudget.'+index+'.No'" label="评审文号"
                              :rules="[{required: true, trigger: 'blur', validator: checkApprovalChangeNo}]">
                    <el-input placeholder="请输入评审文号" type="number" v-model="item.No" maxlength="20">
                    </el-input>
                </el-form-item>
                <el-form-item></el-form-item>
            </div>

            <!--step6-->
            <el-form-item label="项目进度" prop="speed">
                <el-input placeholder="请输入进度" v-model="editProject.speed" maxlength="3">
                    <template slot="append">%</template>
                </el-input>
            </el-form-item>

            <span v-if="editProject.triInfoList.length>0">三方信息</span>
            <el-form :model="editProject" class="width300"
                     ref="editProject"
                     v-for="(item,index) in editProject.triInfoList">
                <el-form-item label="合同名称" prop="triName" class="padding-10">
                    <el-input placeholder="请输入合同名称" v-model="item.triName" maxlength="15">
                    </el-input>
                </el-form-item>
                <el-form-item label="合同金额" prop="triMoney" class="padding-10">
                    <el-input placeholder="请输入金额" v-model="item.triMoney" type="number" maxlength="15">
                        <template slot="append">万元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="triUserName" class="padding-10">
                    <el-input placeholder="请输入负责人" v-model="item.triUserName" maxlength="15">
                    </el-input>
                </el-form-item>
                <el-form-item label="负责人电话" prop="triPhone" class="padding-10">
                    <el-input placeholder="请输入负责人电话" v-model="item.triPhone" maxlength="15">
                    </el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="triBank" class="padding-10">
                    <el-input placeholder="请输入开户行" v-model="item.triBank">
                    </el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop="triCardNo" class="padding-10">
                    <el-input placeholder="请输入银行卡号" v-model="item.triCardNo">
                    </el-input>
                </el-form-item>
                <el-form-item label="" class="padding-10">
                </el-form-item>
            </el-form>

            <!--step7-->
            <el-form-item label="决算评审金额">
                <el-input placeholder="请输入决算评审金额" type="number" v-model="editProject.finishMoney"
                          maxlength="15">
                    <template slot="append">万元</template>
                </el-input>
            </el-form-item>
        </el-form>
        <!--step3-->
        <!--<span v-if="editProject.planYearsMoneyList3.length>0">本级安排：</span>-->
        <!--<el-form :model="editProject" :rules="rules3" class="width300" ref="planYearsMoneyList3"-->
        <!--v-for="(item,index) in editProject.planYearsMoneyList3">-->
        <!--<el-form-item prop="money" :label="item.years"  v-for="(item,index) in editProject.planYearsMoneyList3">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<span v-if="editProject.planYearsTopMoneyList3.length>0">上级安排：</span>-->
        <!--<el-form :model="editProject" :rules="rules3" class="width300"-->
        <!--ref="planYearsTopMoneyList3" v-for="(item,index) in editProject.planYearsTopMoneyList3">-->
        <!--<el-form-item prop="money" :label="item.years" v-for="(item,index) in editProject.planYearsTopMoneyList3">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->

        <!--step4-->
        <!--<span v-if="editProject.appropriateBudgetList4.length>0">本级拨付：</span>-->
        <!--<el-form :rules="rules4" class="width300" ref="editProject.appropriateBudgetList4"-->
        <!--v-for="(item,index) in editProject.appropriateBudgetList4">-->
        <!--<el-form-item prop="money" :label="item.date" v-for="(item,index) in editProject.appropriateBudgetList4">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<span v-if="editProject.appropriateTopBudgetList4.length>0">上级拨付：</span>-->
        <!--<el-form :model="editProject" :rules="rules4" class="width300" ref="appropriateBudgetList4"-->
        <!--v-for="(item,index) in editProject.appropriateTopBudgetList4">-->
        <!--<el-form-item prop="money" :label="item.date" v-for="(item,index) in editProject.appropriateTopBudgetList4">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--step5-->
        <!--<span v-if="editProject.addBudget.length>0">增加预算：</span>-->
        <!--<el-form :rules="rules5" class="width300" ref="addBudget"-->
        <!--v-for="(item,index) in editProject.addBudget">-->
        <!--<el-form-item prop="money" :label="item.date">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->

        <!--</el-form-item>-->
        <!--<el-form-item prop="approvalChangeNo" label="评审文号">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入评审文号" type="number" v-model="item.No" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->

        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<span v-if="editProject.cutBudget.length>0">减少预算：</span>-->
        <!--<el-form :rules="rules5" class="width300" ref="cutBudget"-->
        <!--v-for="(item,index) in editProject.cutBudget">-->
        <!--<el-form-item prop="money" :label="item.date">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入金额" type="number" v-model="item.money" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->

        <!--</el-form-item>-->
        <!--<el-form-item prop="approvalChangeNo" label="评审文号">-->
        <!--&lt;!&ndash;累计县级预算安排总数 需小于等于预算评审金额&ndash;&gt;-->
        <!--<el-input placeholder="请输入评审文号" type="number" v-model="item.No" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->

        <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<span v-if="editProject.triInfoList.length>0">三方信息</span>-->
        <!--<el-form :rules="rules" class="width300" ref="editProject.triInfoList"-->
        <!--v-for="(item,index) in editProject.triInfoList">-->
        <!--<el-form-item label="合同名称" prop="triName" class="padding-10">-->
        <!--<el-input placeholder="请输入合同名称" v-model="item.triName" maxlength="15">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="合同金额" prop="triMoney" class="padding-10">-->
        <!--<el-input placeholder="请输入金额" v-model="item.triMoney" type="number" maxlength="15">-->
        <!--<template slot="append">万元</template>-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="负责人" prop="triUserName" class="padding-10">-->
        <!--<el-input placeholder="请输入负责人" v-model="item.triUserName" maxlength="15">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="负责人电话" prop="triPhone" class="padding-10">-->
        <!--<el-input placeholder="请输入负责人电话" v-model="item.triPhone" maxlength="15">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="开户行" prop="triBank" class="padding-10">-->
        <!--<el-input placeholder="请输入开户行" v-model="item.triBank">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="银行卡号" prop="triCardNo" class="padding-10">-->
        <!--<el-input placeholder="请输入银行卡号" v-model="item.triCardNo">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="" class="padding-10">-->
        <!--</el-form-item>-->
        <!--</el-form>-->
        <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="commitEditForm" :loading="loading">{{ loading ? '提交中 ...' : '提交' }}
            </el-button>
        </div>

    </div>

</template>

<style src="../../css/NewMediaGlobal.css"></style>
<script src="../../js/view/project/ShowAllDetailView.js"></script>
<style>
    .width300 .el-form-item__label {
        width: 130px;
    }

    .width300 .el-form-item .el-form-item__content {
        display: inline-block;
    }
</style>



