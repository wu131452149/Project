/**
 * 这个文件主要是预算变更
 *  created by LilyLee on 2019/9/20.
 **/
import Filters from "../../common/Filters";
import Utils from "../../../lib/Utils/Utils";
import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";

export default {
    name: "BudgetChangeView",
    components: {
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        return {
            showEdit: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            budgetChangeProject: {
                budgetChangeProjectList: [],
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
            editBudgetChange: {
                type: "",
                money: "",
                approvalChangeNo: ""
            },
            options: [],
            changeType: Utils.getChangeType(),
            rules: {
                money: [
                    {required: true, message: '请输入金额', trigger: 'blur'},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
            projectInstitutionList:[]
        };
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        self.projectInstitutionList = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryBudgetChangeProject();
        self.queryBudgetChangeProjectCount();
        self.queryAppropriateMoney();
    },
    methods: {
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.budgetChangeProject.formData.projectInstitution = "";
            self.budgetChangeProject.formData.projectType = "";
            self.budgetChangeProject.formData.projectName = "";
            self.budgetChangeProject.formData.projectYears = "";
            self.budgetChangeProject.formData.id = "";
            if (flag) {
                self.queryBudgetChangeProject(true);
            }
        },
        //查询预算变更
        queryBudgetChangeProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.budgetChangeProject.currentPage;
            data.step = 5;
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
                        self.budgetChangeProject.budgetChangeProjectList = res.data.recordset;
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
        queryBudgetChangeProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.budgetChangeProject.currentPage;
            data.step = 5;
            data.stepFiveApp = 1;
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
                        self.budgetChangeProject.count = res.data.recordset[0].num;
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
        //录入预算拨付
        editBudgetChangeTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = true;
            //self.editOptionYears(data.projectYears);
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
        commitBudgetChangeForm: function () {
            var self = this;
            self.$refs.editBudgetChange.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editBudgetChange);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 5;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepFiveApp = 2;//将第二步设置为待审核
                    if (editBudgetData.type == "增加") {
                        //editBudgetData.addBudget = editBudgetData.money;
                        var obj = self.initObj(self.projectDetail.addBudget, editBudgetData);
                        var newObj = JSON.stringify(obj);
                        self.projectDetail.addBudget = newObj;
                        editBudgetData.addBudget = newObj;
                    } else {
                        //editBudgetData.cutBudget = editBudgetData.money;
                        var obj = self.initObj(self.projectDetail.cutBudget, editBudgetData);
                        var newObj = JSON.stringify(obj);
                        self.projectDetail.cutBudget = newObj;
                        editBudgetData.cutBudget = newObj;
                    }
                    delete editBudgetData.money;
                    delete editBudgetData.type;
                    delete editBudgetData.approvalChangeNo;
                    //存入数据库
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
                                //关闭当前页，并清空表格数据
                                //存入评审文号数据表
                                self.saveAPPNo();
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        initObj: function (oldObj, editBudgetData) {
            var returnObj;
            var date = Utils.format(new Date());
            if (oldObj) {
                returnObj = JSON.parse(oldObj);
                //因为要更改评审号，所以都是不同的
                // var index = _.findIndex(returnObj, { 'date': date, 'type': editBudgetData.type });
                // if (index > -1) {
                //     returnObj[index].money = parseInt(returnObj[index].money) + parseInt(editBudgetData.money);
                // } else {
                var newObj = {date: date, money: editBudgetData.money, type: editBudgetData.type,No:editBudgetData.approvalChangeNo};
                returnObj.push(newObj);
                //}
            } else {
                returnObj = [{date: date, money: editBudgetData.money, type: editBudgetData.type,No:editBudgetData.approvalChangeNo}];
            }
            return returnObj;
        },
        clearFormData: function () {
            this.budgetChangeProject.approvalChangeNo = "";
            this.budgetChangeProject.type = "";
            this.budgetChangeProject.money = "";
        },
        saveAPPNo: function () {
            var self = this;
            var editAppMoneyData = {
                type: self.editBudgetChange.type,
                money: self.editBudgetChange.money,
                projectId: self.projectDetail.id,
                userName: self.user.role,
                proChangeNo: self.editBudgetChange.approvalChangeNo,
                createTime: Utils.formatDate(new Date()) + ".000"
            };
            self.$http.post('/api/project/addAppNo', editAppMoneyData).then(res => {
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

