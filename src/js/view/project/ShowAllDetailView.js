/**
 * 这个文件主要是修改项目每项
 *  created by LilyLee on 2020/3/18.
 **/
import Utils from "../../lib/utils/Utils";
import EventBus from "../../lib/event/EventBus";


export default {
    name: "ShowAllDetailView",
    props: ['projectDetail','drawerClick'],
    data() {
        return {
            dialog: false,
            drawer: false,
            drawerCreated: false,
            loading: false,
            direction: 'rtl',
            defaultDate: new Date(),
            newProject: [],
            projectInstitution: [],
            planYearsMoneyList3: [],
            appropriateBudgetList4: [],
            appropriateTopBudgetList4: [],
            cutBudget: [],
            addBudget: [],
            triInfoList: [],
            editProject: {
                projectInstitution: "",
                projectFinance: "行政政法股",
                projectName: "",
                projectType: "新建",
                projectMoney: "",
                projectIndustry: {
                    first: "",
                    second: ""
                },
                projectMoneyFrom: [],
                projectBeginTime: "",
                projectContactUserName: "",
                projectContactUserPhone: "",
                projectSituation: "",
                projectYears: 1,
                //第2步
                gvApproval: "是",//政府批示
                budgetReviewMoney: "",
                approvalNumber: "",
                stateOwnedRegistration: "是",
                gvBuy: "是",
                //fileList: [],
                //第6
                speed: "",//进度
                //第7
                finishMoney: "",
                planYearsMoneyList3: [],
                planYearsTopMoneyList3: [],//没有定义的话就不可以编辑
                appropriateBudgetList4: [],
                appropriateTopBudgetList4: [],
                cutBudget: [],
                addBudget: [],
                triInfoList: [],
            },
            rules: {
                projectInstitution: [
                    {required: true, message: '请选择项目单位', trigger: 'change'}
                ],
                projectFinance: [
                    {required: true, message: '请选择财政归口股室', trigger: 'change'}
                ],
                projectName: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'},
                ],
                projectMoney: [
                    {required: true, message: '请输入投资估算总额', trigger: 'blur'},
                ],
                projectYears: [
                    {required: true, message: '请选择项目建设周期', trigger: 'change'},
                ],
                projectBeginTime: [
                    {required: true, message: '请选择项目开工时间', trigger: 'change'},
                ],
                budgetReviewMoney: [
                    {required: true, message: '请输入预算评审金额', trigger: 'blur'},
                ],
                approvalNumber: [
                    {required: true, message: '请输入评审文号', trigger: 'blur'},
                ],
                // money: [
                //     {required: true, trigger: 'blur', validator: checkMoney},
                // ],
                type: [
                    {required: true, message: '请选择拨付类型', trigger: 'change'},
                ],

            },
            newIndustry: [],
            selectIndustry: Utils.getIndustryData(),
            moneyFrom: Utils.getMoneyFrom(),
            projectType: Utils.getProjectType(),
            getProjectYears: Utils.getProjectYears(),
            user: {},
            //第2步
            booleanData: [{name: "是", value: 1}, {name: "否", value: 0}],
            //第3步
            yearsPlanType: Utils.getYearsPlanType(),//3个
            yearsOptionType: Utils.getOptionYears(),//如果有自筹金额了就不用显示自筹的修改了
            //第4步，
            options: [],
            yearsPlanType4: Utils.getOptionYears(),
        }

    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        //self.projectInstitution = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryInstitution(function (list) {
            self.projectInstitution = list;
        })
    },
    computed: {

    },
    methods: {
        checkMoney4: function (rule, value, callback) {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            //累计拨付小于累计安排，累计安排总数yearsPlanTotalMoneyNo，累计拨付总数approTotalPlanMoneyNo
            if (!self.editProject1.approTotalPlanMoneyNo) {
                self.editProject1.approTotalPlanMoneyNo = 0;
            }
            //未审核的拨付也要算上总数
            var bjbf = 0;
            var sjbf = 0;
            var bjap = 0;
            var sjap = 0;
            //本级拨付
            var appropriateTotalBudgetList = self.editProject.appropriateBudgetList4;
            for (var a = 0; a < appropriateTotalBudgetList.length; a++) {
                bjbf = bjbf + Number(appropriateTotalBudgetList[a].money);
            }
            console.log("本级拨付", bjbf);
            //上级拨付
            var appropriateBudgetList = self.editProject.appropriateTopBudgetList4;
            for (var b = 0; b < appropriateBudgetList.length; b++) {
                sjbf = sjbf + Number(appropriateBudgetList[b].money);
            }
            console.log("上级拨付", sjbf);
            //本级安排
            var yearsPlanTotalMoneyList = self.editProject.planYearsMoneyList3;
            for (var c = 0; c < yearsPlanTotalMoneyList.length; c++) {

                bjap = bjap + Number(yearsPlanTotalMoneyList[c].money);
            }
            console.log("本级安排", bjap);
            //上级安排
            var yearsPlanTotalTopMoneyList = self.editProject.planYearsTopMoneyList3;
            for (var d = 0; d < yearsPlanTotalTopMoneyList.length; d++) {
                sjap = sjap + Number(yearsPlanTotalTopMoneyList[d].money);
            }
            console.log("上级安排", sjap);
            //self.projectDetail.approTotalPlanMoneyNo是审核通过的不用了
            if (Number(bjbf) > bjap) {
                callback(new Error('累计本级拨付总数必须小于等于本级累计安排总数'));
            } else {
                callback();
            }
            if (Number(sjbf) > sjap) {
                callback(new Error('累计上级拨付总数必须小于等于累计上级安排总数'));
            } else {
                callback();
            }
        },
        checkMoney3: function (rule, value, callback) {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            console.log(self);
            var total1 = 0;
            for (var x = 0; x < self.editProject.planYearsMoneyList3.length; x++) {
                total1 = total1 + Number(self.editProject.planYearsMoneyList3[x].money);
            }
            var total2 = 0;
            for (var y = 0; y < self.editProject.planYearsTopMoneyList3.length; y++) {
                total2 = total2 + Number(self.editProject.planYearsTopMoneyList3[y].money);
            }
            var total = total1 + total2 + Number(value);
            if (total > self.editProject.budgetReviewMoney) {
                callback(new Error('累计县级预算合计必须小于等于预算评审金额总数'));
            } else {
                callback();
            }
        },
        checkMoney: (rule, value, callback) => {
            if (parseInt(value) >= 0) {
                callback()
            } else {
                callback(new Error('金额必须大于等于0'))
            }
        },
        check2Money: (rule, value, callback) => {
            if (parseInt(value) >= 0) {
                callback()
            } else {
                callback(new Error('金额必须大于等于0'))
            }
        },
        checkApprovalChangeNo: (rule, value, callback) => {
            if (parseInt(value) >= 0) {
                callback()
            } else {
                callback(new Error('请输入评审文号'))
            }
        },
        //查询单位
        queryInstitution: function (callback) {
            let self = this;
            let data = {};
            data.userName = self.user.role;
            self.$http.post('/api/institution/queryAllInstitution', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //self.dataList = res.data.recordset;
                        callback(res.data.recordset);
                    } else {
                        console.log("查询单位失败");
                        callback([]);
                    }
                }
            })

        },
        closeForm: function () {
            //this.$emit('onListen', false);
            this.drawerClick.editPane.hide();
        },
        //初始化总钱数
        mergeArr: function (arr) {
            const result = arr.reduce((obj, item) => {
                if (!obj[item.years]) {
                    obj[item.years] = 0
                }
                obj[item.years] += Number(item.money)
                return obj
            }, {})
            return Object.keys(result).map(key => ({years: key, money: result[key]}))
        },
        //新建表单，项目
        commitEditForm: function () {
            //this.$emit('onListen');
            var self = this;
            self.$refs.editProject.validate((valid) => {
                if (valid) {
                    let editProjectSave = _.cloneDeep(self.editProject);
                    if (editProjectSave.projectIndustry.first) {
                        editProjectSave.projectIndustry = '{"' + editProjectSave.projectIndustry.first + '","' + editProjectSave.projectIndustry.second + '"}';
                    } else {
                        editProjectSave.projectIndustry = "";
                    }
                    if (editProjectSave.projectMoneyFrom) {
                        editProjectSave.projectMoneyFrom = JSON.stringify(editProjectSave.projectMoneyFrom).replace("[", "{").replace("]", "}");
                    } else {
                        editProjectSave.projectMoneyFrom = [];
                    }
                    for (var i = 0; i < self.getProjectYears.length; i++) {
                        if (editProjectSave.projectYears == self.getProjectYears[i].name) {
                            editProjectSave.projectYears = self.getProjectYears[i].value;
                        }
                    }
                    if (editProjectSave.gvApproval=="是") {
                        editProjectSave.gvApproval = 1;
                    }else {
                        editProjectSave.gvApproval = 0;
                    }
                    if (editProjectSave.stateOwnedRegistration=="是") {
                        editProjectSave.stateOwnedRegistration = 1;
                    }else{
                        editProjectSave.stateOwnedRegistration = 0;
                    }
                    if (editProjectSave.gvBuy=="是") {
                        editProjectSave.gvBuy = 1;
                    }else{
                        editProjectSave.gvBuy = 0;
                    }
                    /************************************************************************安排******************************************************************/
                        //上级安排金额
                    var planYearsMoneyList3 = self.editProject.planYearsMoneyList3;
                    for (var a = 0; a < planYearsMoneyList3.length; a++) {
                        planYearsMoneyList3[a].money = Number(planYearsMoneyList3[a].money);
                        planYearsMoneyList3[a].status = 1;//都设成1这样不用再审批了;
                    }
                    editProjectSave.planYearsMoney = JSON.stringify(planYearsMoneyList3);//设置数据库要保存的字段；
                    //本级安排金额
                    var planYearsTopMoneyList3 = self.editProject.planYearsTopMoneyList3;
                    for (var b = 0; b < planYearsTopMoneyList3.length; b++) {
                        planYearsTopMoneyList3[b].money = Number(planYearsTopMoneyList3[b].money);
                        planYearsTopMoneyList3[b].status = 1;//都设成1这样不用再审批了;
                    }
                    editProjectSave.planYearsTopMoney = JSON.stringify(planYearsTopMoneyList3);//设置数据库要保存的字段；
                    //计算总的：1、yearsPlanTotalMoney分年度安排金额总额
                    var list3 = planYearsMoneyList3.concat(planYearsTopMoneyList3);
                    var obj3 = self.mergeArr(list3);
                    // yearsPlanTotalMoneyNo 安排总额数字
                    editProjectSave.yearsPlanTotalMoneyNo = Utils.countTotalPlanMoney(obj3);
                    editProjectSave.yearsPlanTotalMoney = JSON.stringify(obj3);
                    var thisYears = Number(editProjectSave.projectBeginTime.substring(0, 4));
                    var nextYears = thisYears + 1;
                    var nextYearsA = thisYears + 2;
                    var beforeYearPlanMoney = 0;
                    //     [thisYearPlanMoney]	当年安排金额  [nextYearPlanMoney]	次年安排金额  [nextAYearPlanMoney]	第三年安排金额
                    //     [beforeYearPlanMoney]	以前年度累计安排金额
                    for (var d = 0; d < obj3.length; d++) {
                        var years = Number(obj3[d].years.substring(0, 4));
                        if (years == thisYears) {//当年累计安排
                            editProjectSave.thisYearPlanMoney = Number(obj3[d].money);
                        } else if (years == nextYears) {
                            editProjectSave.nextYearPlanMoney = Number(obj3[d].money);
                        } else if (years == nextYearsA) {
                            editProjectSave.nextAYearPlanMoney = Number(obj3[d].money);
                        } else if (years < thisYears) {
                            editProjectSave.beforeYearPlanMoney = beforeYearPlanMoney + Number(obj3[d].money);
                        }
                    }
                    /************************************************************************拨付******************************************************************/
                        // 上级拨付
                        // appropriateTopBudget
                    var appropriateTopBudgetList4 = self.editProject.appropriateTopBudgetList4;
                    for (var h = 0; h < appropriateTopBudgetList4.length; h++) {
                        appropriateTopBudgetList4[h].money = Number(appropriateTopBudgetList4[h].money);
                        appropriateTopBudgetList4[h].status = 1;//都设成1这样不用再审批了;
                    }
                    editProjectSave.appropriateTopBudget = JSON.stringify(appropriateTopBudgetList4);//设置数据库要保存的字段；
                    //本级拨付
                    //appropriateBudget
                    var appropriateBudgetList4 = self.editProject.appropriateBudgetList4;
                    for (var c = 0; c < appropriateBudgetList4.length; c++) {
                        appropriateBudgetList4[c].years =appropriateBudgetList4[c].date.substring(0, 4);
                        appropriateBudgetList4[c].money = Number(appropriateBudgetList4[c].money);
                        appropriateBudgetList4[c].status = 1;//都设成1这样不用再审批了;
                    }
                    for (var k = 0; k < appropriateTopBudgetList4.length; k++) {
                        appropriateTopBudgetList4[k].years =appropriateTopBudgetList4[k].date.substring(0, 4);
                        appropriateTopBudgetList4[k].money = Number(appropriateTopBudgetList4[k].money);
                        appropriateTopBudgetList4[k].status = 1;//都设成1这样不用再审批了;
                    }
                    editProjectSave.appropriateBudget = JSON.stringify(appropriateBudgetList4);//设置数据库要保存的字段；
                    //计算总的：1、approTotalMoney分年度拨付金额总额
                    var list4 = appropriateBudgetList4.concat(appropriateTopBudgetList4);
                    var obj4 = Utils.mergeArr(list4);
                    // approTotalPlanMoneyNo 拨付总额数字  //     [thisYearGiveMoney]	当年拨付
                    editProjectSave.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(obj4);
                    editProjectSave.approTotalMoney = JSON.stringify(obj4);
                    for (var j = 0; j< obj4.length; j++) {
                        var years = Number(obj4[j].years.substring(0, 4));
                        if (years == thisYears) {//当年累计拨付
                            editProjectSave.thisYearGiveMoney = Number(obj4[j].money);
                        }
                    }
                    // nonPaymentTotalMoneyNo欠付金额数字
                    editProjectSave.nonPaymentTotalMoneyNo = Number(editProjectSave.yearsPlanTotalMoneyNo - editProjectSave.approTotalPlanMoneyNo);
                    /************************************************************************评审变更******************************************************************/
                    //     [addBudget]		增加金额
                    var addBudget = self.editProject.addBudget;
                    for (var x= 0; x < addBudget.length; x++) {
                        addBudget[x].money = Number(addBudget[x].money);
                        addBudget[x].status = 1;//都设成1这样不用再审批了;
                    }
                    //     [cutBudget]		减少金额
                    var cutBudget = self.editProject.cutBudget;
                    for (var y = 0; y< cutBudget.length; y++) {
                        cutBudget[y].money = Number(cutBudget[y].money);
                        cutBudget[y].status = 1;//都设成1这样不用再审批了;
                    }
                    editProjectSave.addBudget = JSON.stringify(addBudget);
                    editProjectSave.cutBudget = JSON.stringify(cutBudget);
                    /************************************************************************三方******************************************************************/
                    //     [triInfo]       	三方信息
                    var triInfoList = self.editProject.triInfoList;
                    for (var z = 0; z< triInfoList.length; z++) {
                        triInfoList[z].status = 1;//都设成1这样不用再审批了;
                    }
                    editProjectSave.triInfo = JSON.stringify(triInfoList);
                    //删除数组字段
                    delete editProjectSave.planYearsTopMoneyList3;//删除数组字段
                    delete editProjectSave.planYearsMoneyList3;//删除数组字段
                    delete editProjectSave.appropriateTopBudgetList4;//删除数组字段
                    delete editProjectSave.appropriateBudgetList4;//删除数组字段
                    delete editProjectSave.cutBudget;//删除数组字段
                    delete editProjectSave.addBudget;//删除数组字段
                    delete editProjectSave.triInfoList;//删除数组字段
                    delete editProjectSave.rownumber;//删除数组字段
                    console.log(editProjectSave);
                    self.$http.post('/api/project/editProject', editProjectSave).then(res => {
                        let status = res.status;
                        let statusText = res.statusText;
                        if (status !== 200) {
                            self.$message({
                                message: statusText,
                                type: 'error'
                            });
                        } else {
                            if (res.data.length != 0) {
                                self.$message({
                                    message: "提交成功",
                                    type: 'success'
                                });
                                //关闭当前页，并清空表格数据
                                self.clearFormData();
                                self.closeForm();
                                //刷新当前页
                                EventBus.$emit("refreshHome");
                            } else {
                                self.$message({
                                    message: "提交失败",
                                    type: 'warning'
                                });
                            }
                        }
                    })
                        .catch(error =>
                                self.$message({
                                    message: error.message,
                                    type: 'error'
                                }),
                            self.logining = false
                        );
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearFormData: function () {
            var self = this;
            self.editProject.projectInstitution = "";
            self.editProject.projectFinance = "行政政法股";
            self.editProject.projectName = "";
            self.editProject.projectType = "新建";
            self.editProject.projectMoney = "";
            self.editProject.projectIndustry = {first: "", second: ""};
            self.editProject.projectMoneyFrom = [];
            self.editProject.projectBeginTime = "";
            self.editProject.projectContactUserName = "";
            self.editProject.projectContactUserPhone = "";
            self.editProject.projectSituation = "";
            self.editProject.projectYears = 1;

        },
        //选择一级
        selectFirstChange(value) {
            var self = this;
            var index = _.findIndex(self.selectIndustry, function (o) {
                return o.value == value;
            });
            self.newIndustry = self.selectIndustry[index].childrens;
            self.editProject.projectIndustry.second = self.newIndustry[0].name;
        },
        //选择二级
        selectSecondChange(value) {
            this.editProject.projectIndustry.second = value;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        }

    },
    watch: {
        "projectDetail": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if (val) {
                    self.editProject1 = val;
                    for(var p in val)
                    {
                        var name=p;//属性名称
                        var value=val[p];//属性对应的值
                        self.editProject[name]=val[p];
                    }
                    self.editProject.id = val.id;
                    self.editProject.projectInstitution = val.projectInstitution;
                    self.editProject.projectFinance = val.projectFinance;
                    self.editProject.projectName = val.projectName;
                    self.editProject.projectType = val.projectType;
                    self.editProject.projectMoney = val.projectMoney;
                    self.editProject.projectIndustry = val.projectIndustry;
                    if (val.projectIndustry) {
                        var ins1 = val.projectIndustry.split(",")[0].replace("{", "");
                        var ins2 = val.projectIndustry.split(",")[1].replace("}", "");
                    } else {
                        var ins1 = "";
                        var ins2 = "";
                    }
                    self.editProject.projectIndustry = {first: ins1, second: ins2};
                    if (val.projectMoneyFrom) {
                        self.editProject.projectMoneyFrom = JSON.parse(val.projectMoneyFrom.replace("{", "[").replace("}", "]"));
                    } else {
                        self.editProject.projectMoneyFrom = [];
                    }
                    self.editProject.projectBeginTime = val.projectBeginTime;
                    self.editProject.projectContactUserName = val.projectContactUserName;
                    self.editProject.projectContactUserPhone = val.projectContactUserPhone;
                    self.editProject.projectSituation = val.projectSituation;
                    self.editProject.projectYears = val.projectYears;
                    //第2步的显示更改
                    //self.editProject.gvApproval = val.gvApproval;
                    if (val.gvApproval != false) {
                        self.editProject.gvApproval = "是";
                    }
                    self.editProject.budgetReviewMoney = val.budgetReviewMoney;
                    self.editProject.approvalNumber = val.approvalNumber;
                    if (val.gvApproval != false) {
                        self.editProject.stateOwnedRegistration = "是";
                    }
                    if (val.gvApproval != false) {
                        self.editProject.gvBuy = "是";
                    }
                    //第三步：显示更改
                    self.editProject.planYearsSelfMoney = val.planYearsSelfMoney;
                    if (val.planYearsMoney) {
                        self.editProject.planYearsMoneyList3 = JSON.parse(val.planYearsMoney);
                    } else {
                        self.editProject.planYearsMoneyList3 = [];
                    }
                    if (val.planYearsTopMoney) {
                        self.editProject.planYearsTopMoneyList3 = JSON.parse(val.planYearsTopMoney);
                    } else {
                        self.editProject.planYearsTopMoneyList3 = [];
                    }
                    //第4步拨付
                    if (val.appropriateBudget) {//本级拨付
                        self.editProject.appropriateBudgetList4 = JSON.parse(val.appropriateBudget);
                    } else {
                        self.editProject.appropriateBudgetList4 = [];
                    }
                    if (val.appropriateTopBudget) {//上级拨付
                        self.editProject.appropriateTopBudgetList4 = JSON.parse(val.appropriateTopBudget);
                    } else {
                        self.editProject.appropriateTopBudgetList4 = [];
                    }
                    //5
                    if (val.cutBudget) {
                        self.editProject.cutBudget = JSON.parse(val.cutBudget);
                    } else {
                        self.editProject.cutBudget = [];
                    }
                    if (val.addBudget) {
                        self.editProject.addBudget = JSON.parse(val.addBudget);
                    } else {
                        self.editProject.addBudget = [];
                    }
                    //6
                    if (val.triInfo) {//第三方
                        self.editProject.triInfoList = JSON.parse(val.triInfo);
                    } else {
                        self.editProject.triInfoList = [];
                    }
                    self.editProject.speed = val.speed;
                    self.editProject.finishMoney = val.finishMoney;
                    // self.editProject = Object.assign({},self.editProject,row)
                }
            }

        }
    },
}

