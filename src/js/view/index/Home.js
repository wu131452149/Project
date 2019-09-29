import ShowProjectDetail from "../../../components/project/ShowProjectDetail";
import Filters from "../common/Filters";



export default {
    name:"Home",
    components: {
        "show-project-Detail": ShowProjectDetail,
    },
    data() {
        return {
            userInfoActiveName: "pro-monitor",
            o:2,
            drawerDetails: false,
            drawerCreate: false,
            showMoreQuery: false,
            direction: 'rtl',
            projectInstitutionList: [],
            allProject: {
                allProjectList: [],
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
            projectDetail: {},
            user:{},
        }
    },
    mounted: function () {
        var self = this;
        //$('.main-content').height($(window).height() - 200);
        self.user = JSON.parse(sessionStorage.getItem('user'));
        self.queryAllProject();
        self.queryAllProjectCount();
    },
    methods: {
        //查询报表,查询所有报表
        queryAllProject: function (flag) {
            let self = this;
            let data = {};
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
            data.userName = self.user.userName;
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
        queryAllProjectCount: function () {
            let self = this;
            let data = {};
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
        showAllProjectDetails: function (e,data) {
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
            //todo 查询条件
            var data = {};
            self.$http.get('/api/export/exportExcel', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //self.finishedProject.count = res.data.recordset[0].num;
                        //window.location = '/api/export/exportExcel';
                        //Utils.downloadUrl(res.data.recordset);
                        // let type = 'application/octet-stream';
                        // // let type = result.type
                        // // const buf = Buffer.from(result, 'binary')
                        // let blob = new Blob([res.data], {type: type});
                        // let fileName = res.headers.filename || "fileName.xlsx";
                        // if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        //     /*
                        //      * IE workaround for "HTML7007: One or more blob URLs were revoked by closing
                        //      * the blob for which they were created. These URLs will no longer resolve as
                        //      * the data backing the URL has been freed."
                        //      */
                        //     window.navigator.msSaveBlob(blob, fileName);
                        // } else {
                        //     let URL = window.URL || window.webkitURL
                        //     let objectUrl = URL.createObjectURL(blob)
                        //     console.log(objectUrl);
                        //     if (fileName) {
                        //         var a = document.createElement('a')
                        //         // safari doesn't support this yet
                        //         if (typeof a.download === 'undefined') {
                        //             window.location = objectUrl
                        //         } else {
                        //             a.href = objectUrl
                        //             a.download = fileName
                        //             document.body.appendChild(a)
                        //             a.click()
                        //             a.remove();
                        //            // message.success(`${fileName} 已下载`);
                        //         }
                        //     } else {
                        //         window.location = objectUrl
                        //     }
                        // }
                        // let blob = new Blob([res.data], {type: type});
                        let fileName = res.headers.filename || "fileName.xlsx";
                        var blob = new Blob([res.data], {type: "application/octet-stream"});
                        if ('msSaveOrOpenBlob' in navigator) {

                            // Microsoft Edge and Microsoft Internet Explorer 10-11
                            window.navigator.msSaveOrOpenBlob(blob, fileName);
                        } else {
                            var a = document.getElementById("exportCSVlink");
                            a.download = fileName;
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

        showProjectWareHousing:function () {

        },
        showProjectDeposit:function () {

        },
        queryUnreadKnowledgeItem:function () {

        },
        //todo 查询四个表的数据全部统计出来，显示在页面

    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderProjectYears: Filters.renderProjectYears,
        renderThisYearPlanTotalMoney:Filters.renderThisYearPlanTotalMoney,
        renderNextYearsPlanTotalMoney:Filters.renderNextYearsPlanTotalMoney,
        renderThirdYearsPlanTotalMoney:Filters.renderThirdYearsPlanTotalMoney,
        renderBeforeYearPlanTotalMoney:Filters.renderBeforeYearPlanTotalMoney,
        renderAppThisYearMoney:Filters.renderAppThisYearMoney,
        renderAppTotalMoney:Filters.renderAppTotalMoney,
        renderPlanTotalMoney:Filters.renderPlanTotalMoney,
        renderNonPaymentTotalMoney:Filters.renderNonPaymentTotalMoney

    }
}
