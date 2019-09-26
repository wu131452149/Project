import UserDialog from '../../../components/user/UserDialog.vue'

export default {
    name: "topNavView",
    components: {
        "user-dialog": UserDialog,
    },
    data() {
        return {
            userInfo: false,
            user:{}
        }
    },
    mounted: function () {
        var self = this;
        self.queryAllInstitution();
        self.user = JSON.parse(sessionStorage.getItem('user'));

    },
    methods: {
        //查询当前二级单位
        queryAllInstitution: function () {
            let self = this;
            self.$http.post('/api/institution/queryAllInstitution').then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        let institution = res.data.recordsets[0];

                        window.sessionStorage.setItem('institution', JSON.stringify(institution));
                    } else {
                        console.log("获取单位失败");
                    }
                }
            })
                .catch(error =>
                    console.log(error.message),
                );


        },
        exitSystem: function () {

        },
        toggleDialog: function (e, rel) {
            var self = this;
            self.userInfo = false;
            if (rel == "changePassWord") {
                self.userInfo = true;
                if ((self.$refs.userDialog.password.password && self.$refs.userDialog.password.password == "") || self.$refs.userDialog.password.password) {
                    self.$refs.userDialog.showPasswordStrength = false;
                    $("#newPassword").css("border", "");
                    $(".password-strength").css("border", "1px solid #999");
                    $(".password-strength").css({"color": "#333", "background-color": "#ccc"});
                }
            }
            self.$nextTick(function () {
                self.$refs.userDialog.showUserDialog();
            });
        },

    }
}
