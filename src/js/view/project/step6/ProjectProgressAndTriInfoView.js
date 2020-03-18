/**
 * 这个文件主要是工程进度和三方信息
 *  created by LilyLee on 2019/9/20.
 **/
import Filters from "../../common/Filters";
import Utils from "../../../lib/Utils/Utils";
import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";

export default {
    name: "ProjectProgressAndTriInfoView",
    components: {
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        return {
            activeNames: [],
            showEdit: false,
            showTri: false,
            showPro: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            proAndTriProject: {
                proAndTriProjectList: [],
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
            editPro: {
                speed: "",
            },
            TriInfo: {
                triName: "",
                triMoney: "",
                triUserName: "",
                triPhone: "",
                triBank: "",
                triCardNo: ""
            },
            options: [],
            levelOneList: [],
            levelOne: "",
            newInstituation: [],
            changeType: Utils.getChangeType(),
            rules1: {
                speed: [
                    {required: true, message: '请输入进度', trigger: 'blur'},
                ],
            },
            rules2: {
                agreementName: [
                    {required: true, message: '请输入合同名称', trigger: 'blur'},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
            projectInstitutionList: [],
            showButton: true,
        };
    },
    activated: function() {
        var self = this;
        self.queryProAndTriProject();
        self.queryProAndTriProjectCount();
    },
    mounted: function () {
        var self = this;
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
        self.queryProAndTriProject();
        self.queryProAndTriProjectCount();
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
            self.proAndTriProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.proAndTriProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.proAndTriProject.formData.projectInstitution = "";
            self.proAndTriProject.formData.projectType = "";
            self.proAndTriProject.formData.projectName = "";
            self.proAndTriProject.formData.projectYears = "";
            self.proAndTriProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryProAndTriProject(true);
            }
        },
        //查询预算变更
        queryProAndTriProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.proAndTriProject.formData);
            data.page = flag ? 1 : self.proAndTriProject.currentPage;
            data.step = 6;
            data.stepSixApp = 1;//后台查的not in
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifSixEdit = 1;
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
                        self.proAndTriProject.proAndTriProjectList = res.data.recordset;
                        self.proAndTriProject.currentPage = data.page;
                        if (flag) {
                            self.queryProAndTriProjectCount(data);
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
        //查询条数
        queryProAndTriProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.proAndTriProject.currentPage;
            data.step = 6;
            data.stepSixApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifSixEdit = 1;
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
                        self.proAndTriProject.count = res.data.recordset[0].num;
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
        //录入预算拨付
        editProgressTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showPro = true;
            self.showTri = false;
            self.showEdit = true;
        },
        editTriTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showPro = false;
            self.showTri = true;
            self.showEdit = true;
        },
        closeForm: function () {
            var self = this;
            self.$refs.proAndTri.closeDrawer();
            self.showEdit = false;
        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.activeNames = ['1', '2', '3', '4', '5', '6'];
        },
        initCommitMoney: function () {

        },
        //提交进度
        commitProgress: function () {
            var self = this;
            self.$refs.editPro.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.editPro);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    //存入数据库
                    editBudgetData.speed = self.editPro.speed;//更新工程进度
                    if (editBudgetData.speed == 100 && self.projectDetail.stepSixApp == 1) {
                        editBudgetData.approvalStep = 7;//审核通过并且工程进度为100%进入完工库，第7步设置为待审核，
                        editBudgetData.stepSevenApp = 2;
                        editBudgetData.step = 7;
                        editBudgetData.oldStep = 6;//审核通过并且工程进度为100%进入完工库，第7步设置为待审核，
                        //editBudgetData.suggestion = 1;//第6步已经通过审核
                    }
                    editBudgetData.trueStep = 6;
                    editBudgetData.editSpeed = true;
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
                                //关闭当前页，并清空表格数据
                                self.clearProFormData();
                                self.closeForm();
                                //查询当前页数据
                                self.queryProAndTriProject(true);
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
        //提交第三方
        commitTri: function () {
            var self = this;
            self.$refs.TriInfo.validate((valid) => {
                if (valid) {
                    let editBudgetData = {};
                    self.TriInfo.status = 2;//合同信息待审核
                    var triInfo = _.cloneDeep(self.TriInfo);
                    var triList = [];
                    //如果是第一次提交合同
                    if (!self.projectDetail.triInfo) {
                        triList.push(triInfo);
                        //第一次录入第6步
                        editBudgetData.isFirstSixEdit = true;
                    } else {
                        //之前有提交过
                        triList = JSON.parse(self.projectDetail.triInfo);
                        triList.push(triInfo);
                        editBudgetData.isFirstSixEdit = true;
                    }
                    editBudgetData.triInfo = JSON.stringify(triList);//转换一下数据
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 6;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepSixApp = 2;//将第二步设置为待审核
                    editBudgetData.ifSixEdit = 1;
                    //保存原来的审核结果，传入后端，红点要不要+1,因为审核的时候是一起审核的，所以只要+1次即可
                    editBudgetData.originalStepSixApp = self.projectDetail.stepSixApp;
                    editBudgetData.projectFinance = self.projectDetail.projectFinance;//传入后台取newproject表里面+1
                    //换成字符串存入triInfo里面
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
                                self.clearTriFormData();
                                self.closeForm();
                                //查询当前页数据
                                self.queryProAndTriProject(true);
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
        clearProFormData: function () {
            var self = this;
            this.editPro.speed = "";
        },
        clearTriFormData: function () {
            var self = this;
            self.TriInfo.triName = "";
            self.TriInfo.triMoney = "";
            self.TriInfo.triUserName = "";
            self.TriInfo.triPhone = "";
            self.TriInfo.triBank = "";
            self.TriInfo.triCardNo = "";
        },
        //关闭表格查询当前页数据
        handleAppStep6: function () {
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryProAndTriProject(true);
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
