import BottomNav from "../../../components/layout/BottomNav.vue"
//import SIdentify from '../../../components/login/Captcha.vue'

export default {
    name: "loginView",
    components: {
        "bottom-nav": BottomNav,
        //"s-identify": SIdentify,
    },
    data() {
        // 验证码自定义验证规则
        // const validateVerifycode = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入验证码'))
        //     } else if (value !== this.identifyCode) {
        //         console.log('validateVerifycode:', value)
        //         callback(new Error('验证码不正确!'))
        //     } else {
        //         callback()
        //     }
        // }
        return {
            logining: false,
            loginForm: {
                userName: '',
                password: '',
                isRemember: true
                //verifycode: ''
            },
            rules: {
                userName: [{
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }],
                // verifycode: [
                //     {
                //         required: true,
                //         trigger: 'blur',
                //         validator: validateVerifycode
                //     }
                // ]

            },
            identifyCodes: '1234567890',
            identifyCode: '',
        }
    },
    mounted: function () {
        var self = this;
        //
        self.user = JSON.parse(localStorage.getItem('user'));
        if (self.user) {
            self.loginForm.userName = self.user.userName;
            self.loginForm.password = self.user.password;
            self.loginForm.isRemember = self.user.isRemember;
        }
        // 验证码初始化
        this.identifyCode = '';
        this.makeCode(this.identifyCodes, 4);
        $('.main-content').height($(window).height() - 200)
    },
    methods: {
        handleLogin(event) {
            let self = this;
            self.$refs.loginForm.validate((valid) => {
                if (valid) {
                    self.logining = true;
                    let loginParams = {
                        userName: self.loginForm.userName,
                        password: self.loginForm.password,
                        isRemember: self.loginForm.isRemember,
                    };
                    self.$http.post('/api/login', loginParams).then(res => {
                        self.logining = false;
                        let status = res.status;
                        let statusText = res.statusText;
                        if (status !== 200) {
                            self.$message({
                                message: statusText,
                                type: 'error'
                            });
                        } else {
                            if (res.data.recordset.length != 0) {
                                let user = res.data.recordset[0];
                                user.isRemember = self.loginForm.isRemember;
                                window.sessionStorage.setItem('user', JSON.stringify(user));
                                window.localStorage.setItem('user', JSON.stringify(user));
                                self.$router.replace({
                                    path: '/main'
                                });
                            } else {
                                self.$message({
                                    message: "帐号或密码错误",
                                    type: 'warning'
                                });
                                self.$router.push({
                                    path: '/login'
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
        // 生成随机数
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        // 切换验证码
        refreshCode() {
            this.identifyCode = '';
            this.makeCode(this.identifyCodes, 4);
        },
        // 生成四位随机验证码
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[
                    this.randomNum(0, this.identifyCodes.length)
                    ]
            }
            console.log(this.identifyCode)
        }
    }
}
