/**
 * 这个文件主要是退库阶段
 *  created by LilyLee on 2019/9/20.
 **/
import Filters from '../common/Filters.js';
import ShowProjectDetail from "../../../components/project/ShowProjectDetail";
import ProjectNew from "../../../components/project/ProjectNew";

export default {
    name: "ProjectReturnedView",
    components: {
        "show-project-Detail": ShowProjectDetail,
        "project-new": ProjectNew,
    },
    data() {
        return {
            returned:"returned",
            drawerDetails: false,
            drawerCreate: false,
            showMoreQuery: false,
            direction: 'rtl',
            projectInstitutionList: [],
            returnedProject: {
                returnedProjectList: [],
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
        self.queryReturnProject();
        self.queryReturnProjectCount();
        self.user = JSON.parse(sessionStorage.getItem('user'));

    },
    methods: {
        closeDrawer: function (value) {
            this.$refs.drawer.closeDrawer();
        },
        showReturnedProjectDetails: function (e,data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
        },

        /**
         * 日期转换方法
         */
        dateChange: function (dateVal, timeKey) {
            var self = this;
            self.newProject.formData[timeKey] = dateVal;
        },
        /**
         * @version 2.0
         * @author wenxy
         * @method 取消快捷查询选中状态
         */
        changeQuickQuery: function (data) {
            var self = this;
            // if (self.allHistory.cloneFormData[data] && self.allHistory.cloneFormData[data] != self.allHistory.formData[data]) {
            //     self.quickQueryData.curTagName = "";
            // }
        },
        /**
         * 阻止默认事件
         * @param event
         */
        stopPropagationPreventDef: function (event) {
            event.stopPropagation();
            event.preventDefault();
            return;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        //查询退库项目
        queryReturnProject: function (flag) {
            let self = this;
            let data = {};
            data.page = flag ? 1 : self.returnedProject.currentPage;
            data.step = 0;
            data.ifReturned = 1;
            self.$http.post('/api/project/queryReturnProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        this.returnedProject.returnedProjectList = res.data.recordset;
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
        //查询退库条数
        queryReturnProjectCount: function () {
            let self = this;
            let data = {};
            data.page = self.returnedProject.currentPage;
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
                        self.returnedProject.count = res.data.recordset[0].num;
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
        //重新入库，要先显示编辑页面，再提交
        updateNewProject: function (e, data) {
            //todo 更新新建表的退库状态为false，更新表的step为1
            var self = this;
            self.drawerCreate = true;
            self.projectDetail = data;

        },
        handleCreateClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        showDefaultQuickQuery: function () {

        },
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderStep: Filters.renderStep
    }
}
