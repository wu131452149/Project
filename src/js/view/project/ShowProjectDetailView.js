/**
 * 这个文件主要是展示所有项目信息
 *  created by LilyLee on 2019/9/22.
 **/
import Filters from "../common/Filters";
import Utils from "../../lib/Utils/Utils";
import EventBus from "../../lib/event/EventBus";

export default {
    name: "ShowProjectDetailView",
    props: ["projectDetail", "step", "activeNames", "showEdit", "grade", "showButton", "showBF","showAP"],
    data() {
        return {
            loading: false,
            user: {},
            totalMoney: 0,
            totalContractMoney: 0,
            appropriateBudget: [],
            appropriateTopBudget: [],
            cutBudget: [],
            addBudget: [],
            addContractBudget: [],
            cutContractBudget: [],
            totalCut: 0,
            totalAdd: 0,
            totalContractCut: 0,
            totalContractAdd: 0,
            fileList: [],
            names: this.activeNames,
            ifNewPro: {}
        }
    },
    beforeMount: function () {
        var self = this;
        self.initFileList();
        self.user = JSON.parse(sessionStorage.getItem('user'));
    },
    mounted: function () {
        // 验证码初始化
        //$('.main-content').height($(window).height() - 200);
        var self = this;
        self.initMoney();
        self.computeTotal();
        if (self.user.grade == 2) {
            self.queryIfNewProject();
        }
    },
    watch: {
        "showEdit": {
            immediate: true,
            handler: function (val) {
                var self = this;
                if (val) {
                    self.names = [];
                } else {
                    if (self.grade == 2) {
                        if (self.step == 2) {
                            self.names = ['2'];
                        } else if (self.step == 3) {
                            self.names = ['3'];
                        } else if (self.step == 4) {
                            self.names = ['4'];
                        } else if (self.step == 5) {
                            self.names = ['5'];
                        } else if (self.step == 6) {
                            self.names = ['6'];
                        } else if (self.step == 7) {
                            if (self.showBF) {
                                self.names = ['4'];
                            } else if (self.showAP) {
                                self.names = ['3'];
                            } else {
                                self.names = ['7'];
                            }

                        }

                    } else {
                        self.names = self.activeNames;
                    }
                }
            }
        },
        "projectDetail": {
            immediate: true,
            handler: function (val) {
                var self = this;
                self.initMoney();
                self.computeTotal();
                if (self.projectDetail.planYearsMoney) {
                    self.projectDetail.planYearsMoneyList = JSON.parse(self.projectDetail.planYearsMoney);
                    self.projectDetail.yearsPlanTotalMoneyList = Utils.mergeArr(self.projectDetail.planYearsMoneyList);//累计本级
                } else {
                    self.projectDetail.planYearsMoneyList = [];
                    self.projectDetail.yearsPlanTotalMoneyList = [];
                }
                if (self.projectDetail.planYearsTopMoney) {
                    self.projectDetail.planYearsTopMoneyList = JSON.parse(self.projectDetail.planYearsTopMoney);
                    self.projectDetail.yearsPlanTotalTopMoneyList = Utils.mergeArr(self.projectDetail.planYearsTopMoneyList);//累计上级
                } else {
                    self.projectDetail.planYearsTopMoneyList = [];
                    self.projectDetail.yearsPlanTotalTopMoneyList = [];
                }
                if (self.projectDetail.appropriateBudget) {//本级拨付
                    self.projectDetail.appropriateBudgetList = JSON.parse(self.projectDetail.appropriateBudget);
                    var list = JSON.parse(self.projectDetail.appropriateBudget);
                    for (var y = 0; y < list.length; y++) {
                        list[y].years = list[y].date.substring(0, 4);
                    }
                    self.projectDetail.appropriateTotalBudgetList = Utils.mergeArr(list);//累计上级
                } else {
                    self.projectDetail.appropriateBudgetList = [];
                    self.projectDetail.appropriateTotalBudgetList = [];
                }
                if (self.projectDetail.appropriateTopBudget) {//上级拨付
                    self.projectDetail.appropriateTopBudgetList = JSON.parse(self.projectDetail.appropriateTopBudget);
                    var list = JSON.parse(self.projectDetail.appropriateTopBudget);
                    for (var y = 0; y < list.length; y++) {
                        list[y].years = list[y].date.substring(0, 4);
                    }
                    self.projectDetail.appropriateTopTotalBudgetList = Utils.mergeArr(list);//累计上级
                } else {
                    self.projectDetail.appropriateTopBudgetList = [];
                    self.projectDetail.appropriateTopTotalBudgetList = [];
                }
                if (self.projectDetail.triInfo) {//第三方
                    self.projectDetail.triInfoList = JSON.parse(self.projectDetail.triInfo);
                } else {
                    self.projectDetail.triInfoList = [];
                }
            }
        },
    },
    methods: {
        initMoney: function () {
            var self = this;
            if (self.projectDetail.appropriateBudget) {
                self.appropriateBudget = JSON.parse(self.projectDetail.appropriateBudget);
            }
            if (self.projectDetail.appropriateTopBudget) {
                self.appropriateTopBudget = JSON.parse(self.projectDetail.appropriateTopBudget);
            }
            if (self.projectDetail.cutBudget) {
                self.cutBudget = JSON.parse(self.projectDetail.cutBudget);
            }
            if (self.projectDetail.addBudget) {
                self.addBudget = JSON.parse(self.projectDetail.addBudget);
            }
            if (self.projectDetail.cutContractBudget) {
                self.cutContractBudget = JSON.parse(self.projectDetail.cutContractBudget);
            }
            if (self.projectDetail.addContractBudget) {
                self.addContractBudget = JSON.parse(self.projectDetail.addContractBudget);
            }
        },
        //查询是否有新的
        queryIfNewProject: function () {
            let self = this;
            var data = {};
            data.role = self.user.role;
            self.$http.post('/api/project/queryIfNewProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.ifNewPro = res.data.recordset[0];
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
        handleChange(val) {
            console.log(val);
        },
        computeTotal: function () {
            var self = this;
            if (self.projectDetail.cutBudget || self.projectDetail.addBudget) {
                var total1 = 0;
                var total2 = 0;
                var appTotal1 = 0;
                var appTotal2 = 0;
                if (self.cutBudget.length > 0) {
                    for (var x = 0; x < self.cutBudget.length; x++) {
                        total1 = total1 + Number(self.cutBudget[x].money);
                        if (self.cutBudget[x].status == 2) {
                            appTotal1 = appTotal1 + Number(self.cutBudget[x].money);
                        }
                    }
                }
                if (self.addBudget.length > 0) {
                    for (var y = 0; y < self.addBudget.length; y++) {
                        total2 = total2 + Number(self.addBudget[y].money);
                        if (self.addBudget[y].status == 2) {
                            appTotal2 = appTotal2 + Number(self.addBudget[y].money);
                        }
                    }
                }
                self.totalCut = total1;
                self.totalAdd = total2;
                if (appTotal2 != 0 || appTotal1 != 0) {//增加或减少的预算都不为0的时候
                    self.totalMoney = Number(self.projectDetail.budgetReviewMoney) - Number(total1) + Number(total2);
                } else {
                    self.totalMoney = Number(self.projectDetail.budgetReviewMoney);
                }

            }
            if (self.projectDetail.cutContractBudget || self.projectDetail.addContractBudget) {
                var total3 = 0;
                var total4 = 0;
                var appTotal3 = 0;
                var appTotal4 = 0;
                if (self.cutContractBudget.length > 0) {
                    for (var x = 0; x < self.cutContractBudget.length; x++) {
                        total3 = total3 + Number(self.cutContractBudget[x].money);
                        if (self.cutContractBudget[x].status == 2) {
                            appTotal3 = appTotal3 + Number(self.cutContractBudget[x].money);
                        }
                    }
                }
                if (self.addContractBudget.length > 0) {
                    for (var y = 0; y < self.addContractBudget.length; y++) {
                        total4 = total4 + Number(self.addContractBudget[y].money);
                        if (self.addContractBudget[y].status == 2) {
                            appTotal4 = appTotal4 + Number(self.addContractBudget[y].money);
                        }
                    }
                }
                self.totalContractCut = total3;
                self.totalContractAdd = total4;
                if (appTotal3 != 0 || appTotal4 != 0) {//增加或减少的预算都不为0的时候
                    self.totalContractMoney = Number(self.projectDetail.contractMoney) - Number(total3) + Number(total4);
                } else {
                    self.totalContractMoney = Number(self.projectDetail.contractMoney);
                }

            }

        },
        downloadUrl: function (data) {
            var self = this;
            var frameObj = document.getElementById("download-file-frame-id");
            console.log(process.env);
            self.$http.post('/api/user/downloadFile', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //this.budgetPlanProject.budgetPlanProjectList = res.data.recordset;
                        var blob = new Blob([res.data], {type: "application/octet-stream"});
                        if ('msSaveOrOpenBlob' in navigator) {

                            // Microsoft Edge and Microsoft Internet Explorer 10-11
                            window.navigator.msSaveOrOpenBlob(blob, data.oname);
                        } else {
                            var a = document.getElementById("exportCSVlink");
                            a.download = data.oname;
                            a.href = URL.createObjectURL(blob);
                            a.click();
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
        //审核通过
        approvalProject: function () {
            var self = this;
            if (self.step == 1) {
                self.approvalNewProject();
            } else if (self.step == 2) {
                self.approvalBudgetPlan();
            } else if (self.step == 3) {
                self.approvalBudgetYearsPlan();
            } else if (self.step == 4) {
                self.approvalAppMoney();
            } else if (self.step == 5) {
                self.approvalBudgetChange();
            } else if (self.step == 6) {
                self.approvalTri();
            } else if (self.step == 7) {
                if (self.showBF) {
                    self.approvalAppMoney();
                } else if (self.showAP) {
                    self.approvalBudgetYearsPlan();
                } else {
                    self.approvalFinish();
                }
            }

        },
        //去除在建库的小红点
        eventBusToDeleteRed: function (data) {
            if (data) {
                var total = Number(data.stepTwo) + Number(data.stepThree) + Number(data.stepFour) + Number(data.stepFive) + Number(data.stepSix);
                if (total == 0) {
                    EventBus.$emit('hideMenuBadge', 'project_doing');
                }
            }

        },
        //审核新建库
        approvalNewProject: function () {
            //审核通过，把第2步状态改为3，并且把项目step改成2
            //0:审核不通过，1：审核通过并且下一步的也提交了，2：未审核
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            data.approvalStep = 2;
            data.stepOneApp = 1;
            data.stepTwoApp = 2;
            data.oldStep = 1;
            data.oldSuggestion = 2;
            data.ifEdit = 0;
            data.projectFinance = self.user.role;
            self.$http.post('/api/project/approvalProject', data).then(res => {
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
                            message: "审核成功",
                            type: 'success'
                        });
                        //当stepOne=0的时候发送到前端消除小红点
                        var data = res.data.recordsets[0];
                        if (data && data.stepOne == 0) {
                            EventBus.$emit('hideMenuBadge', 'show_new_project');
                        }
                        //关闭当前页，查询当前表格
                        self.$emit('appStep1');
                    } else {
                        self.$message({
                            message: "审核失败",
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
        //2审核预算评审
        approvalBudgetPlan: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成3
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            data.approvalStep = 3;
            data.stepTwoApp = 1;
            data.stepThreeApp = 2;
            data.oldStep = 2;
            data.oldSuggestion = 2;
            data.ifEdit = 0;
            data.projectFinance = self.user.role;
            self.$http.post('/api/project/approvalProject', data).then(res => {
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
                            message: "审核成功",
                            type: 'success'
                        });
                        //当stepTwo=0的时候发送到前端消除小红点
                        var data = res.data.recordsets[0];
                        if (data && data.stepTwo == 0) {
                            EventBus.$emit('hideTwoBadge');
                        }
                        //去除在建库的小红点
                        self.eventBusToDeleteRed(data);
                        //关闭当前页，查询当前表格
                        self.$emit('appStep2');
                    } else {
                        self.$message({
                            message: "审核失败",
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
        //3年度安排
        approvalBudgetYearsPlan: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成4
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            if (self.showAP) {//第7步的审核
                data.approvalStep = 7;
                data.oldStep = 7;
                data.yearsPlanSuggestion = 1;
                data.projectPlanPeriod = 7;
                data.projectPeriod = 7;
                data.ifEdit = 0;
            } else {
                if (self.projectDetail.approvalStep <= 3) {
                    data.approvalStep = 4;
                }
                data.oldStep = 3;
                data.stepThreeApp = 1;
                data.stepFourApp = 2;
                data.oldSuggestion = 2;
                data.ifThreeEdit = 0;
            }
            data.projectFinance = self.user.role;
            //存入总字段
            var list1 = _.cloneDeep(self.projectDetail.planYearsMoneyList);
            var list2 = _.cloneDeep(self.projectDetail.planYearsTopMoneyList);
            var list = list1.concat(list2);
            var obj = self.mergeArr(list);
            var culObj = _.cloneDeep(obj);
            //计算当年累计安排，次年累计安排，第三年累计安排
            var thisYears = Number(self.projectDetail.projectBeginTime.substring(0, 4));
            var nextYears = thisYears + 1;
            var nextYearsA = thisYears + 2;
            var beforeYearPlanMoney = 0;
            for (var a = 0; a < culObj.length; a++) {
                var years = Number(culObj[a].years.substring(0, 4));
                if (years == thisYears) {//当年累计安排
                    data.thisYearPlanMoney = Number(culObj[a].money);
                } else if (years == nextYears) {
                    data.nextYearPlanMoney = Number(culObj[a].money);
                } else if (years == nextYearsA) {
                    data.nextAYearPlanMoney = Number(culObj[a].money);
                } else if (years < thisYears) {
                    beforeYearPlanMoney = beforeYearPlanMoney + Number(culObj[a].money);
                }
            }
            data.beforeYearPlanMoney = beforeYearPlanMoney;
            var redCount = 0;
            //把所有的审核的status变成1
            for (var i = 0; i < self.projectDetail.planYearsMoneyList.length; i++) {
                if (self.projectDetail.planYearsMoneyList[i].status == 2) {
                    redCount = redCount + 1;
                }
                self.projectDetail.planYearsMoneyList[i].status = 1;
            }
            for (var i = 0; i < self.projectDetail.planYearsTopMoneyList.length; i++) {
                if (self.projectDetail.planYearsTopMoneyList[i].status == 2) {
                    redCount = redCount + 1;
                }
                self.projectDetail.planYearsTopMoneyList[i].status = 1;
            }
            if (self.projectDetail.planYearsMoneyList.length > 0) {
                data.planYearsMoney = JSON.stringify(self.projectDetail.planYearsMoneyList);
            }
            if (self.projectDetail.planYearsTopMoneyList.length > 0) {
                data.planYearsTopMoney = JSON.stringify(self.projectDetail.planYearsTopMoneyList);
            }
            //计算合计累计安排
            data.yearsPlanTotalMoneyNo = Utils.countTotalPlanMoney(obj);
            //对象
            data.yearsPlanTotalMoney = JSON.stringify(obj);
            data.redCount = redCount;
            self.$http.post('/api/project/approvalProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //将预算安排表里面的表的状态改成1，通过传入proid
                        self.updateBudgetPlanMoneyList(self.projectDetail);
                        self.$message({
                            message: "审核成功",
                            type: 'success'
                        });
                        if (self.showAP) {//第7步的审核
                            if (data && data.stepSeven == 0) {
                                EventBus.$emit('hideMenuBadge', 'project_finish');
                            }
                            //关闭当前页，查询当前表格
                            self.$emit('appStep7');
                        } else {
                            var data = res.data.recordsets[0];
                            if (data && data.stepThree == 0) {
                                EventBus.$emit('hideThreeBadge');
                            }
                            //去除在建库的小红点
                            self.eventBusToDeleteRed(data);
                            //关闭当前页，查询当前表格
                            self.$emit('appStep3');
                        }
                    } else {
                        self.$message({
                            message: "审核失败",
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
        //初始化总钱数，因为在刚录入的时候还没有审核，所以先不放进去，等审核完成的时候再放进去
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
        //县级年度预算安排更新为通过
        updateBudgetPlanMoneyList: function (detail) {
            var self = this;
            var data = {};
            data.projectId = detail.id;
            data.appStatus = 1;//变成审核通过
            self.$http.post('/api/project/updateBudgetPlanMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {

                    } else {

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
        //预算拨付更新为通过
        updateAppropriateBudgetMoneyList: function (detail) {
            var self = this;
            var data = {};
            data.projectId = detail.id;
            data.appStatus = 1;//变成审核通过
            self.$http.post('/api/project/updateAppropriateBudgetMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {

                    } else {

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
        //4拨付审核
        approvalAppMoney: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成5
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            if (self.showBF) {//第7步的审核
                data.approvalStep = 7;
                data.oldStep = 7;
                data.approvalSuggestion = 1;
                data.projectPeriod = 7;
                data.ifEdit = 0;
            } else {
                if (self.projectDetail.approvalStep <= 4) {
                    data.approvalStep = 5;
                }
                data.oldStep = 4;
                data.stepFourApp = 1;
                data.stepFiveApp = 2;
                data.oldSuggestion = 2;
                data.ifFourEdit = 0;
            }
            data.projectFinance = self.user.role;
            //存入总字段
            var list1 = _.cloneDeep(self.projectDetail.appropriateBudgetList);
            var list2 = _.cloneDeep(self.projectDetail.appropriateTopBudgetList);
            var list = list1.concat(list2);
            for (var y = 0; y < list.length; y++) {
                list[y].years = list[y].date.substring(0, 4);
            }
            var obj = Utils.mergeArr(list);
            var culObj = _.cloneDeep(obj);
            //计算当年拨付
            var thisYears = Number(self.projectDetail.projectBeginTime.substring(0, 4));
            for (var a = 0; a < culObj.length; a++) {
                var years = Number(culObj[a].years.substring(0, 4));
                if (years == thisYears) {//当年累计拨付
                    data.thisYearGiveMoney = Number(culObj[a].money);
                }
            }
            var redCount = 0;
            //把所有的审核的status变成1
            for (var i = 0; i < self.projectDetail.appropriateBudgetList.length; i++) {
                if (self.projectDetail.appropriateBudgetList[i].status == 2) {
                    redCount = redCount + 1;
                }
                self.projectDetail.appropriateBudgetList[i].status = 1;
            }
            for (var j = 0; j < self.projectDetail.appropriateTopBudgetList.length; j++) {
                if (self.projectDetail.appropriateTopBudgetList[j].status == 2) {
                    redCount = redCount + 1;
                }
                self.projectDetail.appropriateTopBudgetList[j].status = 1;
            }
            if (self.projectDetail.appropriateBudgetList.length > 0) {
                data.appropriateBudget = JSON.stringify(self.projectDetail.appropriateBudgetList);
            }
            if (self.projectDetail.appropriateTopBudgetList.length > 0) {
                data.appropriateTopBudget = JSON.stringify(self.projectDetail.appropriateTopBudgetList);
            }
            //计算合计累计拨付
            data.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(obj);
            //对象
            data.approTotalMoney = JSON.stringify(obj);
            data.nonPaymentTotalMoneyNo = Number(Number(self.projectDetail.yearsPlanTotalMoneyNo) - data.approTotalPlanMoneyNo);
            //计算总欠付：
            if (self.showBF) {//第7步的审核
                data.totalNoPay = Number(Number(self.projectDetail.finishMoney) - Number(data.approTotalPlanMoneyNo));
            } else {
                data.totalNoPay = Number(Number(self.projectDetail.contractMoney) - data.approTotalPlanMoneyNo);
            }
            data.redCount = redCount;
            self.$http.post('/api/project/approvalProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //将预算安排表里面的表的状态改成1，通过传入proid
                        self.updateAppropriateBudgetMoneyList(self.projectDetail);
                        self.$message({
                            message: "审核成功",
                            type: 'success'
                        });
                        var data = res.data.recordsets[0];
                        if (self.showBF) {//第7步的审核
                            if (data && data.stepSeven == 0) {
                                EventBus.$emit('hideMenuBadge', 'project_finish');
                            }
                            //关闭当前页，查询当前表格
                            self.$emit('appStep7');
                        } else {
                            if (data && data.stepFour == 0) {
                                EventBus.$emit('hideFourBadge');
                            }
                            //去除在建库的小红点
                            self.eventBusToDeleteRed(data);
                            //关闭当前页，查询当前表格
                            self.$emit('appStep4');
                        }

                    } else {
                        self.$message({
                            message: "审核失败",
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
        //5项目变更
        approvalBudgetChange: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成5
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            if (self.projectDetail.approvalStep <= 5) {
                data.approvalStep = 6;
            }
            data.oldStep = 5;
            data.stepFiveApp = 1;
            data.stepSixApp = 2;
            data.oldSuggestion = 2;
            data.ifFiveEdit = 0;
            data.projectFinance = self.user.role;
            //存入总字段
            var redCount = 0;
            //把所有的审核的status变成1
            for (var i = 0; i < self.addBudget.length; i++) {
                if (self.addBudget[i].status == 2) {
                    redCount = redCount + 1;
                }
                self.addBudget[i].status = 1;
            }
            for (var j = 0; j < self.cutBudget.length; j++) {
                if (self.cutBudget[j].status == 2) {
                    redCount = redCount + 1;
                }
                self.cutBudget[j].status = 1;
            }
            if (self.addBudget.length > 0) {
                data.addBudget = JSON.stringify(self.addBudget);
            }
            if (self.cutBudget.length > 0) {
                data.cutBudget = JSON.stringify(self.cutBudget);
            }
            //合同金额
            for (var x = 0; x < self.addContractBudget.length; x++) {
                self.addContractBudget[x].status = 1;
            }
            for (var y = 0; y < self.cutContractBudget.length; y++) {
                self.cutContractBudget[y].status = 1;
            }
            if (self.addContractBudget.length > 0) {
                data.addContractBudget = JSON.stringify(self.addContractBudget);
            }
            if (self.cutContractBudget.length > 0) {
                data.cutContractBudget = JSON.stringify(self.cutContractBudget);
            }
            data.redCount = redCount;
            //把预算总金额改成totalMoney的数字，更新到数据库
            data.budgetReviewMoney = self.totalMoney;
            //把合同总金额改成totalMoney的数字，更新到数据库
            data.contractMoney = self.totalContractMoney;
            //计算总欠付：（用合同金额
            data.totalNoPay = Number(Number(data.contractMoney) - Number(self.projectDetail.approTotalPlanMoneyNo));
            self.$http.post('/api/project/approvalProject', data).then(res => {
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
                            message: "审核成功",
                            type: 'success'
                        });
                        var data = res.data.recordsets[0];
                        if (data && data.stepFive == 0) {
                            EventBus.$emit('hideFiveBadge');
                        }
                        //去除在建库的小红点
                        self.eventBusToDeleteRed(data);
                        //关闭当前页，查询当前表格
                        self.$emit('appStep5');
                    } else {
                        self.$message({
                            message: "审核失败",
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
        //6三方审核
        approvalTri: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成6
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            if (self.projectDetail.speed == 100) {//审核之后工程到百分之百才能进入完工库
                data.approvalStep = 7;
                data.stepSixApp = 1;
                data.stepSevenApp = 2;
                data.oldSuggestion = 2;
            } else {
                data.approvalStep = 6;
                data.stepSixApp = 1;
                //data.stepSevenApp = 2;
                data.oldSuggestion = 2;
            }
            data.oldStep = 6;
            data.ifSixEdit = 0;
            data.projectFinance = self.user.role;
            //三方信息审核通过，把所有status为2的改成1
            var redCount = 0;
            var list = _.cloneDeep(self.projectDetail.triInfoList);
            for (var i = 0; i < list.length; i++) {
                if (list[i].status == 2) {
                    redCount = redCount + 1;
                }
                list[i].status = 1;
            }
            data.triInfo = JSON.stringify(list);
            data.redCount = redCount;
            self.$http.post('/api/project/approvalProject', data).then(res => {
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
                            message: "审核成功",
                            type: 'success'
                        });
                        var data = res.data.recordsets[0];
                        if (data && data.stepSix == 0) {
                            EventBus.$emit('hideSixBadge');
                        }
                        //去除在建库的小红点
                        self.eventBusToDeleteRed(data);
                        //关闭当前页，查询当前表格
                        self.$emit('appStep6');
                    } else {
                        self.$message({
                            message: "审核失败",
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
        //7审核决算
        approvalFinish: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成7
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            data.approvalStep = 7;
            data.stepSevenApp = 1;
            data.oldStep = 7;
            data.oldSuggestion = 1;//第7步审核通过
            data.ifEdit = 0;
            data.projectFinance = self.user.role;
            data.projectPlanPeriod = 7;//把项目阶段设置为7，判断有这个变量之后就可以在完工之后录入安排
            data.totalNoPay = Number(Number(self.projectDetail.finishMoney) - Number(self.projectDetail.approTotalPlanMoneyNo));
            self.$http.post('/api/project/approvalProject', data).then(res => {
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
                            message: "审核成功",
                            type: 'success'
                        });
                        var data = res.data.recordsets[0];
                        if (data && data.stepSeven == 0) {
                            EventBus.$emit('hideMenuBadge', 'project_finish');
                        }
                        //关闭当前页，查询当前表格
                        self.$emit('appStep7');
                    } else {
                        self.$message({
                            message: "审核失败",
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
        //显示文件
        initFileList: function () {
            var self = this;
            if (self.projectDetail.fileList) {
                self.fileList = JSON.parse(self.projectDetail.fileList);
            }
        },
        //审核不通过
        disApprovalProject: function () {
            let self = this;
            let data = {};
            //步骤等于当前的步骤，把审核状态改为0
            data.id = self.projectDetail.id;
            data.oldStep = self.step;
            data.projectFinance = self.user.role;
            if (self.step == 1) {
                data.oldSuggestion = self.projectDetail.stepOneApp;
                data.stepOneApp = 0;
            } else if (self.step == 2) {
                data.oldSuggestion = self.projectDetail.stepTwoApp;
                data.stepTwoApp = 0;
            } else if (self.step == 3) {
                data.oldSuggestion = self.projectDetail.stepThreeApp;
                data.stepThreeApp = 0;
                var redCount = 0;
                //删除未审核的数据
                for (var i = 0; i < self.projectDetail.planYearsMoneyList.length; i++) {
                    if (self.projectDetail.planYearsMoneyList[i].status == 2) {
                        redCount = redCount + 1;
                        self.projectDetail.planYearsMoneyList.splice(i, 1);
                    }
                }
                for (var i = 0; i < self.projectDetail.planYearsTopMoneyList.length; i++) {
                    if (self.projectDetail.planYearsTopMoneyList[i].status == 2) {
                        redCount = redCount + 1;
                        self.projectDetail.planYearsTopMoneyList.splice(i, 1);
                    }
                }
                var list1 = _.cloneDeep(self.projectDetail.planYearsMoneyList);
                var list2 = _.cloneDeep(self.projectDetail.planYearsTopMoneyList);
                var list = list1.concat(list2);
                var obj = self.mergeArr(list);
                var culObj = _.cloneDeep(obj);
                //计算当年累计安排，次年累计安排，第三年累计安排
                var thisYears = Number(self.projectDetail.projectBeginTime.substring(0, 4));
                var nextYears = thisYears + 1;
                var nextYearsA = thisYears + 2;
                var beforeYearPlanMoney = 0;
                for (var a = 0; a < culObj.length; a++) {
                    var years = Number(culObj[a].years.substring(0, 4));
                    if (years == thisYears) {//当年累计安排
                        data.thisYearPlanMoney = Number(culObj[a].money);
                    } else if (years == nextYears) {
                        data.nextYearPlanMoney = Number(culObj[a].money);
                    } else if (years == nextYearsA) {
                        data.nextAYearPlanMoney = Number(culObj[a].money);
                    } else if (years < thisYears) {
                        beforeYearPlanMoney = beforeYearPlanMoney + Number(culObj[a].money);
                    }
                }
                data.beforeYearPlanMoney = beforeYearPlanMoney;
                if (self.projectDetail.planYearsMoneyList.length > 0) {
                    data.planYearsMoney = JSON.stringify(self.projectDetail.planYearsMoneyList);
                } else {
                    data.planYearsMoney = "";
                }
                if (self.projectDetail.planYearsTopMoneyList.length > 0) {
                    data.planYearsTopMoney = JSON.stringify(self.projectDetail.planYearsTopMoneyList);
                } else {
                    data.planYearsTopMoney = "";
                }
                //计算合计累计安排
                data.yearsPlanTotalMoneyNo = Utils.countTotalPlanMoney(obj);
                //对象
                data.yearsPlanTotalMoney = JSON.stringify(obj);
                data.redCount = redCount;
            } else if (self.step == 4) {
                data.oldSuggestion = self.projectDetail.stepFourApp;
                data.stepFourApp = 0;
                var redCount = 0;
                //删除未审核的数据
                for (var i = 0; i < self.projectDetail.appropriateBudgetList.length; i++) {
                    if (self.projectDetail.appropriateBudgetList[i].status == 2) {
                        redCount = redCount + 1;
                        self.projectDetail.appropriateBudgetList.splice(i, 1);
                    }
                }
                for (var j = 0; j < self.projectDetail.appropriateTopBudgetList.length; j++) {
                    if (self.projectDetail.appropriateTopBudgetList[j].status == 2) {
                        redCount = redCount + 1;
                        self.projectDetail.appropriateTopBudgetList.splice(j, 1);
                    }
                }
                var list1 = _.cloneDeep(self.projectDetail.appropriateBudgetList);
                var list2 = _.cloneDeep(self.projectDetail.appropriateTopBudgetList);
                var list = list1.concat(list2);
                for (var y = 0; y < list.length; y++) {
                    list[y].years = list[y].date.substring(0, 4);
                }
                var obj = self.mergeArr(list);
                if (self.projectDetail.appropriateBudgetList.length > 0) {
                    data.appropriateBudget = JSON.stringify(self.projectDetail.appropriateBudgetList);
                } else {
                    data.appropriateBudget = "";
                }
                if (self.projectDetail.appropriateTopBudgetList.length > 0) {
                    data.appropriateTopBudget = JSON.stringify(self.projectDetail.appropriateTopBudgetList);
                } else {
                    data.appropriateTopBudget = "";
                }
                data.redCount = redCount;
                //计算合计累计拨付
                data.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(obj);
                //对象
                data.approTotalMoney = JSON.stringify(obj);
                data.nonPaymentTotalMoneyNo = Number(self.projectDetail.yearsPlanTotalMoneyNo - data.approTotalPlanMoneyNo);
                //计算总欠付：
                data.totalNoPay = Number(Number(self.projectDetail.contractMoney) - data.approTotalPlanMoneyNo);
            } else if (self.step == 5) {
                data.oldSuggestion = self.projectDetail.stepFiveApp;
                data.stepFiveApp = 0;
                var redCount = 0;
                //变更审核不通过，把所有status为2的去掉
                for (var i = 0; i < self.cutBudget.length; i++) {
                    if (self.cutBudget[i].status == 2) {
                        redCount = redCount + 1;
                        self.cutBudget.splice(i, 1);
                    }
                }
                for (var i = 0; i < self.addBudget.length; i++) {
                    if (self.addBudget[i].status == 2) {
                        redCount = redCount + 1;
                        self.addBudget.splice(i, 1);
                    }
                }
                if (self.addBudget.length > 0) {
                    data.addBudget = JSON.stringify(self.addBudget);
                } else {
                    data.addBudget = "";
                }
                if (self.cutBudget.length > 0) {
                    data.cutBudget = JSON.stringify(self.cutBudget);
                } else {
                    data.cutBudget = "";
                }
                //合同金额
                //变更审核不通过，把所有status为2的去掉
                for (var x = 0; x < self.addContractBudget.length; x++) {
                    self.addContractBudget.splice(x, 1);
                }
                for (var y = 0; y < self.cutContractBudget.length; y++) {
                    self.cutContractBudget.splice(y, 1);
                }
                if (self.addContractBudget.length > 0) {
                    data.addContractBudget = JSON.stringify(self.addContractBudget);
                } else {
                    data.addContractBudget = "";
                }
                if (self.cutContractBudget.length > 0) {
                    data.cutContractBudget = JSON.stringify(self.cutContractBudget);
                } else {
                    data.cutContractBudget = "";
                }
                data.redCount = redCount;
            } else if (self.step == 6) {
                data.oldSuggestion = self.projectDetail.stepSixApp;
                data.stepSixApp = 0;
                var redCount = 0;
                //三方信息审核通过，把所有status为2的去掉
                for (var i = 0; i < self.projectDetail.triInfoList.length; i++) {
                    if (self.projectDetail.triInfoList[i].status == 2) {
                        redCount = redCount + 1;
                        self.projectDetail.triInfoList.splice(i, 1);
                    }
                }
                data.redCount = redCount;
                data.triInfo = JSON.stringify(self.projectDetail.triInfoList);
            } else if (self.step == 7) {
                if (self.showBF) {
                    //审核拨付不通过
                    data.approvalSuggestion = 0;
                    data.projectPeriod = 7;
                    var redCount = 0;
                    //删除未审核的数据
                    for (var i = 0; i < self.projectDetail.appropriateBudgetList.length; i++) {
                        if (self.projectDetail.appropriateBudgetList[i].status == 2) {
                            redCount = redCount + 1;
                            self.projectDetail.appropriateBudgetList.splice(i, 1);
                        }
                    }
                    for (var j = 0; j < self.projectDetail.appropriateTopBudgetList.length; j++) {
                        if (self.projectDetail.appropriateTopBudgetList[j].status == 2) {
                            redCount = redCount + 1;
                            self.projectDetail.appropriateTopBudgetList.splice(j, 1);
                        }
                    }
                    var list1 = _.cloneDeep(self.projectDetail.appropriateBudgetList);
                    var list2 = _.cloneDeep(self.projectDetail.appropriateTopBudgetList);
                    var list = list1.concat(list2);
                    for (var y = 0; y < list.length; y++) {
                        list[y].years = list[y].date.substring(0, 4);
                    }
                    var obj = self.mergeArr(list);
                    if (self.projectDetail.appropriateBudgetList.length > 0) {
                        data.appropriateBudget = JSON.stringify(self.projectDetail.appropriateBudgetList);
                    } else {
                        data.appropriateBudget = "";
                    }
                    if (self.projectDetail.appropriateTopBudgetList.length > 0) {
                        data.appropriateTopBudget = JSON.stringify(self.projectDetail.appropriateTopBudgetList);
                    } else {
                        data.appropriateTopBudget = "";
                    }
                    data.redCount = redCount;
                    //计算合计累计拨付
                    data.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(obj);
                    //对象
                    data.approTotalMoney = JSON.stringify(obj);
                    data.nonPaymentTotalMoneyNo = Number(self.projectDetail.yearsPlanTotalMoneyNo - data.approTotalPlanMoneyNo);
                    //计算总欠付：
                    data.totalNoPay = Number(Number(self.projectDetail.contractMoney) - data.approTotalPlanMoneyNo);
                }else if (self.showAP) {
                    //审核拨付不通过
                    data.yearsPlanSuggestion = 0;
                    data.projectPlanPeriod = 7;
                    var redCount = 0;
                    //删除未审核的数据
                    for (var i = 0; i < self.projectDetail.planYearsMoneyList.length; i++) {
                        if (self.projectDetail.planYearsMoneyList[i].status == 2) {
                            redCount = redCount + 1;
                            self.projectDetail.planYearsMoneyList.splice(i, 1);
                        }
                    }
                    for (var i = 0; i < self.projectDetail.planYearsTopMoneyList.length; i++) {
                        if (self.projectDetail.planYearsTopMoneyList[i].status == 2) {
                            redCount = redCount + 1;
                            self.projectDetail.planYearsTopMoneyList.splice(i, 1);
                        }
                    }
                    var list1 = _.cloneDeep(self.projectDetail.planYearsMoneyList);
                    var list2 = _.cloneDeep(self.projectDetail.planYearsTopMoneyList);
                    var list = list1.concat(list2);
                    var obj = self.mergeArr(list);
                    var culObj = _.cloneDeep(obj);
                    //计算当年累计安排，次年累计安排，第三年累计安排
                    var thisYears = Number(self.projectDetail.projectBeginTime.substring(0, 4));
                    var nextYears = thisYears + 1;
                    var nextYearsA = thisYears + 2;
                    var beforeYearPlanMoney = 0;
                    for (var a = 0; a < culObj.length; a++) {
                        var years = Number(culObj[a].years.substring(0, 4));
                        if (years == thisYears) {//当年累计安排
                            data.thisYearPlanMoney = Number(culObj[a].money);
                        } else if (years == nextYears) {
                            data.nextYearPlanMoney = Number(culObj[a].money);
                        } else if (years == nextYearsA) {
                            data.nextAYearPlanMoney = Number(culObj[a].money);
                        } else if (years < thisYears) {
                            beforeYearPlanMoney = beforeYearPlanMoney + Number(culObj[a].money);
                        }
                    }
                    data.beforeYearPlanMoney = beforeYearPlanMoney;
                    if (self.projectDetail.planYearsMoneyList.length > 0) {
                        data.planYearsMoney = JSON.stringify(self.projectDetail.planYearsMoneyList);
                    } else {
                        data.planYearsMoney = "";
                    }
                    if (self.projectDetail.planYearsTopMoneyList.length > 0) {
                        data.planYearsTopMoney = JSON.stringify(self.projectDetail.planYearsTopMoneyList);
                    } else {
                        data.planYearsTopMoney = "";
                    }
                    //计算合计累计安排
                    data.yearsPlanTotalMoneyNo = Utils.countTotalPlanMoney(obj);
                    //对象
                    data.yearsPlanTotalMoney = JSON.stringify(obj);
                    data.redCount = redCount;
                } else {
                    data.oldSuggestion = self.projectDetail.stepSevenApp;
                    data.stepSevenApp = 0;
                }
            }
            self.$http.post('/api/project/approvalProject', data).then(res => {
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
                            message: "操作成功",
                            type: 'success'
                        });
                        //重新查询一下表格
                        var data = res.data.recordsets[0];
                        if (data) {
                            if (self.step == 1) {
                                //当stepOne=0的时候发送到前端消除小红点
                                if (data.stepOne == 0) {
                                    EventBus.$emit('hideMenuBadge', 'show_new_project');
                                }
                                self.$emit('unAppStep1');
                            } else if (self.step == 2) {
                                if (data.stepTwo == 0) {
                                    EventBus.$emit('hideTwoBadge');
                                }
                                //去除在建库的小红点
                                self.eventBusToDeleteRed(data);
                                self.$emit('unAppStep2');
                            } else if (self.step == 3) {
                                //更新
                                if (data.stepThree == 0) {
                                    EventBus.$emit('hideThreeBadge');
                                }
                                //去除在建库的小红点
                                self.eventBusToDeleteRed(data);
                                self.deleteBudgetPlanMoneyList(self.projectDetail);
                                self.$emit('unAppStep3');
                            } else if (self.step == 4) {
                                if (data.stepFour == 0) {
                                    EventBus.$emit('hideFourBadge');
                                }
                                //去除在建库的小红点
                                self.eventBusToDeleteRed(data);
                                //删除表里的信息
                                self.deleteAppBudgetMoneyList(self.projectDetail);
                                self.$emit('unAppStep4');
                            } else if (self.step == 5) {
                                if (data.stepFive == 0) {
                                    EventBus.$emit('hideFiveBadge');
                                }
                                //去除在建库的小红点
                                self.eventBusToDeleteRed(data);
                                self.$emit('unAppStep5');
                            } else if (self.step == 6) {
                                if (data.stepSix == 0) {
                                    EventBus.$emit('hideSixBadge');
                                }
                                //去除在建库的小红点
                                self.eventBusToDeleteRed(data);
                                self.$emit('unAppStep6');
                            } else if (self.step == 7) {
                                if (data.stepSeven == 0) {
                                    EventBus.$emit('hideMenuBadge', 'project_finish');
                                }
                                self.$emit('unAppStep7');
                            }
                        }
                    } else {
                        self.$message({
                            message: "操作失败",
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
        deleteBudgetPlanMoneyList: function (detail) {
            var self = this;
            var data = {};
            data.projectId = detail.id;
            data.appStatus = 2;//删除状态为2
            self.$http.post('/api/project/deleteBudgetPlanMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {

                    } else {

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

        deleteAppBudgetMoneyList: function (detail) {
            var self = this;
            var data = {};
            data.projectId = detail.id;
            data.appStatus = 2;//删除状态为2
            self.$http.post('/api/project/deleteAppropriateMoney', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {

                    } else {

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
        renderProjectYears: Filters.renderProjectYears,
        renderPlanYearsTopMoney: Filters.renderPlanYearsTopMoney,
        renderPlanYearsMoney: Filters.renderPlanYearsMoney,
        renderPlanYearsSelfMoney: Filters.renderPlanYearsSelfMoney,
        renderBeginTime: Filters.renderBeginTime,
        renderBoolean: Filters.renderBoolean,
        renderPlanYearsMoneyList: Filters.renderPlanYearsMoneyList,
    }
}
