/**
 * 这个文件主要是退库阶段
 *  created by LilyLee on 2019/9/20.
 **/
import Filters from '../common/Filters.js';
import ShowProjectDetail from "../../../components/project/ShowProjectDetail";
import ProjectNew from "../../../components/project/ProjectNew";
import Utils from "../../lib/Utils/Utils";

export default {
    name: "ProjectReturnedView",
    components: {
        "show-project-Detail": ShowProjectDetail,
        "project-new": ProjectNew,
    },
    data() {
        return {
            activeNames:[],
            returned: "returned",
            drawerDetails: false,
            drawerCreate: false,
            showMoreQuery: false,
            direction: 'rtl',
            projectInstitutionList: [],
            levelOneList:[],
            levelOne:"",
            newInstituation:[],
            returnedProject: {
                returnedProjectList: [],
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
        }
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
        self.queryReturnProject();
        self.queryReturnProjectCount();
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
            self.returnedProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.returnedProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.returnedProject.formData.projectInstitution = "";
            self.returnedProject.formData.projectType = "";
            self.returnedProject.formData.projectName = "";
            self.returnedProject.formData.projectYears = "";
            self.returnedProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryReturnProject(true);
            }
        },
        closeDrawer: function (value) {
            this.$refs.drawer.closeDrawer();
        },
        showReturnedProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.activeNames = ['1'];
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
            done();
        },
        //查询退库项目
        queryReturnProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.returnedProject.formData);
            data.page = flag ? 1 : self.returnedProject.currentPage;
            data.step = 0;
            data.ifReturned = 1;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
            }
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
                        self.returnedProject.returnedProjectList = res.data.recordset;
                        self.returnedProject.currentPage = data.page;
                        if (flag) {
                            self.queryReturnProjectCount(data);
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
        //查询退库条数
        queryReturnProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.returnedProject.currentPage;
            data.step = 0;
            data.ifReturned = 1;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
            }
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
            //更新新建表的退库状态为false，更新表的step为1
            var self = this;
            self.drawerCreate = true;
            self.projectDetail = data;
        },
        //关闭表格查询当前页数据
        updateReturnForm:function(){
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryReturnProject(true);
        },
        closeForm: function () {
            var self = this;
            self.$refs.editReturnedProject.closeDrawer();
            //self.showEdit = false;
        },
    },
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry: Filters.renderIndustry,
        renderStatus: Filters.renderStatus,
        renderBeginTime: Filters.renderBeginTime,
        renderStep: Filters.renderStep
    }
}
