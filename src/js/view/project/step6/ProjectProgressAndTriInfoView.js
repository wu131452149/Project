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
            showEdit:false,
            showTri:false,
            showPro:false,
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
            TriInfo:{
                agreementName:"",
                agreementMoney:"",
                agreementUserName:"",
                agreementUserPhone:"",
                agreementBank:"",
                agreementCardNo:""
            },
            options: [],
            changeType: Utils.getChangeType(),
            rules: {
                speed: [
                    {required: true, message: '请输入进度', trigger: 'blur'},
                ],
                agreementName: [
                    {required: true, message: '请输入合同名称', trigger: 'blur'},
                ],
            },
            user: {},
            budgetYearsPlanMoneyList: [],
            projectInstitutionList:[],
        };
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        self.projectInstitutionList = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryProAndTriProject();
        self.queryProAndTriProjectCount();
    },
    methods: {
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.proAndTriProject.formData.projectInstitution = "";
            self.proAndTriProject.formData.projectType = "";
            self.proAndTriProject.formData.projectName = "";
            self.proAndTriProject.formData.projectYears = "";
            self.proAndTriProject.formData.id = "";
            if (flag) {
                self.queryProAndTriProject(true);
            }
        },
        //查询预算变更
        queryProAndTriProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.proAndTriProject.currentPage;
            data.step = 6;
            data.stepSixApp = 1;//后台查的not in
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
                        self.proAndTriProject.proAndTriProjectList = res.data.recordset;
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
        queryProAndTriProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.proAndTriProject.currentPage;
            data.step = 6;
            data.stepSixApp = 1;
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
            //self.editOptionYears(data.projectYears);
        },
        editTriTab:function(e, data){
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
        },
        initCommitMoney:function(){

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
                    if(editBudgetData.speed == 100 && self.projectDetail.stepSixApp==1){
                        editBudgetData.step = 7;//审核通过并且工程进度为100%进入完工库，第7步设置为待审核，
                        data.stepSevenApp = 2;
                        //editBudgetData.suggestion = 1;//第6步已经通过审核
                    }
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
        commitTri: function () {
            var self = this;
            self.$refs.TriInfo.validate((valid) => {
                if (valid) {
                    let editBudgetData = _.cloneDeep(self.TriInfo);
                    //根据id来改变
                    editBudgetData.id = self.projectDetail.id;
                    editBudgetData.step = 6;//新建的并且已经通过审核了的才能提交预算
                    editBudgetData.suggestion = 1;//第一步已经通过审核
                    editBudgetData.stepSixApp = 2;//将第二步设置为待审核
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
            this.editPro.speed = "";
        },
        clearTriFormData: function () {
            this.TriInfo.agreementName = "";
            this.TriInfo.agreementMoney = "";
            this.TriInfo.agreementUserName = "";
            this.TriInfo.agreementUserPhone = "";
            this.TriInfo.agreementBank = "";
            this.TriInfo.agreementCardNo = "";
        },
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep,
        renderProjectYears: Filters.renderProjectYears

    }
}
