/**
 * 这个文件主要是 提交年度预算安排
 *  created by LilyLee on 2019/9/22.
 **/
import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";
import Filters from "../../common/Filters";
import Utils from "../../../lib/Utils/Utils";

export default {
    name: "BudgetYearsPlanView",
    components: {
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        var checkMoney = (rule, value, callback) => {
            var self = this;
            if (!value) {
                return callback(new Error('请输入金额'));
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
            activeNames:[],
            showEdit: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            budgetYearsPlanProject: {
                budgetYearsPlanProjectList: [],
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
            editBudgetYearsPlan: {
                years: "",
                type: "",
                money: "",
            },
            options: [],
            levelOneList:[],
            levelOne:"",
            newInstituation:[],
            yearsPlanType: Utils.getYearsPlanType(),//3个
            yearsOptionType: Utils.getOptionYears(),//如果有自筹金额了就不用显示自筹的修改了
            rules: {
                money: [
                    {required: true, trigger: 'blur', validator: checkMoney},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
            projectInstitutionList: []

        }
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        //var list = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryInstitution(function (list) {
            if(self.user.grade==1){
                self.projectInstitutionList = list;
            }else{
                self.levelOneList = Utils.initLevelOne(list);
                self.projectInstitutionList = Utils.initLevelTwo(self.levelOneList,list);
            }
        })
        self.queryBudgetYearsPlanProject();
        self.queryBudgetYearsPlanProjectCount();
        self.queryBudgetYearsPlanMoney();
    },
    methods: {
        ifHasPlanYearsSelfMoney:function(){
            //查询当前自筹金额是不是全部填写过了，只可以填写一次
            var self = this;
            var thisYears = new Date().getFullYear()+"年度";
            var nextYears = new Date().getFullYear()+1+"年度";
            var nextAYears = new Date().getFullYear()+2+"年度";
            if(!self.projectDetail.planYearsSelfMoney){
                return true;
            }else{
                var list = JSON.parse(self.projectDetail.planYearsSelfMoney);
                if(self.projectDetail.projectYears==1){
                    var index = _.findIndex(list, function (o) {
                        return o.years == thisYears;
                    });
                    if(index>-1){
                        return false
                    }else{
                        return true;
                    }
                }else if(self.projectDetail.projectYears==2){
                    var index = _.findIndex(list, function (o) {
                        return o.years == thisYears;
                    });
                    var index1 = _.findIndex(list, function (o) {
                        return o.years == nextYears;
                    });
                    if(index>-1&&index1>-1){//说明都存在，那就不显示自筹
                        return false
                    }else{
                        return true;
                    }
                }else if(self.projectDetail.projectYears==3){
                    var index = _.findIndex(list, function (o) {
                        return o.years == thisYears;
                    });
                    var index1 = _.findIndex(list, function (o) {
                        return o.years == nextYears;
                    });
                    var index2 = _.findIndex(list, function (o) {
                        return o.years == nextAYears;
                    });
                    if(index>-1&&index1>-1&&index2>-1){//说明都存在，那就不显示自筹
                        return false
                    }else{
                        return true;
                    }
                }
            }


            for(var i=0;i<self.projectDetail.planYearsSelfMoney.length;i++){

           }
        },
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
            self.budgetYearsPlanProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.budgetYearsPlanProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.budgetYearsPlanProject.formData.projectInstitution = "";
            self.budgetYearsPlanProject.formData.projectType = "";
            self.budgetYearsPlanProject.formData.projectName = "";
            self.budgetYearsPlanProject.formData.projectYears = "";
            self.budgetYearsPlanProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryBudgetYearsPlanProject(true);
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
                }, {name: nextYearsA+ "年度", value: nextYearsA+ "年度"}];
            }
        },
        //查询在建项目年度预算评审
        //可以多次录入，审核通过也可以查询
        queryBudgetYearsPlanProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.budgetYearsPlanProject.formData);
            data.page = flag ? 1 : self.budgetYearsPlanProject.currentPage;
            data.step = 3;
            //不管是在审核还是没在审核的都要查
            data.stepThreeApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifEdit = 1;
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
                        self.budgetYearsPlanProject.budgetYearsPlanProjectList = res.data.recordset;
                        self.budgetYearsPlanProject.currentPage = data.page;
                        if (flag) {
                            self.queryBudgetYearsPlanProjectCount(data);
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
        //查询条数
        queryBudgetYearsPlanProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.budgetYearsPlanProject.currentPage;
            data.step = 3;
            data.stepThreeApp = 1;
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
                        self.budgetYearsPlanProject.count = res.data.recordset[0].num;
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
        //查询在建项目年度预算评审
        queryBudgetYearsPlanMoney: function () {
            let self = this;
            let data = {};
            data.userName = self.user.role;
            //data.userName = "root";
            self.$http.post('/api/project/queryBudgetYearsPlanMoney', data).then(res => {
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
                        self.initMoney(res.data.recordset);
                        // self.$message({
                        //     message: "查询成功",
                        //     type: 'success'
                        // });
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
        handleClose(done) {
            done();
        },
        //录入预算安排
        editBudgetYearsPlanTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = true;
            self.editOptionYears(data.projectYears);
        },
        closeForm: function () {
            var self = this;
            self.$refs.drawerBudgetPlan.closeDrawer();
            self.showEdit = false;
        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.activeNames = ['1','2','3'];
        },
        initCommitMoney: function () {

        },
        //提交预算填写
        commitBudgetYearsPlanForm: function () {
            var self = this;
            self.$refs.editBudgetYearsPlan.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editBudgetYearsPlan);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    //因为预算填写可以多次录入，所以步骤就不要了，也许已经在其他步骤了，
                    //editBudgetData.step = 3;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.trueStep = 3;
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepThreeApp = 2;//将第二步设置为待审核
                    editBudgetData.ifEdit = 1;
                    if (editBudgetData.type == "自筹金额") {
                        //存入数据库//只能编辑一次
                        var obj = {};
                        //status是审核状态
                        if(!self.projectDetail.planYearsSelfMoney){//第一次录入
                            obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money}]);
                        }else{
                            var newObj = JSON.parse(self.projectDetail.planYearsSelfMoney);//先解成数组；
                            newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money)});
                            obj = JSON.stringify(newObj);
                        }
                        self.projectDetail.planYearsSelfMoney = obj;
                        editBudgetData.planYearsSelfMoney = obj;
                    } else if (editBudgetData.type == "县级预算安排") {
                        //存入数据库
                        var obj = {};
                        //status是审核状态
                        if(!self.projectDetail.planYearsMoney){//第一次录入县级预算安排
                            obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money,status:2}]);
                        }else{
                            var newObj = JSON.parse(self.projectDetail.planYearsMoney);//先解成数组；
                            newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money),status:2});
                            obj = JSON.stringify(newObj);
                        }
                        //var obj = self.initObj(self.projectDetail.planYearsMoney, editBudgetData);
                        self.projectDetail.planYearsMoney = obj;
                        editBudgetData.planYearsMoney = obj;
                    } else if (editBudgetData.type == "上级专款") {
                        var obj = {};
                        //status是审核状态
                        if(!self.projectDetail.planYearsTopMoney){//第一次录入县级预算安排
                            obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money,status:2}]);
                        }else{
                            var newObj = JSON.parse(self.projectDetail.planYearsTopMoney);//先解成数组；
                            newObj.push({years: editBudgetData.years, money: Number(editBudgetData.money),status:2});
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

        initObj: function (oldObj, editBudgetData) {
            var returnObj;
            if (oldObj) {
                returnObj = JSON.parse(oldObj);
                var index = _.findIndex(returnObj, function (o) {
                    return o.years == editBudgetData.years;
                });
                if (index > -1) {
                    returnObj[index].money = Number(returnObj[index].money) + Number(editBudgetData.money);
                } else {
                    var newObj = {years: editBudgetData.years, money: editBudgetData.money};
                    returnObj.push(newObj);
                }
            } else {
                returnObj = [{years: editBudgetData.years, money: editBudgetData.money}];
            }
            return returnObj;
        },
        //保存年度预算
        saveBudget: function () {
            var self = this;
            var editBudgetData = {
                years: self.editBudgetYearsPlan.years,
                type: self.editBudgetYearsPlan.type,
                money: self.editBudgetYearsPlan.money,
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
                        self.queryBudgetYearsPlanProject(true);
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
        clearFormData: function () {
            this.editBudgetYearsPlan.years = "";
            this.editBudgetYearsPlan.type = "";
            this.editBudgetYearsPlan.money = "";
        },
        //关闭表格查询当前页数据
        handleAppStep3:function(){
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryBudgetYearsPlanProject(true);
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
