<template>
    <el-container class="login">
        <!--<el-header class="login-top" height="80px">-->
            <!--<el-row type="flex" align="middle" justify="center" class="height-per100">-->
                <!--<el-col :span="14" style="position: absolute;left: 50px;"><div class="login-font">临猗县财政资金建设项目库平台</div></el-col>-->
                <!--<el-col :span="4" :pull="1">-->
                    <!--<div class="clearfix" style="padding-top:10px;min-width:500px;">-->
                        <!--&lt;!&ndash;<div class="login-envelope"><i class="fa fa-envelope" style="font-size:26px;" aria-hidden="true"></i></div>&ndash;&gt;-->
                        <!--&lt;!&ndash;<div class="login-email"><a class="black-color"></a></div>&ndash;&gt;-->
                    <!--</div></el-col>-->
            <!--</el-row>-->
        <!--</el-header>-->
        <el-main>
            <el-row type="flex" align="middle" justify="center" class="height-per100 main-content">
                <el-col :span="5">
                    <div class="bg-login">

                        <div class="text-c font20 position-r line-height-60" style="margin-top:20px;">登录</div>
                        <el-form label-width="70px" :model="loginForm" :rules="rules" ref="loginForm">
                            <el-form-item label="账号" prop="userName">
                                <el-input v-model="loginForm.userName" auto-complete="off" placeholder="请输入账号"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
                            </el-form-item>
                            <el-form-item label="" prop="password">
                                <el-checkbox v-model="loginForm.isRemember" label="记住密码" name="type"></el-checkbox>
                            </el-form-item>
                            <!--<el-form-item  prop="verifycode">-->
                                <!--&lt;!&ndash; 注意：prop与input绑定的值一定要一致，否则验证规则中的value会报undefined，因为value即为绑定的input输入值 &ndash;&gt;-->
                                <!--<el-input v-model="loginForm.verifycode" placeholder="请输入验证码" class="identify-input"></el-input>-->
                            <!--</el-form-item>-->
                            <!--<el-form-item>-->
                                <!--<div class="identify-box">-->
                                    <!--<div @click="refreshCode">-->
                                        <!--<s-identify :identifyCode="identifyCode"></s-identify>-->
                                    <!--</div>-->
                                    <!--<el-button @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>-->
                                <!--</div>-->
                            <!--</el-form-item>-->
                            <el-form-item>
                                <el-button type="danger" @click.native.prevent="handleLogin" :loading="logining">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </el-main>
        <!--<el-footer class="login-bottom" height="80px">-->
            <!--<bottom-nav></bottom-nav> -->
        <!--</el-footer>-->
    </el-container>
</template>

<script src="../../js/view/login/LoginView.js"></script>
<style src="../../css/login/Login.css" scoped></style>
<style scoped>
    .identify-box{
        display: flex;
        justify-content: space-between;
        margin-top:7px;
    }
    .iconstyle{
        color:#409EFF;
    }
</style>
