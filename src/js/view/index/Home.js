import ShowProjectDetail from "../../../components/project/ShowProjectDetail";
import Filters from "../common/Filters";


export default {
    name: "Home",
    components: {
        "show-project-Detail": ShowProjectDetail,
    },
    data() {
        return {
            userInfoActiveName: "pro-monitor",
            o: 2,
            drawerDetails: false,
            drawerCreate: false,
            showMoreQuery: false,
            direction: 'rtl',
            projectInstitutionList: [],
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
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            projectDetail: {},
            user: {},
            monitor:{
                newProjectCount:0,
                approvalProject:0,
                finishedProjectCount:0,
                returnedProjectCount:0,
            }
        }
    },
    mounted: function () {
        var self = this;
        //$('.main-content').height($(window).height() - 200);
        self.user = JSON.parse(sessionStorage.getItem('user'));
        self.projectInstitutionList = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryAllProject();
        self.queryAllProjectCount();
        self.queryNewProjectCount();
        self.queryFinishedProjectCount();
        self.queryReturnedProjectCount();
    },
    methods: {
        //查询报表,查询所有报表
        queryAllProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.allProject.formData);
            data.page = flag ? 1 : self.allProject.currentPage;
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
        queryAllProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.allProject.currentPage;
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
        showAllProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
        },
        handleClose(done) {
            done();
        },
        //导出
        ExportFinishedProject: function () {
            var self = this;
            var data = _.cloneDeep(self.allProject.formData);
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

            // self.$http.post('/api/export/exportExcel', data).then(res => {
            //     let status = res.status;
            //     let statusText = res.statusText;
            //     if (status !== 200) {
            //         self.$message({
            //             message: statusText,
            //             type: 'error'
            //         });
            //     } else {
            //         if (res.data.length != 0) {
            //             const blob = new Blob([res.data], {
            //
            //                 type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            //
            //             });
            //             var objectURL = URL.createObjectURL(blob);
            //             const aLink = document.createElement('a');
            //             var now = new Date();
            //             aLink.download = '临猗县建设项目库项目汇总表_'+`${now.getFullYear()}${('0'+(now.getMonth()+1)).slice(-2)}${now.getDate()}`;
            //             aLink.href = objectURL;
            //             aLink.click();
            //             URL.revokeObjectURL(blob);
            //         } else {
            //             self.$message({
            //                 message: "查询失败",
            //                 type: 'warning'
            //             });
            //         }
            //     }
            // })
            //     .catch(error =>
            //         self.$message({
            //             message: error.message,
            //             type: 'error'
            //         }),
            //     );
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.allProject.formData.projectInstitution = "";
            self.allProject.formData.projectType = "";
            self.allProject.formData.projectName = "";
            self.allProject.formData.projectYears = "";
            self.allProject.formData.id = "";
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
        //审核通过个数
        queryApprovalProjectCount: function () {

        },
        //完工库
        queryFinishedProjectCount: function () {
            let self = this;
            let data = {};
            data.page = 1;
            data.step = 7;
            data.stepSevenApp = 1;
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
