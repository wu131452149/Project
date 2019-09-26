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
        return {
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            showMoreQuery: false,
            projectInstitutionList: [],
            finishedProject: {
                finishedProjectList: [],
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
            options: [],
            changeType: Utils.getChangeType(),
            rules: {
                money: [
                    {required: true, message: '请输入金额', trigger: 'blur'},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
        };
    },
    mounted: function () {
        var self = this;
        self.queryFinishedProject();
        self.queryFinishedProjectCount();
        //this.queryAppropriateMoney();
        self.user = JSON.parse(sessionStorage.getItem('user'));

    },
    methods: {
        //查询预算变更
        queryFinishedProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.finishedProject.currentPage;
            data.step = 7;
            data.stepFiveApp = 1;//后台查的not in
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
                        self.finishedProject.finishedProjectList = res.data.recordset;
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
        queryFinishedProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.finishedProject.currentPage;
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
        handleSelectionChange: function () {

        },
        //录入预算拨付
        editBudgetChangeTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            //self.editOptionYears(data.projectYears);
        },
        closeForm: function () {

        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
        },
        initCommitMoney: function () {

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
        }
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderProjectYears: Filters.renderProjectYears

    }
}
