import ShowProjectDetail from "../../../components/project/ShowProjectDetail";
import Filters from "../common/Filters";
import Utils from "../../lib/Utils/Utils";


export default {
    name: "Home",
    components: {
        "show-project-Detail": ShowProjectDetail,
    },
    data() {
        return {
            sum:[],
            activeNames: [],
            userInfoActiveName: "pro-monitor",
            o: 2,
            drawerDetails: false,
            drawerCreate: false,
            showMoreQuery: false,
            direction: 'rtl',
            projectInstitutionList: [],
            levelOneList: [],
            levelOne: "",
            newInstituation: [],
            allProject: {
                allProjectList: [],
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
            sumProject: {
                sumProjectList: [],
            },
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            projectDetail: {},
            user: {},
            allBudgetReviewMoney:{},
            allAppropriateMoney:{},//拨付
            allBudgetPlanMoney:{},//安排
            monitor: {
                newProjectCount: 0,
                approvalProject: 0,
                finishedProjectCount: 0,
                returnedProjectCount: 0,
            },
            excelTitleConfig:[],
        }
    },
    mounted: function () {
        var self = this;
        //$('.main-content').height($(window).height() - 200);
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
        self.queryAllProject();
        self.queryAllProjectCount();
        self.queryNewProjectCount();
        self.queryFinishedProjectCount();
        self.queryReturnedProjectCount();
        self.queryAllBudgetReviewMoney();//预算评审金额和估算总额
        self.queryAllAppropriateMoney();//查询拨付金额
        self.queryAllBudgetPlanMoney();//查询年度安排金额
        self.queryAllProjectWithoutPage();
        self.excelTitleConfig = [{
            name: 'id',
            title: '项目编号',
        }, {
            name: 'commitName',
            title: '主管部门',
        }, {
            name: 'projectInstitution',
            title: '项目单位',
        }, {
            name: 'projectName',
            title: '项目名称',
        }, {
            name: 'projectType',
            title: '项目类型',
        }, {
            name: 'projectMoney',
            title: '概算金额',
        }, {
            name: 'projectYears',
            title: '项目周期',
        }, {
            name: 'budgetReviewMoney',
            title: '预算评审金额',
        }, {
            name: 'yearsPlanTotalMoneyNo',
            title: '三年滚动预算合计',
        }, {
            name: 'yearsPlanTotalMoney',
            title: '以前年度累计安排',
            format: function (data) {
                let value = "0";
                var thisYears = new Date().getFullYear()+"年度";
                //var thisYears = 2020;
                if (data) {
                    let money = JSON.parse(data);
                    var list = money.filter(function (item) {
                        return item.years < thisYears;
                    });
                    var totalMoney = 0;
                    if (list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            totalMoney = totalMoney + Number(list[i].money);
                        }
                        return totalMoney;
                    } else {
                        return value;
                    }
                } else {
                    return value;
                }
            }
        }, {
            name: 'yearsPlanTotalMoney',
            title: '当年安排',
            format: function (data) {
                let value = "0";
                var thisYears = new Date().getFullYear()+"年度";
                if (data) {
                    let money = JSON.parse(data);
                    var index = money.find(function(x) {
                        return x.years == thisYears;
                    });
                    if(index){
                        value = index.money;
                    }
                    return value;
                } else {
                    return value;
                }
            }
        }, {
            name: 'yearsPlanTotalMoney',
            title: '次年安排',
            format: function (data) {
                let value = "0";
                var nextYears = new Date().getFullYear() + 1+"年度";
                if (data) {
                    let money = JSON.parse(data);
                    var index = money.find(function(x) {
                        return x.years == nextYears;
                    });
                    if(index){
                        value = index.money;
                    }
                    return value;
                } else {
                    return value;
                }
            }
        }, {
            name: 'yearsPlanTotalMoney',
            title: '第三年安排',
            format: function (data) {
                let value = "0";
                var nextYearsA = new Date().getFullYear() + 2+"年度";
                if (data) {
                    let money = JSON.parse(data);
                    var index = money.find(function(x) {
                        return x.years == nextYearsA;
                    });
                    if(index){
                        value = index.money;
                    }
                    return value;
                } else {
                    return value;
                }
            }
        }, {
            name: 'approTotalMoney',
            title: '资金当年拨付',
            format: function (data) {
                let value = "0";
                var thisYears = new Date().getFullYear();
                if (data) {
                    let money = JSON.parse(data);
                    var index = money.find(function(x) {
                        return x.years == thisYears;
                    });
                    if(index){
                        value = index.money;
                    }
                    return value;
                } else {
                    return value;
                }
            }
        }, {
            name: 'approTotalPlanMoneyNo',
            title: '资金累计拨付',
        }, {
            name: 'nonPaymentTotalMoneyNo',
            title: '欠付金额',
        }]

    },
    methods: {
        //预算评审金额和估算总额
        queryAllBudgetReviewMoney: function () {
            let self = this;
            let data = {};
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {
                data.projectFinance = self.user.role;
            }
            self.$http.post('/api/project/queryAllBudgetReviewMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allBudgetReviewMoney = res.data.recordset[0];
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
        //查询拨付金额
        queryAllAppropriateMoney: function () {
            let self = this;
            let data = {};
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.userName = self.user.role;
            } else if (self.user.grade == 2) {
                data.role = self.user.role;
            }
            self.$http.post('/api/project/queryAllAppropriateMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allAppropriateMoney = res.data.recordset[0];
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
        //查询年度安排金额
        queryAllBudgetPlanMoney: function () {
            let self = this;
            let data = {};
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.userName = self.user.role;
            } else if (self.user.grade == 2) {
                data.role = self.user.role;
            }
            self.$http.post('/api/project/queryAllBudgetPlanMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allBudgetPlanMoney = res.data.recordset[0];
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
            self.allProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.allProject.formData.projectInstitution = value;
        },
        //查询报表,查询所有报表
        queryAllProjectWithoutPage: function () {
            let self = this;
            let data = _.cloneDeep(self.allProject.formData);
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {
                data.projectFinance = self.user.role;
            }
            self.$http.post('/api/project/queryAllProjectWithoutPage', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        let excelConfig = [];
                        var listData = res.data.recordset;
                        excelConfig.push(self.excelTitleConfig.map(item => {
                            return item.title
                        }))

                        listData.forEach(list => {
                            excelConfig.push(self.excelTitleConfig.map(item => {
                                const value = list[item.name];
                                // 不一定要有value， 因为可能是自由组合的value
                                return item.format && item.format(value, list) || value;
                            }))
                        })
                        //计算合计
                        var temp = _.cloneDeep(excelConfig);
                        var columns = excelConfig[0];
                        temp.shift();
                        var data = temp;
                        var sums = self.getSummaries(columns,data);
                        self.sum = sums;
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
        //查询报表,查询所有报表
        queryAllProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.allProject.formData);
            data.page = flag ? 1 : self.allProject.currentPage;
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {
                data.projectFinance = self.user.role;
            }
            self.$http.post('/api/project/queryAllProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allProject.allProjectList = res.data.recordset;
                        self.allProject.currentPage = data.page;
                        if (flag) {
                            self.queryAllProjectCount(data);
                        }
                        self.queryAllProjectWithoutPage();
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
        queryAllProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.allProject.currentPage;
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {
                data.projectFinance = self.user.role;
            }
            self.$http.post('/api/project/queryAllProjectCount', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.allProject.count = res.data.recordset[0].num;
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
        //合计
        getSummaries:function(columns,data){
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总金额(万元）';
                    return;
                }
                if (index === 1 || index === 2 ||index === 3||index === 4) {
                    sums[index] = 'N/A';
                    return;
                }
                const values = data.map(item => Number(item[index]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] += ' ';
                } else {
                    sums[index] = 'N/A';
                }
            });
            return sums;
        },
        //
        getSummary:function(param){
            var self = this;
            const { columns, data } = param;
            const sums = [];
            console.log('this.getAllTotalData2',self.sum);
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';    //这里就是显示你要写的啥名字,是合计还是汇总什么
                    return;
                }else{
                    sums[index] = self.sum[index+1];
                }
            });
            return sums;
        },
        showAllProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.activeNames = ['1', '2', '3', '4', '5', '6', '7'];
        },
        handleClose(done) {
            done();
        },
        //导出
        ExportFinishedProject: function () {
            var self = this;
            var data = _.cloneDeep(self.allProject.formData);
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {
                data.projectFinance = self.user.role;
            }
            fetch('/api/export/exportExcel',
                {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }).then(function (response) {
                return response.blob();
            }).then(function (myBlob) {
                const blob = new Blob([myBlob], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                });
                var objectURL = URL.createObjectURL(blob);
                const aLink = document.createElement('a');
                var now = new Date();
                aLink.download = '临猗县建设项目库项目汇总表_' + `${now.getFullYear()}${('0' + (now.getMonth() + 1)).slice(-2)}${now.getDate()}`;
                aLink.href = objectURL;
                aLink.click();
                URL.revokeObjectURL(blob);
            }); // 通过原生 fetch 获取数据，fetch 参考 文档
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.allProject.formData.projectInstitution = "";
            self.allProject.formData.projectType = "";
            self.allProject.formData.projectName = "";
            self.allProject.formData.projectYears = "";
            self.allProject.formData.id = "";
            self.allProject.formData.approvalStep = "";
            self.levelOne = "";
            if (flag) {
                self.queryAllProject(true);
            }
        },
        //查询新建项目个数
        queryNewProjectCount: function () {
            let self = this;
            let data = {};
            data.page = 1;
            data.step = 1;
            data.stepOneApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
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
                        self.monitor.newProjectCount = res.data.recordset[0].num;
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
        //完工库
        queryFinishedProjectCount: function () {
            let self = this;
            let data = {};
            data.page = 1;
            data.step = 7;
            data.stepSevenApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
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
                        self.monitor.finishedProjectCount = res.data.recordset[0].num;
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
        //退库
        queryReturnedProjectCount: function () {
            let self = this;
            let data = {};
            data.page = 1;
            data.step = 0;
            data.ifReturned = 1;
            if (self.user.grade == 1) {//第一个项目查自己的加上条件
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {
                data.projectFinance = self.user.role;
            }
            self.$http.post('/api/project/queryReturnProjectCount', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.monitor.returnedProjectCount = res.data.recordset[0].num;
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

    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderProjectYears: Filters.renderProjectYears,
        renderThisYearPlanTotalMoney: Filters.renderThisYearPlanTotalMoney,
        renderNextYearsPlanTotalMoney: Filters.renderNextYearsPlanTotalMoney,
        renderThirdYearsPlanTotalMoney: Filters.renderThirdYearsPlanTotalMoney,
        renderBeforeYearPlanTotalMoney: Filters.renderBeforeYearPlanTotalMoney,
        renderAppThisYearMoney: Filters.renderAppThisYearMoney,
        renderAppTotalMoney: Filters.renderAppTotalMoney,
        renderPlanTotalMoney: Filters.renderPlanTotalMoney,
        renderNonPaymentTotalMoney: Filters.renderNonPaymentTotalMoney

    }
}
