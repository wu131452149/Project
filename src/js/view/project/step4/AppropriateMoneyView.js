/**
 * 这个文件主要是 预算资金拨付
 *  created by LilyLee on 2019/9/19.
 **/
import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";
import Filters from "../../common/Filters";
import Utils from "../../../lib/Utils/Utils";

export default {
    name: "AppropriateMoneyView",
    components: {
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        return {
            showEdit: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            appropriateMoneyProject: {
                appropriateMoneyProjectList: [],
                formData: {
                    projectInstitution: "",
                    projectName: "",
                    projectType: "",
                    projectYears: "",
                    id: "",
                },
                count: 0,
                currentPage: 1
            },
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            formLabelWidth: '80px',
            projectDetail: {},
            editAppropriateMoneyProject: {
                years: "",
                type: "",
                money: "",
            },
            options: [],
            yearsPlanType: Utils.getOptionYears(),
            rules: {
                money: [
                    {required: true, message: '请输入金额', trigger: 'blur'},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
            projectInstitutionList:[],

        }
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        self.projectInstitutionList = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryAppropriateMoneyProject();
        self.queryAppropriateMoneyProjectCount();
        self.queryAppropriateMoney();
    },
    methods: {
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.appropriateMoneyProject.formData.projectInstitution = "";
            self.appropriateMoneyProject.formData.projectType = "";
            self.appropriateMoneyProject.formData.projectName = "";
            self.appropriateMoneyProject.formData.projectYears = "";
            self.appropriateMoneyProject.formData.id = "";
            if (flag) {
                self.queryAppropriateMoneyProject(true);
            }
        },
        editOptionYears: function (data) {
            var self = this;
            self.years = data;
            var thisYears = new Date().getFullYear();
            var nextYears = new Date().getFullYear() + 1;
            var nextYearsA = new Date().getFullYear() + 2;
            self.thisYears = new Date().getFullYear();
            self.nextYears = new Date().getFullYear() + 1;
            self.nextYearsA = new Date().getFullYear() + 2;
            if (self.years == 1) {
                self.options = [{name: thisYears + "年度", value: thisYears + "年度"}];
            } else if (self.years == 2) {
                self.options = [{name: thisYears + "年度", value: thisYears + "年度"}, {
                    name: nextYears + "年度",
                    value: nextYears + "年度"
                }];
            } else if (self.years == 2) {
                self.options = [{name: thisYears + "年度", value: thisYears + "年度"}, {
                    name: nextYears + "年度",
                    value: nextYears + "年度"
                }, {name: nextYearsA, value: nextYearsA}];
            }
        },
        //查询拨付表
        queryAppropriateMoneyProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.appropriateMoneyProject.currentPage;
            data.step = 4;
            data.stepFourApp = 1;
            data.ifReturned = 0;
            self.$http.post('/api/project/queryProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.appropriateMoneyProject.appropriateMoneyProjectList = res.data.recordset;
                    } else {
                        self.$message({
                            message: "查询失败",
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
                );
        },
        //查询拨付钱
        queryAppropriateMoney: function () {
            let self = this;
            let data = {};
            data.userName = self.user.role;
            //data.userName = "root";
            self.$http.post('/api/project/queryAppMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //self.budgetYearsPlanMoneyList = res.data.recordset;
                        //todo 封装成总数
                        self.initMoney(res.data.recordset);
                    } else {
                        self.$message({
                            message: "查询失败",
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
                );
        },
        initMoney: function (list) {
            var self = this;
            for (var i = 0; i < list.length; i++) {

            }

        },
        //查询条数
        queryAppropriateMoneyProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.appropriateMoneyProject.currentPage;
            data.step = 4;
            data.stepFourApp = 1;
            data.ifReturned = 0;
            self.$http.post('/api/project/queryProjectCount', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.appropriateMoneyProject.count = res.data.recordset[0].num;
                    } else {
                        self.$message({
                            message: "查询失败",
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
                );

        },
        handleClose(done) {
            done();
        },
        //录入预算拨付
        editAppropriatePlanTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = true;
            self.editOptionYears(data.projectYears);
        },
        closeForm: function () {
            var self = this;
            self.$refs.approMoney.closeDrawer();
            self.showEdit = false;
        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
        },
        initCommitMoney: function () {

        },
        //提交预算拨付填写
        commitAppMoneyForm: function () {
            var self = this;
            self.$refs.editAppropriateMoneyProject.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editAppropriateMoneyProject);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 4;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepFourApp = 2;//将第二步设置为待审核
                    //存入数据库
                    if (editBudgetData.type == "县级预算安排") {
                        //存入数据库
                        var obj = self.initObj(self.projectDetail.appropriateBudget, editBudgetData);
                        var newObj = JSON.stringify(obj);
                        self.projectDetail.appropriateBudget = newObj;
                        editBudgetData.appropriateBudget = newObj;
                        //拨付总表
                        var planYearsMoney = "";
                        if (self.projectDetail.appropriateTopBudget) {
                            planYearsMoney = JSON.parse(self.projectDetail.appropriateTopBudget);
                        }
                        for (var x = 0; x < obj.length; x++) {
                            if (obj[x].date) {
                                obj[x].years = obj[x].date.substr(0, 4);
                            }
                        }
                        for (var y = 0; y < planYearsMoney.length; y++) {
                            if (planYearsMoney[y].date) {
                                planYearsMoney[y].years = planYearsMoney[y].date.substr(0, 4);
                            }
                        }
                        if (planYearsMoney.length > 0) {
                            var concat = obj.concat(planYearsMoney);
                        } else {
                            var concat = obj;
                        }
                        var concat1 = Utils.mergeArr(concat);
                        //计算合计累计安排
                        editBudgetData.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(concat1);
                        editBudgetData.nonPaymentTotalMoneyNo = -parseInt(editBudgetData.approTotalPlanMoneyNo - self.projectDetail.yearsPlanTotalMoneyNo);
                        //对象
                        editBudgetData.approTotalMoney = JSON.stringify(concat1);
                    } else if (editBudgetData.type == "上级专款") {
                        var obj = self.initObj(self.projectDetail.appropriateTopBudget, editBudgetData);
                        var newObj = JSON.stringify(obj);
                        self.projectDetail.appropriateTopBudget = newObj;
                        editBudgetData.appropriateTopBudget = newObj;
                        //拨付总计
                        var planYearsMoney = "";
                        if (self.projectDetail.appropriateBudget) {
                            planYearsMoney = JSON.parse(self.projectDetail.appropriateBudget);
                        }
                        for (var x = 0; x < obj.length; x++) {
                            if (obj[x].date) {
                                obj[x].years = obj[x].date.substr(0, 4);
                            }
                        }
                        for (var y = 0; y < planYearsMoney.length; y++) {
                            if (planYearsMoney[y].date) {
                                planYearsMoney[y].years = planYearsMoney[y].date.substr(0, 4);
                            }
                        }
                        if (planYearsMoney.length > 0) {
                            var concat = obj.concat(planYearsMoney);
                        } else {
                            var concat = obj;
                        }
                        var concat1 = Utils.mergeArr(concat);
                        //计算合计累计安排
                        editBudgetData.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(concat1);
                        editBudgetData.nonPaymentTotalMoneyNo = parseInt(editBudgetData.approTotalPlanMoneyNo - self.projectDetail.yearsPlanTotalMoneyNo);
                        //对象
                        editBudgetData.approTotalMoney = JSON.stringify(concat1);
                    }
                    delete editBudgetData.years;
                    delete editBudgetData.money;
                    delete editBudgetData.type;
                    self.$http.post('/api/project/updateProject', editBudgetData).then(res => {
                        let status = res.status;
                        let statusText = res.statusText;
                        if (status !== 200) {
                            self.$message({
                                message: statusText,
                                type: 'error'
                            });
                        } else {
                            if (res.data.length != 0) {
                                //插入拨付表
                                self.saveAppMoney();
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
        initObj: function (oldObj, editBudgetData) {
            var returnObj;
            var date = Utils.format(editBudgetData.years);
            if (oldObj) {
                returnObj = JSON.parse(oldObj);
                var index = _.findIndex(returnObj, function (o) {
                    return o.date == date;
                });
                if (index > -1) {
                    returnObj[index].money = parseInt(returnObj[index].money) + parseInt(editBudgetData.money);
                } else {
                    var newObj = {date: date, money: editBudgetData.money};
                    returnObj.push(newObj);
                }
            } else {
                returnObj = [{date: date, money: editBudgetData.money}];
            }
            return returnObj;
        },
        saveAppMoney: function () {
            var self = this;
            var editAppMoneyData = {
                date: Utils.format(self.editAppropriateMoneyProject.years),
                type: self.editAppropriateMoneyProject.type,
                money: self.editAppropriateMoneyProject.money,
                projectId: self.projectDetail.id,
                userName: self.user.role,
                createTime: Utils.formatDate(new Date()) + ".000"
            };
            self.$http.post('/api/project/addAppMoney', editAppMoneyData).then(res => {
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
                );
        },
        clearFormData: function () {
            this.editAppropriateMoneyProject.years = "";
            this.editAppropriateMoneyProject.type = "";
            this.editAppropriateMoneyProject.money = "";
        },
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderProjectYears: Filters.renderProjectYears

    }
}



