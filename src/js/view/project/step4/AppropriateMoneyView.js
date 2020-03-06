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
        var checkMoney = (rule, value, callback) => {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            if (!self.editAppropriateMoneyProject.years) {
                return callback(new Error('请选择年份'));
            }
            if (!self.editAppropriateMoneyProject.type) {
                return callback(new Error('请选择类型'));
            }
            setTimeout(() => {
                //累计拨付小于累计安排，累计安排总数yearsPlanTotalMoneyNo，累计拨付总数approTotalPlanMoneyNo
                if (!self.projectDetail.approTotalPlanMoneyNo) {
                    self.projectDetail.approTotalPlanMoneyNo = 0;
                }
                //未审核的拨付也要算上总数
                var bjbf = 0;
                var sjbf = 0;
                var bjap = 0;
                var sjap = 0;
                //本级拨付
                var appropriateTotalBudgetList = self.projectDetail.appropriateTotalBudgetList;
                for (var a = 0; a < appropriateTotalBudgetList.length; a++) {
                    bjbf = bjbf + Number(appropriateTotalBudgetList[a].money);
                }
                console.log("本级拨付", bjbf);
                //上级拨付
                var appropriateBudgetList = self.projectDetail.appropriateTotalBudgetList;
                for (var b = 0; b < appropriateBudgetList.length; b++) {
                    sjbf = sjbf + Number(appropriateBudgetList[b].money);
                }
                console.log("上级拨付", sjbf);
                //本级安排
                var yearsPlanTotalMoneyList = self.projectDetail.yearsPlanTotalMoneyList;
                for (var c = 0; c < yearsPlanTotalMoneyList.length; c++) {

                    bjap = bjap + Number(yearsPlanTotalMoneyList[c].money);
                }
                console.log("本级安排", bjap);
                //上级安排
                var yearsPlanTotalTopMoneyList = self.projectDetail.yearsPlanTotalTopMoneyList;
                for (var d = 0; d < yearsPlanTotalTopMoneyList.length; d++) {

                    sjap = sjap + Number(yearsPlanTotalTopMoneyList[d].money);
                }
                console.log("上级安排", sjap);
                //self.projectDetail.approTotalPlanMoneyNo是审核通过的不用了
                if (self.editAppropriateMoneyProject.type == '县级预算安排') {//本级安排总计
                    var total = Number(bjbf) + Number(value);
                    if (total > bjap) {
                        callback(new Error('累计本级拨付总数必须小于等于本级累计安排总数'));
                    } else {
                        callback();
                    }
                } else if (self.editAppropriateMoneyProject.type == '上级专款') {
                    var total = Number(sjbf) + Number(value);
                    if (total > sjap) {
                        callback(new Error('累计上级拨付总数必须小于等于累计上级安排总数'));
                    } else {
                        callback();
                    }
                }


            }, 1000);
        };
        return {
            activeNames: [],
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
                    {required: true, trigger: 'blur', validator: checkMoney},
                ],
                type: [
                    {required: true, message: '请选择拨付类型', trigger: 'change'},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
            projectInstitutionList: [],
            levelOneList: [],
            levelOne: "",
            newInstituation: [],
            showButton: true,

        }
    },
    activated: function() {
        var self = this;
        self.queryAppropriateMoneyProject();
        self.queryAppropriateMoneyProjectCount();
        self.queryAppropriateMoney();
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        //var list = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryInstitution(function (list) {
            if (self.user.grade == 1) {
                self.projectInstitutionList = list;
            } else {
                self.levelOneList = Utils.initLevelOne(list);
                self.projectInstitutionList = Utils.initLevelTwo(self.levelOneList, list);
            }
        })
        self.queryAppropriateMoneyProject();
        self.queryAppropriateMoneyProjectCount();
        self.queryAppropriateMoney();
    },
    methods: {
        //查询单位
        queryInstitution: function (callback) {
            let self = this;
            let data = {};
            if (self.user.grade == 1) {//只有1要查自己建的
                data.userName = self.user.role;
            }
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
        //选择一级
        selectLevelOneChange(value) {
            var self = this;
            var index = _.findIndex(self.projectInstitutionList, function (o) {
                return o.value == value;
            });
            self.newInstituation = self.projectInstitutionList[index].childrens;
            self.appropriateMoneyProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.appropriateMoneyProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.appropriateMoneyProject.formData.projectInstitution = "";
            self.appropriateMoneyProject.formData.projectType = "";
            self.appropriateMoneyProject.formData.projectName = "";
            self.appropriateMoneyProject.formData.projectYears = "";
            self.appropriateMoneyProject.formData.id = "";
            self.levelOne = "";
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
            } else if (self.years == 3) {
                self.options = [{name: thisYears + "年度", value: thisYears + "年度"}, {
                    name: nextYears + "年度",
                    value: nextYears + "年度"
                }, {name: nextYearsA + "年度", value: nextYearsA + "年度"}];
            }
        },
        //查询拨付表
        queryAppropriateMoneyProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.appropriateMoneyProject.formData);
            data.page = flag ? 1 : self.appropriateMoneyProject.currentPage;
            data.step = 4;
            data.stepFourApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifFourEdit = 1;
                data.grade = 2;
            }
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
                        self.appropriateMoneyProject.currentPage = data.page;
                        if (flag) {
                            self.queryAppropriateMoneyProjectCount(data);
                        }
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
        queryAppropriateMoneyProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.appropriateMoneyProject.currentPage;
            data.step = 4;
            data.stepFourApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifFourEdit = 1;
            }
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
            self.activeNames = ['1', '2', '3', '4'];
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
                    //因为预算填写可以多次录入，所以步骤就不要了，也许已经在其他步骤了，
                    //editBudgetData.step = 4;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.trueStep = 4;
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepFourApp = 2;//将第二步设置为待审核
                    editBudgetData.ifFourEdit = 1;
                    //保存原来的审核结果，传入后端，红点要不要+1,因为审核的时候是一起审核的，所以只要+1次即可
                    editBudgetData.originalStepFourApp = self.projectDetail.stepFourApp;
                    //存入数据库
                    if (editBudgetData.type == "县级预算安排") {
                        //存入数据库
                        var obj = {};
                        if (!self.projectDetail.appropriateBudget) {//第一次录入拨付
                            obj = JSON.stringify([{
                                date: Utils.format(editBudgetData.years),
                                money: editBudgetData.money,
                                status: 2
                            }]);//status是审核状态
                        } else {
                            var newObj = JSON.parse(self.projectDetail.appropriateBudget);//先解成数组；
                            newObj.push({
                                date: Utils.format(editBudgetData.years),
                                money: Number(editBudgetData.money),
                                status: 2
                            });
                            obj = JSON.stringify(newObj);
                        }
                        self.projectDetail.appropriateBudget = obj;
                        editBudgetData.appropriateBudget = obj;
                    } else if (editBudgetData.type == "上级专款") {
                        //存入数据库
                        var obj = {};
                        if (!self.projectDetail.appropriateTopBudget) {//第一次录入拨付
                            obj = JSON.stringify([{
                                date: Utils.format(editBudgetData.years),
                                money: Number(editBudgetData.money),
                                status: 2
                            }]);//status是审核状态
                        } else {
                            var newObj = JSON.parse(self.projectDetail.appropriateTopBudget);//先解成数组；
                            newObj.push({
                                date: Utils.format(editBudgetData.years),
                                money: Number(editBudgetData.money),
                                status: 2
                            });
                            obj = JSON.stringify(newObj);
                        }
                        self.projectDetail.appropriateTopBudget = obj;
                        editBudgetData.appropriateTopBudget = obj;
                    }
                    delete editBudgetData.years;
                    delete editBudgetData.money;
                    delete editBudgetData.type;
                    editBudgetData.projectFinance = self.projectDetail.projectFinance;//传入后台取newproject表里面+1
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
                    returnObj[index].money = Number(returnObj[index].money) + Number(editBudgetData.money);
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
                createTime: Utils.formatDate(new Date()) + ".000",
                appStatus: 2,//待审核
                role: self.projectDetail.projectFinance,
                years: self.editAppropriateMoneyProject.years.getFullYear()
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
                        //查询当前页数据
                        self.queryAppropriateMoneyProject(true);
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
        //关闭表格查询当前页数据
        handleAppStep4: function () {
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryAppropriateMoneyProject(true);
        },
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderBeginTime: Filters.renderBeginTime,
        renderProjectYears: Filters.renderProjectYears

    }
}



