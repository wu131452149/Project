/**
 * 这个文件主要是用户管理
 *  created by LilyLee on 2019/10/12.
 **/
import Utils from "../../lib/utils/Utils";
import Filters from "../common/Filters";

export default {
    name: "UserManageView",
    data() {
        return {
            table: false,
            dialog: false,
            loading: false,
            drawerDetails:false,
            direction: 'rtl',
            showCountNumber: true,
            IsNewMediaSessionLargeData: '',
            users: {
                userList: [],
                formData: {
                    id:"",
                    userName: "",
                    role:"",
                    grade:"",
                },
                count: 0,
                currentPage: 1
            },
            createUser:{
                userName:"",
                grade:"",
                password:"",
                role:"",
            },
            rules: {
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                grade: [
                    {required: true, message: '请选择级别', trigger: 'change'},
                ],
                password: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'},
                ],
                role: [
                    {required: true, message: '请输入项目名称', trigger: 'blur'},
                ],
            },
            user:{},
            formLabelWidth: '80px'
        };
    },
    mounted: function () {
        var self = this;
        self.user = JSON.parse(window.sessionStorage.getItem('user'));
        self.queryUsers();
        self.queryUsersCount();
    },
    methods: {
        showCreateUsers:function(){
            var self = this;
            //显示项目详情，并且显示预算信息
            self.drawerDetails = true;
        },
        handleClose(done) {
            done();
        },
        closeForm: function () {
            var self = this;
            self.$refs.updateUser.closeDrawer();
        },
        /*新建用户*/
        createUsers: function () {
            let self = this;
            var dataParam = _.cloneDeep(self.createUser);
            self.$http.post('/api/user/createUser', dataParam).then(res => {
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
                            message: "保存成功",
                            type: 'success'
                        });
                    } else {
                        self.$message({
                            message: "保存失败",
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

        //查询用户
        queryUsers: function (flag) {
            let self = this;
            let data = _.cloneDeep(self.users.formData);
            data.page = flag ? 1 : self.users.currentPage;
            //data.name = data.institutionName;
            self.$http.post('/api/user/queryAllUsers', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.users.userList = res.data.recordset;
                        self.users.currentPage = data.page;
                        if (flag) {
                            self.queryUsersCount(data);
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
        showDefaultQuickQuery: function (flag) {
            var self = this;
            self.users.formData.userName = "";
            self.users.formData.id = "";
            self.users.formData.role = "";
            self.users.formData.grade = "";
            if (flag) {
                self.queryUsers(true);
            }
        },
        stopPropagationPreventDef: function () {

        },
        queryUsersCount: function (data) {
            let self = this;
            if (!data) {
                var data = {};
            }
            data.page = self.users.currentPage;
            //data.name = data.institutionName;
            self.$http.post('/api/user/queryAllUsersCount', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        self.users.count = res.data.recordset[0].num;
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
        renderBeginTime: Filters.renderBeginTime,
    }
}
