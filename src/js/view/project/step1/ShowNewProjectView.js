/**
 * 这个文件主要是 新建库
 *  created by LilyLee on 2019/9/20.
 **/
import ProjectNew from "../../../../components/project/ProjectNew";
import ShowProjectDetail from "../../../../components/project/ShowProjectDetail";
import Filters from '../../common/Filters.js';
import Utils from '../../../lib/utils/Utils.js';


export default {
    name: "ShowNewProjectView",
    components: {
        "project-new": ProjectNew,
        "show-project-Detail": ShowProjectDetail
    },
    data() {
        return {
            activeNames: [],
            commitType: "",
            objDrawer: this.$refs,
            drawerDetails: false,
            drawerCreate: false,
            showMoreQuery: false,
            direction: 'rtl',
            projectInstitutionList: [],
            newProject: {
                newProjectList: [],
                formData: {
                    projectInstitution: "",
                    projectName: "",
                    projectType: "",
                    projectYears: "",
                    id: "",
                },
                count: 0,
                currentPage: 1,
            },
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            projectDetail: {},
            levelOneList: [],
            levelOne: "",
            newInstituation: [],
            showButton: true,
            user: {
                grade: 0,
                userName: "",
                password: "",
                id: ""
            }


        }
    },
    beforeMount: function () {
        var self = this;
        self.user = JSON.parse(sessionStorage.getItem('user'));
        //var list = JSON.parse(window.sessionStorage.getItem('institution'));
        self.queryInstitution(function (list) {
            if (self.user.grade == 1) {
                self.projectInstitutionList = list;
                console.log(list);
            } else {
                self.levelOneList = Utils.initLevelOne(list);
                self.projectInstitutionList = Utils.initLevelTwo(self.levelOneList, list);
            }
        })
    },
    activated: function() {
        var self = this;
        //$('.main-content').height($(window).height() - 200);
        self.queryNewProject();
        self.queryNewProjectCount();
    },
    mounted: function () {
        //var self = this;
        //$('.main-content').height($(window).height() - 200);
        // self.queryNewProject();
        // self.queryNewProjectCount();

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
            self.newProject.formData.projectInstitution = self.newInstituation[0].name;
        },
        //选择二级
        selectLevelTwoChange(value) {
            this.newProject.formData.projectInstitution = value;
        },
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.newProject.formData.projectInstitution = "";
            self.newProject.formData.projectType = "";
            self.newProject.formData.projectName = "";
            self.newProject.formData.projectYears = "";
            self.newProject.formData.id = "";
            self.levelOne = "";
            if (flag) {
                self.queryNewProject(true);
            }
        },
        closeDrawer: function (value) {
            var self = this;
            self.$refs.drawerNew.close();
        },

        /**
         * 日期转换方法
         * @param dateVal
         * @param timeKey
         * @version 2.0
         * @author yebo
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
        //新建项目
        createNewProject: function () {
            let self = this;
            self.drawerCreate = true;
            self.commitType = 'new';

        },
        handleClose(done) {
            done();
        },
        commitProjectAgain: function (e, data) {
            let self = this;
            self.drawerCreate = true;
            self.projectDetail = data;
            self.commitType = "recommit";
        },
        //查询新建项目
        queryNewProject: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.newProject.formData);
            data.page = flag ? 1 : self.newProject.currentPage;
            data.step = 1;
            data.stepOneApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
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
                        self.newProject.newProjectList = res.data.recordset;
                        self.newProject.currentPage = data.page;
                        self.commitType = "";
                        if (flag) {
                            self.queryNewProjectCount(data);
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
        //查询新建项目条数
        queryNewProjectCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.newProject.currentPage;
            data.step = 1;
            data.stepOneApp = 1;
            data.ifReturned = 0;
            if (self.user.grade == 1) {//如果是1，那么只查自己提交的
                data.commitName = self.user.role;
            } else if (self.user.grade == 2) {//如果是2，那么查询提交上来只查自己部门审批的
                data.projectFinance = self.user.role;
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
                        self.newProject.count = res.data.recordset[0].num;
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
        returnProjectDoing: function (project) {
            let self = this;
            let data = {};
            data.id = project.id;
            data.approvalStep = 0;
            data.ifReturned = 1;
            data.projectFinance = project.projectFinance;
            self.$http.post('/api/project/returnProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        //横线那里改成退库中
                        self.$message({
                            message: "申请退库成功",
                            type: 'success'
                        });
                        //查询当前页数据
                        self.queryNewProject(true);
                    } else {
                        self.$message({
                            message: "申请退库失败",
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
        returnProject: function (e,project) {
            let self = this;
            self.$confirm('此操作将退库, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {};
                data.id = project.id;
                self.$http.post('/api/project/queryOneProject', data).then(res => {
                    let status = res.status;
                    let statusText = res.statusText;
                    if (status !== 200) {
                        self.$message({
                            message: statusText,
                            type: 'error'
                        });
                    } else {
                        if (res.data.length != 0) {
                            if (res.data && res.data.recordset.length > 0 && res.data.recordset[0]) {
                                if (res.data.recordset[0].stepOneApp != 1) {
                                    self.returnProjectDoing(project);
                                }else{
                                    self.$message({
                                        message: "删除失败,该项目已通过审核",
                                        type: 'warning'
                                    });
                                }

                            } else {
                                self.$message({
                                    message: "不存在此项目",
                                    type: 'warning'
                                });
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
            }).catch(() => {

            });

        },
        //删除项目
        deleteProject: function (e, project) {
            let self = this;
            self.$confirm('确定删除该项目吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {};
                data.id = project.id;
                data.projectFinance = project.projectFinance;
                //查询stepOneApp是否审核，若已经审核不可以删除
                self.$http.post('/api/project/queryOneProject', data).then(res => {
                    let status = res.status;
                    let statusText = res.statusText;
                    if (status !== 200) {
                        self.$message({
                            message: statusText,
                            type: 'error'
                        });
                    } else {
                        if (res.data.length != 0) {
                            if (res.data && res.data.recordset.length > 0 && res.data.recordset[0]) {
                                if (res.data.recordset[0].stepOneApp != 1) {
                                    self.$http.post('/api/project/deleteProject', data).then(res => {
                                        let status = res.status;
                                        let statusText = res.statusText;
                                        if (status !== 200) {
                                            self.$message({
                                                message: statusText,
                                                type: 'error'
                                            });
                                        } else {
                                            if (res.data.length != 0) {
                                                //横线那里改成退库中
                                                self.$message({
                                                    message: "删除成功",
                                                    type: 'success'
                                                });
                                                //查询当前页数据
                                                self.queryNewProject(true);
                                            } else {
                                                self.$message({
                                                    message: "删除失败",
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
                                }else{
                                    self.$message({
                                        message: "删除失败,该项目已通过审核",
                                        type: 'warning'
                                    });
                                }
                            } else {
                                self.$message({
                                    message: "不存在此项目",
                                    type: 'warning'
                                });
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
            })
        },
        //显示新建库详情
        showNewProjectDetails: function (e, data) {
            let self = this;
            self.drawerDetails = true;
            self.projectDetail = data;
            self.activeNames = ['1'];
        }
        ,
        //关闭表格查询当前页数据
        handleAppStep1: function () {
            var self = this;
            self.closeForm();
            //查询当前页数据
            self.queryNewProject(true);
        }
        ,
        closeForm: function () {
            var self = this;
            self.$refs.editProjectNew.closeDrawer();
            //self.showEdit = false;
        }
        ,
    }
    ,
    filters: {
        renderMoneyFrom: Filters.renderMoneyFrom,
        renderIndustry:
        Filters.renderIndustry,
        renderStatus:
        Filters.renderStatus,
        renderStep:
        Filters.renderStep,
        renderBeginTime:
        Filters.renderBeginTime,
        renderProjectYears:
        Filters.renderProjectYears

    }
}
