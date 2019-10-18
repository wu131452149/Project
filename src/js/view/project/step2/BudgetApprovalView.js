/**
 * 这个文件主要是预算审批
 *  created by LilyLee on 2019/9/20.
 **/
import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";
import Filters from "../../common/Filters";
import Utils from "../../../lib/Utils/Utils";

export default {
    name: "BudgetApprovalView",
    components: {
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        return {
            activeNames: [],
            showEdit: false,
            drawerDetails: false,
            drawerCreate: false,
            direction: 'rtl',
            table: false,
            dialog: false,
            loading: false,
            budgetPlanProject: {
                budgetPlanProjectList: [],
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
            editBudgetPlan: {
                gvApproval: "是",//政府批示
                budgetReviewMoney: "",
                approvalNumber: "",
                stateOwnedRegistration: "是",
                gvBuy: "是",
                fileList: []
            },
            fileList: [],
            booleanData: [{name: "是", value: 1}, {name: "否", value: 0}],
            rules: {
                budgetReviewMoney: [
                    {required: true, message: '请输入预算评审金额', trigger: 'blur'},
                ],
                approvalNumber: [
                    {required: true, message: '请输入评审文号', trigger: 'blur'},
                ],
            },
            user: {},
            projectInstitutionList: [],
            uploadData: {},
            levelOneList: [],
            levelOne: "",
            newInstituation: [],

        }
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
        self.queryBudgetPlanProject();
        self.queryBudgetPlanProjectCount();
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
            self.budgetPlanProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.budgetPlanProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.budgetPlanProject.formData.projectInstitution = "";
            self.budgetPlanProject.formData.projectType = "";
            self.budgetPlanProject.formData.projectName = "";
            self.budgetPlanProject.formData.projectYears = "";
            self.budgetPlanProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryBudgetPlanProject(true);
            }
        },
        //查询在建项目预算评审
        queryBudgetPlanProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.budgetPlanProject.formData);
            data.page = flag ? 1 : self.budgetPlanProject.currentPage;
            data.step = 2;
            data.stepTwoApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
                data.ifEdit = 1;
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
                        self.budgetPlanProject.budgetPlanProjectList = res.data.recordset;
                        self.budgetPlanProject.currentPage = data.page;
                        if (flag) {
                            self.queryBudgetPlanProjectCount(data);
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
        queryBudgetPlanProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.budgetPlanProject.currentPage;
            data.step = 2;
            data.stepTwoApp = 1;
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
                        self.budgetPlanProject.count = res.data.recordset[0].num;
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
        //录入预算安排
        editBudgetPlanTab: function (e, data) {
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = true;
        },
        closeForm: function () {
            var self = this;
            self.$refs.drawerBudget.closeDrawer();
            self.showEdit = false;
        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.showEdit = false;
            self.activeNames = ['1', '2'];
        },
        //提交预算填写
        commitBudgetPlanForm: function () {
            var self = this;
            self.$refs.editBudgetPlan.validate((valid) => {
                if (valid) {
                    let editBudgetData = self.editBudgetPlan;
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 2;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepTwoApp = 2;//将第二步设置为待审核
                    editBudgetData.ifEdit = 1;
                    if (editBudgetData.gvApproval == "是") {
                        editBudgetData.gvApproval = 1;
                    } else {
                        editBudgetData.gvApproval = 0;
                    }
                    if (editBudgetData.gvBuy == "是") {
                        editBudgetData.gvBuy = 1;
                    } else {
                        editBudgetData.gvBuy = 0;
                    }
                    if (editBudgetData.stateOwnedRegistration == "是") {
                        editBudgetData.stateOwnedRegistration = 1;
                    } else {
                        editBudgetData.stateOwnedRegistration = 0;
                    }
                    //封装fileList
                    editBudgetData.fileList = [];
                    for (var i = 0; i < self.fileList.length; i++) {
                        //var id = new Date().getTime();//如果是新增都是在2.0上，所以一定会有一个key值，key值主要用来去删除用，编辑的时候就不一定了。
                        var file = {};
                        file.path = self.fileList[i].response.file.path;
                        file.name = self.fileList[i].response.file.newfilename;
                        file.oname = self.fileList[i].response.file.originalname;
                        //file.oldFileKey = self.fileList[i].response.fileKey;
                        editBudgetData.fileList.push(file);
                    }
                    editBudgetData.fileList = JSON.stringify(editBudgetData.fileList);
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
                                self.clearFormData();
                                self.closeForm();
                                //查询当前页数据
                                self.queryBudgetPlanProject(true);
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
        clearFormData: function () {
            this.editBudgetPlan.gvApproval = "是";
            this.editBudgetPlan.budgetReviewMoney = "";
            this.editBudgetPlan.stateOwnedRegistration = "是";
            this.editBudgetPlan.approvalNumber = "";
            this.editBudgetPlan.gvBuy = "是";
        },
        //关闭表格查询当前页数据
        handleAppStep2: function () {
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryBudgetPlanProject(true);
        },
        /**
         * 上传附件
         * @param file 当前行数据
         * @version 2.0
         * @author 李莉红
         */
        beforeUploadFile: function (file) {
            var self = this;
            self.showFile = false;
            if (file.size == 0) {
                self.$message.warning('请不要上传空文件');
                return false;
            }
            var fSize = file.size;
            if (fSize > 10485760) {
                self.$message.warning('上传文件超过了最大大小10M!');
                return false;
            }
            self.uploadData.fileName = file.name;
            self.uploadData.upload = file;
            return true;
        },
        beforeRemove: function () {

        },
        /**
         * 上传成功
         * @param response 返回的数据
         * @version 2.0
         * @author 李莉红
         */
        uploadFileSuccess: function (response, file, fileList) {
            var self = this;
            self.showFile = true;
            self.robotImage = [];
            var filePath = response.file.path;
            var fileName = response.file.newfilename;
            self.fileList = fileList;
        },
        /**
         * 机器人头像上传失败的回调
         * @param src 当前行数据
         * @version 2.0
         * @author 李莉红
         */
        uploadImageError: function () {
            var self = this;
            self.$message({type: "warning", message: "上传失败请重试！"});
        },
        handleRemove: function () {

        }
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

