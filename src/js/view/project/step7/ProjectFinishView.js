/**
 * 这个文件主要是 完工阶段
 *  created by LilyLee on 2019/9/20.
 **/
import Utils from "../../../lib/Utils/Utils";
import Filters from "../../common/Filters";

import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";

export default {
    name: "ProjectFinishView",
    components: {
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        var checkMoney = (rule, value, callback) => {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            if (!self.editAppropriateMoneyProject7.years) {
                return callback(new Error('请选择年份'));
            }
            if (!self.editAppropriateMoneyProject7.type) {
                return callback(new Error('请选择类型'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)){
                return callback(new Error('金额不正确请重新输入'));
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
                if (self.editAppropriateMoneyProject7.type == '县级预算安排') {//本级安排总计
                    var total = Number(bjbf) + Number(value);
                    if (total > bjap) {
                        callback(new Error('累计本级拨付总数必须小于等于本级累计安排总数'));
                    } else {
                        callback();
                    }
                } else if (self.editAppropriateMoneyProject7.type == '上级专款') {
                    var total = Number(sjbf) + Number(value);
                    if (total > sjap) {
                        callback(new Error('累计上级拨付总数必须小于等于累计上级安排总数'));
                    } else {
                        callback();
                    }
                }


            }, 1000);
        };
        //预算填写
        var checkMoney1 = (rule, value, callback) => {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
            }
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)){
                return callback(new Error('金额不正确请重新输入'));
            }
            setTimeout(() => {
                //累计县级预算合计小于预算评审金额总数
                if (self.projectDetail.planYearsMoney || self.projectDetail.planYearsTopMoney) {
                    if (self.projectDetail.planYearsMoney) {
                        var planYearsMoney = JSON.parse(self.projectDetail.planYearsMoney);
                        var total1 = 0;
                        for (var x = 0; x < planYearsMoney.length; x++) {
                            total1 = total1 + Number(planYearsMoney[x].money);
                        }
                    }
                    if (self.projectDetail.planYearsTopMoney) {
                        var total2 = 0;
                        var planYearsTopMoney = JSON.parse(self.projectDetail.planYearsTopMoney);
                        for (var y = 0; y < planYearsTopMoney.length; y++) {
                            total2 = total2 + Number(planYearsTopMoney[y].money);
                        }
                    }
                    var total = total1 + total2 + Number(value);
                    // console.log(total1);
                    // console.log(total2);
                    // console.log(total);
                }
                if (total > self.projectDetail.budgetReviewMoney) {
                    callback(new Error('累计县级预算合计必须小于等于预算评审金额总数'));
                } else {
                    callback();
                }
            }, 1000);
        };
        return {
            activeNames: [],
            showBF:false,
            showAP:false,
            showEdit: false,
            showBFEdit: false,
            showAPEdit: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            showMoreQuery: false,
            projectInstitutionList: [],
            levelOneList: [],
            levelOne: "",
            newInstituation: [],
            finishedProject: {
                finishedProjectList: [],
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
            editAppropriateMoneyProject7: {
                years: "",
                type: "",
                money: "",
            },
            editBudgetYearsPlan7: {
                years: "",
                type: "",
                money: "",
            },
            yearsOptionType: Utils.getOptionYears(),//如果有自筹金额了就不用显示自筹的修改了
            yearsPlanType: Utils.getOptionYears(),
            rules1: {
                money: [
                    {required: true, trigger: 'blur', validator: checkMoney},
                ],
                type: [
                    {required: true, message: '请选择拨付类型', trigger: 'change'},
                ],
            },
            rules2: {
                money: [
                    {required: true, trigger: 'blur', validator: checkMoney1},
                ],
                type: [
                    {required: true, message: '请选择拨付类型', trigger: 'change'},
                ],
            },
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            formLabelWidth: '80px',
            projectDetail: {},
            options3: [],
            changeType: Utils.getChangeType(),
            rules: {
                finishMoney: [
                    {required: true, message: '请输入金额', trigger: 'blur',validator:Utils.validateMoney},
                ],
            },
            user: {},
            editBudgetFinish: {
                finishMoney: ""
            },
            budgetYearsPlanMoneyList: [],
            showButton: true,
        };
    },
    activated: function () {
        var self = this;
        self.queryFinishedProject();
        self.queryFinishedProjectCount();
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
        // self.queryFinishedProject();
        // self.queryFinishedProjectCount();
        //this.queryAppropriateMoney();
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
            self.finishedProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.finishedProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.finishedProject.formData.projectInstitution = "";
            self.finishedProject.formData.projectType = "";
            self.finishedProject.formData.projectName = "";
            self.finishedProject.formData.projectYears = "";
            self.finishedProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryFinishedProject(true);
            }
        },
        //查询完成
        queryFinishedProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.finishedProject.formData);
            data.page = flag ? 1 : self.finishedProject.currentPage;
            data.step = 7;
            data.stepSevenApp = 1;//后台查的not in
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifEdit = 1;
                data.grade = 2;
                data.approvalSuggestion = 1;//查询那些要审批的
                data.yearsPlanSuggestion = 1;//查询那些要审批的
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
                        self.finishedProject.finishedProjectList = res.data.recordset;
                        self.finishedProject.currentPage = data.page;
                        if (flag) {
                            self.queryFinishedProjectCount(data);
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
        //查询预算变更
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
                        self.budgetYearsPlanMoneyList = res.data.recordset;
                        //todo 封装成总数
                    } else {
                        self.$message({
                            message: "查询成功",
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
        //查询条数
        queryFinishedProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.finishedProject.currentPage;
            data.step = 7;
            data.stepSevenApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifEdit = 1;
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
                        self.finishedProject.count = res.data.recordset[0].num;
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
        closeForm: function () {
            var self = this;
            self.$refs.finishProject.closeDrawer();
            self.showEdit = false;
        },
        //显示完工库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.showBFEdit = false;
            self.showAPEdit = false;
            if(data.approvalSuggestion){
                self.showBF = true;//审核的时候显示拨付
            }
            if(data.yearsPlanSuggestion){
                self.showAP = true;//审核的时候显示拨付
            }
            self.activeNames = ['1', '2', '3', '4', '5', '6','7'];
        },
        //录入决算安排
        editBudgetFinishTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = true;
            self.showBFEdit = false;
            self.showAPEdit = false;
        },
        //第7步录入拨付
        editBudgetAppMoneyTab7: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.showAPEdit = false;
            self.showBFEdit = true;
            self.showBF = true;//审核的时候显示拨付
        },
        //第7步录入预算
        editBudgetYearsMoney7: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.showBFEdit = false;
            self.showAPEdit = true;
            self.showAP = true;//审核的时候显示预算
            var thisYears = Number(data.projectBeginTime.substring(0,4));
            //显示当前年份
            self.editOptionYears(data.projectYears,thisYears);
        },
        editOptionYears: function (data,thisYears) {
            var self = this;
            self.years = data;
            self.options3 = Utils.editOptionYears(data,thisYears);
        },
        //提交预算拨付填写
        commitAppMoneyForm7: function () {
            var self = this;
            self.$refs.editAppropriateMoneyProject7.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editAppropriateMoneyProject7);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    //因为预算填写可以多次录入，所以步骤就不要了，也许已经在其他步骤了，
                    editBudgetData.step = 7;//第7步可以拨付
                    editBudgetData.approvalSuggestion = 2;//设置为待审核
                    editBudgetData.ifEdit = 1;
                    editBudgetData.projectPeriod = Number(self.projectDetail.projectPeriod) + 1;//
                    //保存原来的审核结果，传入后端，红点要不要+1,因为审核的时候是一起审核的，所以只要+1次即可
                    editBudgetData.originalStepSevenApp = self.projectDetail.stepSevenApp;
                    //在第7步的时候红点+1
                    if (self.projectDetail.projectPeriod == 7) {
                        editBudgetData.isFirstSevenEdit = true;
                    } else {
                        editBudgetData.isFirstSevenEdit = false;
                    }
                    //存入数据库
                    if (editBudgetData.type == "县级预算安排") {
                        //存入数据库
                        var obj = {};
                        if (!self.projectDetail.appropriateBudget) {//第一次录入拨付
                            obj = JSON.stringify([{
                                date: Utils.format(editBudgetData.years),
                                money: editBudgetData.money,
                                status: 2,
                                step:7
                            }]);//status是审核状态
                        } else {
                            var newObj = JSON.parse(self.projectDetail.appropriateBudget);//先解成数组；
                            newObj.push({
                                date: Utils.format(editBudgetData.years),
                                money: Number(editBudgetData.money),
                                status: 2,
                                step:7
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
                                status: 2,
                                step:7
                            }]);//status是审核状态
                        } else {
                            var newObj = JSON.parse(self.projectDetail.appropriateTopBudget);//先解成数组；
                            newObj.push({
                                date: Utils.format(editBudgetData.years),
                                money: Number(editBudgetData.money),
                                status: 2,
                                step:7
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
        //提交安排
        commitMoneyPlanForm7:function(){
            var self = this;
            self.$refs.editBudgetYearsPlan7.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editBudgetYearsPlan7);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    //因为预算填写可以多次录入，所以步骤就不要了，也许已经在其他步骤了，
                    editBudgetData.step = 7;//第7步可以拨付
                    editBudgetData.yearsPlanSuggestion = 2;//设置为待审核
                    editBudgetData.ifEdit = 1;
                    editBudgetData.projectPlanPeriod = Number(self.projectDetail.projectPlanPeriod) + 1;//
                    //保存原来的审核结果，传入后端，红点要不要+1,因为审核的时候是一起审核的，所以只要+1次即可
                    editBudgetData.originalStepSevenApp = self.projectDetail.stepSevenApp;
                    //在第7步的时候红点+1
                    if (self.projectDetail.projectPlanPeriod == 7) {
                        editBudgetData.isFirstSevenEdit = true;
                    } else {
                        editBudgetData.isFirstSevenEdit = false;
                    }
                   if (editBudgetData.type == "县级预算安排") {
                        //存入数据库
                        var obj = {};
                        //status是审核状态
                        if(!self.projectDetail.planYearsMoney){//第一次录入县级预算安排
                            obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money,status:2,step:7}]);
                        }else{
                            var newObj = JSON.parse(self.projectDetail.planYearsMoney);//先解成数组；
                            newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money),status:2,step:7});
                            obj = JSON.stringify(newObj);
                        }
                        //var obj = self.initObj(self.projectDetail.planYearsMoney, editBudgetData);
                        self.projectDetail.planYearsMoney = obj;
                        editBudgetData.planYearsMoney = obj;
                    } else if (editBudgetData.type == "上级专款") {
                        var obj = {};
                        //status是审核状态
                        if(!self.projectDetail.planYearsTopMoney){//第一次录入县级预算安排
                            obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money,status:2,step:7}]);
                        }else{
                            var newObj = JSON.parse(self.projectDetail.planYearsTopMoney);//先解成数组；
                            newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money),status:2,step:7});
                            obj = JSON.stringify(newObj);
                        }
                        self.projectDetail.planYearsTopMoney = obj;
                        editBudgetData.planYearsTopMoney = obj;
                    }
                    delete editBudgetData.years;
                    delete editBudgetData.type;
                    delete editBudgetData.money;
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
                                //插入预算表
                                self.saveBudget();
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
        saveAppMoney: function () {
            var self = this;
            var editAppMoneyData = {
                date: Utils.format(self.editAppropriateMoneyProject7.years),
                type: self.editAppropriateMoneyProject7.type,
                money: self.editAppropriateMoneyProject7.money,
                projectId: self.projectDetail.id,
                userName: self.user.role,
                createTime: Utils.formatDate(new Date()) + ".000",
                appStatus: 2,//待审核
                role: self.projectDetail.projectFinance,
                years: self.editAppropriateMoneyProject7.years.getFullYear()
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
                        //查询当前页数据
                        //self.clearProFormData();
                        self.closeForm();
                        self.queryFinishedProject(true);
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
        //保存年度预算
        saveBudget: function () {
            var self = this;
            var editBudgetData = {
                years: self.editBudgetYearsPlan7.years,
                type: self.editBudgetYearsPlan7.type,
                money: self.editBudgetYearsPlan7.money,
                projectId: self.projectDetail.id,
                userName: self.user.role,
                createTime: Utils.formatDate(new Date()) + ".000",
                appStatus:2,//待审核
                role:self.projectDetail.projectFinance
            };
            self.$http.post('/api/project/addBudgetYearsPlan', editBudgetData).then(res => {
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
                        self.queryFinishedProject(true);
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
        },
        //提交决算评审信息
        commitFinishMoneyForm: function () {
            var self = this;
            self.$refs.editBudgetFinish.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editBudgetFinish);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 7;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepSevenApp = 2;//将第二步设置为待审核
                    editBudgetData.ifEdit = 1;
                    //保存原来的审核结果，传入后端，红点要不要+1,因为审核的时候是一起审核的，所以只要+1次即可
                    editBudgetData.originalStepSevenApp = self.projectDetail.stepSevenApp;
                    //存入数据库
                    editBudgetData.projectFinance = self.projectDetail.projectFinance;//传入后台取newproject表里面+1
                    //第一次录入第7步判断
                    if (!self.projectDetail.finishMoney) {
                        editBudgetData.isFirstSevenEdit = true;
                    } else {
                        editBudgetData.isFirstSevenEdit = false;
                    }
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
                                self.$message({
                                    message: "提交成功",
                                    type: 'success'
                                });
                                //查询当前页数据
                                self.clearProFormData();
                                self.closeForm();
                                self.queryFinishedProject(true);
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
        clearProFormData: function () {
            this.editBudgetFinish.finishMoney = "";
        },
        //关闭表格查询当前页数据
        handleAppStep7: function () {
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryFinishedProject(true);
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
