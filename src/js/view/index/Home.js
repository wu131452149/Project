import BottomNav from "../../../components/layout/BottomNav.vue"
import SIdentify from '../../../components/login/Captcha.vue'
import ShowProjectDetail from "../../../components/project/ShowProjectDetail";

export default {
    data() {
        return {
            name:"Home",
            components: {
                "show-project-Detail": ShowProjectDetail,
            },
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
        //查询预算变更
        queryAllProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.allProject.currentPage;
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

        showProjectWareHousing:function () {

        },
        showProjectDeposit:function () {

        },
        queryUnreadKnowledgeItem:function () {

        },
        //todo 查询四个表的数据全部统计出来，显示在页面

    }
}
