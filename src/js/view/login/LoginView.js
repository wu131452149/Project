import BottomNav from "../../../components/layout/BottomNav.vue"
import SIdentify from '../../../components/login/Captcha.vue'

export default {
    name: "loginView",
    components: {
        "bottom-nav": BottomNav,
        "s-identify": SIdentify,
    },
    data() {
        // 验证码自定义验证规则
        const validateVerifycode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'))
            } else if (value !== this.identifyCode) {
                console.log('validateVerifycode:', value)
                callback(new Error('验证码不正确!'))
            } else {
                callback()
            }
        }
        return {
            logining: false,
            loginForm: {
                userName: '',
                password: '',
                verifycode: ''
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
                verifycode: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validateVerifycode
                    }
                ]

            },
            identifyCodes: '1234567890',
            identifyCode: '',
        }
    },
    mounted: function () {
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
                        verifycode: self.loginForm.verifycode
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
                            if (res.data.length != 0) {
                                let user = res.data.recordset[0];
                                // self.$message({
                                //     message: "欢迎您，"+user.userName+"管理员",
                                //     type: 'success'
                                // });
                                window.sessionStorage.setItem('user', JSON.stringify(user));
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
