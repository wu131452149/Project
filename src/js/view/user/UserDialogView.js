// import Cache from "../../handlers/common/Cache.js";
// import Utils from '../../lib/Utils.js'
// import UserDialogHandler from '../../handlers/user/UserDialogHandler.js';
// import EventBus from "../../lib/EventBus.js"

export default {
    props: ["userInfo"],
    data: function () {
        return {
            userDialogVisible: false,
            userInfoActiveName: "password",
            password: {},
            passwordFlag: false, //登录时密码校验标记
            passwordWarning: false,
            showPasswordStrength: false, //是否显示密码强度框
        }
    },
    mounted: function () {
        var self = this;
    },
    watch: {
        "password.password": function (password) {
            var self = this;
            if (password == "") {
                self.showPasswordStrength = false;
                return;
            }
            var passwordFlag = self.checkPassword(password);
            if (passwordFlag == 2) {
                //密码弱
                self.passwordWarning = false;
                self.showPasswordStrength = true;
                $("#newPassword").css("border", "");
                $(".password-strength.weak").css({"color": "#e05343", "background-color": "#e05343"});
                $(".password-strength.weak").css("border", "1px solid #e05343");
                $(".password-strength.middle").css({"color": "#333", "background-color": "#ccc"});
                $(".password-strength.middle").css("border", "");
                $(".password-strength.strong").css({"color": "#333", "background-color": "#ccc"});
            } else if (passwordFlag == 3) {
                //密码中
                self.passwordWarning = false;
                self.showPasswordStrength = true;
                $("#newPassword").css("border", "");
                $(".password-strength.weak").css({"color": "#e05343", "background-color": "#e05343"});
                $(".password-strength.weak").css("border", "1px solid #e05343");
                $(".password-strength.middle").css({"color": "#3888be", "background-color": "#3888be"});
                $(".password-strength.middle").css("border", "1px solid #3888be");
                $(".password-strength.strong").css({"color": "#333", "background-color": "#ccc"});
                $(".password-strength.strong").css("border", "");
            } else if (passwordFlag == 4) {
                //密码强
                self.passwordWarning = false;
                self.showPasswordStrength = true;
                $("#newPassword").css("border", "");
                $(".password-strength.weak").css({"color": "#e05343", "background-color": "#e05343"});
                $(".password-strength.weak").css("border", "1px solid #e05343");
                $(".password-strength.middle").css({"color": "#3888be", "background-color": "#3888be"});
                $(".password-strength.middle").css("border", "1px solid #3888be");
                $(".password-strength.strong").css({"color": "#37aa73", "background-color": "#37aa73"});
                $(".password-strength.strong").css("border", "1px solid #37aa73");
            } else if (passwordFlag == 7) {
                self.showPasswordStrength = true;
                $("#newPassword").css("border", "1px solid #ff0f0f");
                self.$message.error("新密码中含有非法字符!请重新输入");
            } else {
                //密码少于6位时
                $("#newPassword").css("border", "");
                $(".password-strength").css("border", "1px solid #999");
                $(".password-strength").css({"color": "#333", "background-color": "#ccc"});
            }
        }
    },
    methods: {
        initUserInfo: function () {


        },
        appUserPasswordUpdate: function () {
            var self = this, user = Cache.session.user, passwordInfo = self.password;
            if (!passwordInfo.oldPassword) {
                self.$message.error("请输入原密码!");
                return;
            }
            if (!passwordInfo.password || passwordInfo.password == "") {
                self.$message.error("请输入新密码!");
                $("#newPassword").css("border", "1px solid #ff0f0f");
                return;
            }
            if (passwordInfo.password.trim().length < 8) {
                self.passwordWarning = true;
                $("#newPassword").css("border", "1px solid #ff0f0f");
                return;
            }
            var passwordStrength = self.checkPassword(passwordInfo.password);
            if (passwordStrength == 1) {
                self.$message.error("您的新密码过于简单,请重新输入!");
                $("#newPassword").css("border", "1px solid #ff0f0f");
                return;
            }
            if (passwordStrength == 2) {
                self.$message.error("您的新密码强度较弱,请重新输入!");
                $("#newPassword").css("border", "1px solid #ff0f0f");
                return;
            }
            if (passwordStrength == 5) {
                self.$message.error("您的新密码中含有非法字符,请重新输入!");
                $("#newPassword").css("border", "1px solid #ff0f0f");
                return;
            }
            if (passwordInfo.password.trim().length > 16) {
                self.$message.error("您的密码长度过长,请重新输入!");
                $("#newPassword").css("border", "1px solid #ff0f0f");
                return;
            }
            // var password = /^[A-Za-z0-9_]+$/;
            // if (!passwordInfo.password || passwordInfo.password.trim().length < 6 || !password.test(passwordInfo.password)) {
            //   self.$message.error("【新密码】必须填写6-15位数字或字母，可以包含下划线!");
            //   return;
            // }
            if (passwordInfo.password != passwordInfo.newPassword) {
                self.$message.error("新密码和确认新密码输入不一致!");
                return;
            }
            if (passwordInfo.oldPassword != user.password) {
                self.$message.error("输入的原密码不对!");
                passwordInfo.oldPassword = "";
                return;
            }
            passwordInfo.accountId = user.accountId;
            passwordInfo.userId = user._id;
            passwordInfo.role = user.role;
            passwordInfo.sipConfigId = user.sipConfigId;
            passwordInfo.status = user.status;
            passwordInfo.name = user.name;
            passwordInfo.empNo = user.empNo;
            passwordInfo.loginName = user.loginName;
            passwordInfo.AutoBusyTime = user.AutoBusyTime;
            passwordInfo.mobile = user.mobile;
            passwordInfo.email = user.email;
            passwordInfo.uversion = user.uversion;
            passwordInfo.isCallAgent = user.isCallAgent;
            self.$http.post('/api/changePwd', passwordInfo).then(res => {
                self.logining = false;
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        let user = res.data.recordset[0];
                        self.$message({
                            message: "修改成功",
                            type: 'success'
                        });
                        window.sessionStorage.setItem('user', JSON.stringify(user));
                    } else {
                        self.$message({
                            message: "修改失败，请重试",
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
        },
        showUserDialog: function () {
            var self = this;
            self.initUserInfo();
            self.userDialogVisible = true;
            //self.answerModeRadio = Cache.session.user.extenType;
        },
        /**
         * @method 登录时校验密码
         */
        checkPasswordByLogin(password) {
            var self = this;
            var str = password;
            if (str == null || str.length < 6) {
                self.passwordFlag = false;
            }
            var reg = new RegExp(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/);
            if (reg.test(str)) {
                self.passwordFlag = true;
            } else {
                self.passwordFlag = false;
            }
        },
        /**
         * @method 修改密码时校验新密码
         */
        checkPassword(password) {
            var self = this;
            var passwordStrength = 1;
            if (!password || password == "" || password == null || password.trim().length < 8) {
                //密码为空或不存在
                return passwordStrength;
            }
            if (password.match(/[a-zA-Z]/g)) {
                passwordStrength++;
            }
            ;
            if (password.match(/[0-9]/g)) {
                passwordStrength++;
            }
            //var containSpecial = RegExp(/[(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\)(\_)]+/);
            //var reg2 = RegExp(/[(\.)(\()(\))]+/);
            var reg1 = new RegExp("[`%&~#+.()=\\-|{}':;',\\[\\]<>《》/?~￥\"\"……（·）！——|{}【】‘；：”“'。，、？\\\\]");
            var reg2 = new RegExp("[!@$^*_]");
            if (reg2.test(password)) {
                if (!reg1.test(password)) {
                    passwordStrength++;
                }
            }
            if (reg1.test(password)) {
                passwordStrength = 5;
            }
            return passwordStrength;
        },
        /**
         * @method 输入框失去焦点时校验新密码
         */
        checkNewPasswordByBlur() {
            var self = this;
            var password = self.password.password;
            var passwordFlag = self.checkPassword(password);
            if (password && password != "") {
                if (password.trim().length < 8 || passwordFlag == 2) {
                    // self.$message.error("密码过于简单,请重新设置~");
                    self.passwordWarning = true;
                    $("#newPassword").css("border", "1px solid #ff0f0f");
                } else {
                    self.passwordWarning = false;
                    self.showPasswordStrength = true;
                }
            }
        },
    },
}
