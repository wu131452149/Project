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
                            total1 = total1 + parseInt(planYearsMoney[x].money);
                        }
                    }
                    if (self.projectDetail.planYearsTopMoney) {
                        var total2 = 0;
                        var planYearsTopMoney = JSON.parse(self.projectDetail.planYearsTopMoney);
                        for (var y = 0; y < planYearsTopMoney.length; y++) {
                            total2 = total2 + parseInt(planYearsTopMoney[y].money);
                        }
                    }
                    var total = total1 + total2 + parseInt(value);
                    console.log(total1);
                    console.log(total2);
                    console.log(total);
                }
                if (total > self.projectDetail.budgetReviewMoney) {
                    callback(new Error('累计县级预算合计必须小于等于预算评审金额总数'));
                } else {
                    callback();
                }
            }, 1000);
        };
        return {
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
                    projectFinance: "",
                    projectName: "",
                    projectType: "",
                    projectMoney: [],
                    projectMoneyFrom: "",
                    projectIndustry: "",
                    projectCreateTime: "",
                    projectYears: "",
                    projectContactUserName: "",
                    projectContactUserPhone: "",
                    projectSituation: "",
                    create_begin_time: "",
                    create_end_time: "",
                    finish_begin_time: "",
                    finish_end_time: "",
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
            yearsPlanType: Utils.getYearsPlanType(),
            yearsOptionType: Utils.getOptionYears(),//如果有自筹金额了就不用显示自筹的修改了
            rules: {
                money: [
                    {required: true, trigger: 'blur', validator: checkMoney},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],

        }
    },
    mounted: function () {
        var self = this;
        self.queryBudgetYearsPlanProject();
        self.queryBudgetYearsPlanProjectCount();
        self.queryBudgetYearsPlanMoney();
        self.user = JSON.parse(sessionStorage.getItem('user'));

    },
    methods: {
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
        //查询在建项目年度预算评审
        queryBudgetYearsPlanProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.budgetYearsPlanProject.currentPage;
            data.step = 3;
            //不管是在审核还是没在审核的都要查
            data.stepThreeApp = 1;
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
                        self.budgetYearsPlanProject.budgetYearsPlanProjectList = res.data.recordset;
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
            data.userName = self.user.userName;
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
        //查询条数
        queryBudgetYearsPlanProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.budgetYearsPlanProject.currentPage;
            data.step = 3;
            data.stepThreeApp = 1;
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
        handleClose(done) {
            this.$confirm('确定要提交表单吗？')
                .then(_ => {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        done();
                    }, 2000);
                })
                .catch(_ => {
                });
        },
        handleCreatedClose: function () {
            this.$confirm('确定要提交表单吗？')
                .then(_ => {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        done();
                    }, 2000);
                })
                .catch(_ => {
                });
        },
        showDefaultQuickQuery: function () {

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
        //提交预算填写
        commitBudgetYearsPlanForm: function () {
            var self = this;
            self.$refs.editBudgetYearsPlan.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editBudgetYearsPlan);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 3;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepThreeApp = 2;//将第二步设置为待审核
                    if (editBudgetData.type == "自筹金额") {
                        //存入数据库//只能编辑一次
                        var obj = JSON.stringify([{years: editBudgetData.years, money: editBudgetData.money}]);
                        self.projectDetail.planYearsSelfMoney = obj;
                        editBudgetData.planYearsSelfMoney = obj;
                    } else if (editBudgetData.type == "县级预算安排") {
                        //存入数据库
                        var obj = self.initObj(self.projectDetail.planYearsMoney, editBudgetData);
                        var newObj = JSON.stringify(obj);
                        self.projectDetail.planYearsMoney = newObj;
                        editBudgetData.planYearsMoney = newObj;
                        //计算每一年拨付的总额,存入数据库
                        var planYearsTopMoney = "";
                        if (self.projectDetail.planYearsTopMoney) {
                            planYearsTopMoney = JSON.parse(self.projectDetail.planYearsTopMoney);
                        }
                        for (var x = 0; x < obj.length; x++) {
                            if (obj[x].years) {
                                obj[x].years = obj[x].years.substr(0, 4);
                            }
                        }
                        for (var y = 0; y < planYearsTopMoney.length; y++) {
                            if (planYearsTopMoney[y].years) {
                                planYearsTopMoney[y].years = planYearsTopMoney[y].years.substr(0, 4);
                            }
                        }
                        if(planYearsTopMoney.length>0){
                            var concat = obj.concat(planYearsTopMoney);
                        }else{
                            var concat = obj;
                        }
                        var concat1 = Utils.mergeArr(concat);
                        //计算合计累计安排
                        editBudgetData.yearsPlanTotalMoneyNo = Utils.countTotalPlanMoney(concat1);
                        editBudgetData.yearsPlanTotalMoney = JSON.stringify(concat1);
                    } else if (editBudgetData.type == "上级专款") {
                        var obj = self.initObj(self.projectDetail.planYearsTopMoney, editBudgetData);
                        var newObj = JSON.stringify(obj);
                        self.projectDetail.planYearsTopMoney = newObj;
                        editBudgetData.planYearsTopMoney = newObj;
                        var planYearsMoney = "";
                        if (self.projectDetail.planYearsMoney) {
                            planYearsMoney = JSON.parse(self.projectDetail.planYearsMoney);
                        }
                        for (var x = 0; x < obj.length; x++) {
                            if (obj[x].years) {
                                obj[x].years = obj[x].years.substr(0, 4);
                            }
                        }
                        for (var y = 0; y < planYearsMoney.length; y++) {
                            if (planYearsMoney[y].years) {
                                planYearsMoney[y].years = planYearsMoney[y].years.substr(0, 4);
                            }
                        }
                        if(planYearsMoney.length>0){
                            var concat = obj.concat(planYearsMoney);
                        }else{
                            var concat = obj;
                        }
                        var concat1 = Utils.mergeArr(concat);
                        //计算合计累计安排
                        editBudgetData.yearsPlanTotalMoneyNo = Utils.countTotalPlanMoney(concat1);
                        //对象
                        editBudgetData.yearsPlanTotalMoney = JSON.stringify(concat1);
                    }


                    delete editBudgetData.years;
                    delete editBudgetData.type;
                    delete editBudgetData.money;
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
                    returnObj[index].money = parseInt(returnObj[index].money) + parseInt(editBudgetData.money);
                } else {
                    var newObj = {years: editBudgetData.years, money: editBudgetData.money};
                    returnObj.push(newObj);
                }
            } else {
                returnObj = [{years: editBudgetData.years, money: editBudgetData.money}];
            }
            return returnObj;
        },
        saveBudget: function () {
            var self = this;
            var editBudgetData = {
                years: self.editBudgetYearsPlan.years,
                type: self.editBudgetYearsPlan.type,
                money: self.editBudgetYearsPlan.money,
                projectId: self.projectDetail.id,
                userName: self.user.userName,
                createTime: Utils.formatDate(new Date()) + ".000"
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
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderProjectYears: Filters.renderProjectYears

    }
}
