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
            ifNewPro:{}
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
        }
    },
    methods: {
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
            //var url = `${process.env.BASE_API}/table/downloadFile?filename=${data.name}&oldname=${data.oname}`;
            // if (frameObj) {
            //     frameObj.src = url;
            //     frameObj.onload = function () {
            //         frameObj.src = "";
            //     };
            // }
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
            data.approvalStep = 4;
            data.stepThreeApp = 1;
            data.stepFourApp = 2;
            data.oldStep = 3;
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
        //4拨付审核
        approvalAppMoney: function () {
            //审核通过，把第一步状态改为1，并且把项目step改成5
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            data.approvalStep = 5;
            data.stepFourApp = 1;
            data.stepFiveApp = 2;
            data.oldStep = 4;
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
            //todo 插入一张log表
            let self = this;
            let data = {};
            data.id = self.projectDetail.id;
            data.approvalStep = 6;
            data.stepFiveApp = 1;
            data.stepSixApp = 2;
            data.oldStep = 5;
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
            } else if (self.step == 4) {
                data.oldSuggestion = self.projectDetail.stepFourApp;
                data.stepFourApp = 0;
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
                        //todo 重新查询一下表格
                        if (self.step == 1) {
                            self.$emit('unAppStep1');
                        } else if (self.step == 2) {
                            self.$emit('unAppStep2');
                        } else if (self.step == 3) {
                            self.$emit('unAppStep3');
                        } else if (self.step == 4) {
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

    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderProjectYears: Filters.renderProjectYears,
        renderPlanYearsTopMoney: Filters.renderPlanYearsTopMoney,
        renderPlanYearsMoney: Filters.renderPlanYearsMoney,
        renderPlanYearsSelfMoney: Filters.renderPlanYearsSelfMoney,
        renderBeginTime: Filters.renderBeginTime,
        renderBoolean: Filters.renderBoolean
    }
}
