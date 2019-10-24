/**
 * 这个文件主要是展示所有项目信息
 *  created by LilyLee on 2019/9/22.
 **/
import Filters from "../common/Filters";
import Utils from "../../lib/Utils/Utils";

export default {
    name: "ShowProjectDetailView",
    props: ["projectDetail", "step", "activeNames", "showEdit", "grade"],
    data() {
        return {
            loading: false,
            user: {},
            totalMoney: 0,
            appropriateBudget: [],
            appropriateTopBudget: [],
            cutBudget: [],
            addBudget: [],
            totalCut: 0,
            totalAdd: 0,
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
        self.queryIfNewProject();
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
                            self.names = ['7'];
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
        },
        //查询是否有新的
        queryIfNewProject: function () {
            let self = this;
            var data = {};
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
                if (self.cutBudget) {
                    var total1 = 0;
                    for (var x = 0; x < self.cutBudget.length; x++) {
                        total1 = total1 + parseInt(self.cutBudget[x].money);
                    }
                }
                if (self.addBudget) {
                    var total2 = 0;
                    for (var y = 0; y < self.addBudget.length; y++) {
                        total2 = total2 + parseInt(self.addBudget[y].money);
                    }
                }
                self.totalCut = total1;
                self.totalAdd = total2;
                self.totalMoney = parseInt(self.projectDetail.budgetReviewMoney) - total1 + total2;
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
                self.approvalFinish();
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
            if (self.projectDetail.approvalStep <= 3) {
                data.approvalStep = 4;
                data.oldStep = 3;
            }
            data.stepThreeApp = 1;
            data.stepFourApp = 2;
            data.oldSuggestion = 2;
            data.ifEdit = 0;
            data.projectFinance = self.user.role;
            //存入总字段
            var list1 = _.cloneDeep(self.projectDetail.planYearsMoneyList);
            var list2 = _.cloneDeep(self.projectDetail.planYearsTopMoneyList);
            var list = list1.concat(list2);
            var obj = self.mergeArr(list);
            //把所有的审核的status变成1
            for (var i = 0; i < self.projectDetail.planYearsMoneyList.length; i++) {
                self.projectDetail.planYearsMoneyList[i].status = 1;
            }
            for (var i = 0; i < self.projectDetail.planYearsTopMoneyList.length; i++) {
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
                        //关闭当前页，查询当前表格
                        self.$emit('appStep3');
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
                obj[item.years] += parseInt(item.money)
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
            if (self.projectDetail.approvalStep <= 4) {
                data.approvalStep = 5;
                data.oldStep = 4;
            }
            data.stepFourApp = 1;
            data.stepFiveApp = 2;
            data.oldSuggestion = 2;
            data.ifEdit = 0;
            data.projectFinance = self.user.role;
            //存入总字段
            var list1 = _.cloneDeep(self.projectDetail.appropriateBudgetList);
            var list2 = _.cloneDeep(self.projectDetail.appropriateTopBudgetList);
            var list = list1.concat(list2);
            for (var y = 0; y < list.length; y++) {
                list[y].years = list[y].date.substring(0, 4);
            }
            var obj = Utils.mergeArr(list);
            //把所有的审核的status变成1
            for (var i = 0; i < self.projectDetail.appropriateBudgetList.length; i++) {
                self.projectDetail.appropriateBudgetList[i].status = 1;
            }
            for (var j = 0; j < self.projectDetail.appropriateTopBudgetList.length; j++) {
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
            data.nonPaymentTotalMoneyNo = -parseInt(data.approTotalPlanMoneyNo - self.projectDetail.yearsPlanTotalMoneyNo);
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
                        //关闭当前页，查询当前表格
                        self.$emit('appStep4');
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
                data.oldStep = 5;
            }
            data.stepFiveApp = 1;
            data.stepSixApp = 2;
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
            //todo 插入一张log表
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            if (self.projectDetail.speed == 100) {//审核之后工程到百分之百才能进入完工库
                data.approvalStep = 7;
                data.stepSixApp = 1;
                data.stepSevenApp = 2;
                data.oldStep = 6;
                data.oldSuggestion = 2;
            } else {
                data.approvalStep = 6;
                data.stepSixApp = 1;
                //data.stepSevenApp = 2;
                data.oldStep = 6;
                data.oldSuggestion = 2;
            }
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
            //审核通过，把第一步状态改为1，并且把项目step改成6
            //todo 插入一张log表
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            data.approvalStep = 7;
            data.stepSevenApp = 1;
            data.oldStep = 7;
            data.oldSuggestion = 1;//第7步审核通过
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
            data.approvalStep = self.step;
            data.id = self.projectDetail.id;
            data.oldStep = self.step;
            if (self.step == 1) {
                data.oldSuggestion = self.projectDetail.stepOneApp;
                data.stepOneApp = 0;
            } else if (self.step == 2) {
                data.oldSuggestion = self.projectDetail.stepTwoApp;
                data.stepTwoApp = 0;
            } else if (self.step == 3) {
                data.oldSuggestion = self.projectDetail.stepThreeApp;
                data.stepThreeApp = 0;
                //删除未审核的数据
                for (var i = 0; i < self.projectDetail.planYearsMoneyList.length; i++) {
                    if (self.projectDetail.planYearsMoneyList[i].status == 2) {
                        self.projectDetail.planYearsMoneyList.splice(i, 1);
                    }
                }
                for (var i = 0; i < self.projectDetail.planYearsTopMoneyList.length; i++) {
                    if (self.projectDetail.planYearsTopMoneyList[i].status == 2) {
                        self.projectDetail.planYearsTopMoneyList.splice(i, 1);
                    }
                }
                var list1 = _.cloneDeep(self.projectDetail.planYearsMoneyList);
                var list2 = _.cloneDeep(self.projectDetail.planYearsTopMoneyList);
                var list = list1.concat(list2);
                var obj = self.mergeArr(list);
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
            } else if (self.step == 4) {
                data.oldSuggestion = self.projectDetail.stepFourApp;
                data.stepFourApp = 0;
                //删除未审核的数据
                for (var i = 0; i < self.projectDetail.appropriateBudgetList.length; i++) {
                    if (self.projectDetail.appropriateBudgetList[i].status == 2) {
                        self.projectDetail.appropriateBudgetList.splice(i, 1);
                    }
                }
                for (var j = 0; j < self.projectDetail.appropriateTopBudgetList.length; j++) {
                    if (self.projectDetail.appropriateTopBudgetList[j].status == 2) {
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
                //计算合计累计拨付
                data.approTotalPlanMoneyNo = Utils.countTotalPlanMoney(obj);
                //对象
                data.approTotalMoney = JSON.stringify(obj);
                data.nonPaymentTotalMoneyNo = -parseInt(data.approTotalPlanMoneyNo - self.projectDetail.yearsPlanTotalMoneyNo);
            } else if (self.step == 5) {
                data.oldSuggestion = self.projectDetail.stepFiveApp;
                data.stepFiveApp = 0;
            } else if (self.step == 6) {
                data.oldSuggestion = self.projectDetail.stepSixApp;
                data.stepSixApp = 0;
            } else if (self.step == 7) {
                data.oldSuggestion = self.projectDetail.stepSevenApp;
                data.stepSevenApp = 0;
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
                        if (self.step == 1) {
                            self.$emit('unAppStep1');
                        } else if (self.step == 2) {
                            self.$emit('unAppStep2');
                        } else if (self.step == 3) {
                            //更新
                            self.deleteBudgetPlanMoneyList(self.projectDetail);
                            self.$emit('unAppStep3');
                        } else if (self.step == 4) {
                            //删除表里的信息
                            self.deleteAppBudgetMoneyList(self.projectDetail);
                            self.$emit('unAppStep4');
                        } else if (self.step == 5) {
                            self.$emit('unAppStep5');
                        } else if (self.step == 6) {
                            self.$emit('unAppStep6');
                        } else if (self.step == 7) {
                            self.$emit('unAppStep7');
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
