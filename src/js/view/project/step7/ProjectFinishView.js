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
            activeNames:[],
            showEdit: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            showMoreQuery: false,
            projectInstitutionList: [],
            levelOneList:[],
            levelOne:"",
            newInstituation:[],
            finishedProject: {
                finishedProjectList: [],
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
            options: [],
            changeType: Utils.getChangeType(),
            rules: {
                finishMoney: [
                    {required: true, message: '请输入金额', trigger: 'blur'},
                ],
            },
            user: {},
            editBudgetFinish: {
                finishMoney: ""
            },
            budgetYearsPlanMoneyList: [],
        };
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
        self.queryFinishedProject();
        self.queryFinishedProjectCount();
        //this.queryAppropriateMoney();
    },
    methods: {
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
            self.finishedProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.finishedProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.finishedProject.formData.projectInstitution = "";
            self.finishedProject.formData.projectType = "";
            self.finishedProject.formData.projectName = "";
            self.finishedProject.formData.projectYears = "";
            self.finishedProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryFinishedProject(true);
            }
        },
        //查询完成
        queryFinishedProject: function (flag) {
            let self = this;
            let data =  _.cloneDeep(self.finishedProject.formData);
            data.page = flag ? 1 : self.finishedProject.currentPage;
            data.step = 7;
            data.stepSevenApp = 1;//后台查的not in
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifEdit = 1;
                data.grade = 2;
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
                        self.finishedProject.finishedProjectList = res.data.recordset;
                        self.finishedProject.currentPage = data.page;
                        if (flag) {
                            self.queryFinishedProjectCount(data);
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
        queryFinishedProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.finishedProject.currentPage;
            data.step = 7;
            data.stepSevenApp = 1;
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
            done();
        },
        closeForm: function () {
            var self = this;
            self.$refs.finishProject.closeDrawer();
            self.showEdit = false;
        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.activeNames = ['1','2','3','4','5','6'];
        },
        //录入决算安排
        editBudgetFinishTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = true;

        },
        initCommitMoney: function () {

        },
        //提交决算评审信息
        commitFinishMoneyForm: function () {
            var self = this;
            self.$refs.editBudgetFinish.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editBudgetFinish);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 7;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepSevenApp = 2;//将第二步设置为待审核
                    editBudgetData.ifEdit = 1;
                    //存入数据库
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
                                self.$message({
                                    message: "提交成功",
                                    type: 'success'
                                });
                                //查询当前页数据
                                self.clearProFormData();
                                self.closeForm();
                                self.queryFinishedProject(true);
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
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearProFormData: function () {
            this.editBudgetFinish.finishMoney = "";
        },
        //关闭表格查询当前页数据
        handleAppStep7:function(){
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryFinishedProject(true);
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
