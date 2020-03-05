<template>
    <div>
        <el-row :gutter="20" style="color:#FFFFFF;">
            <span style="position: absolute;font-size: 22px;left: 0px;">临猗县财政资金建设项目库平台</span>
            <el-col :span="8" :push=14>
                欢迎您，{{user.role}}管理员
            </el-col>
            <el-col :span="2" :push=12>
                <i class="el-icon-message-solid" title="刷新红点" @click="flashRed"></i>
            </el-col>
            <el-col :span="2" :push=11>
                <i class="fa fa-user" title="修改密码" @click="toggleDialog($event,'changePassWord')"></i>
            </el-col>
            <el-col :span="2" :push=10>
                <i class="fa fa-sign-out" title="退出系统" @click="exitSystem"></i>
            </el-col>
        </el-row>
        <user-dialog ref="userDialog"
                     @toggleDialog="toggleDialog"
                     v-bind:user-info="userInfo">
        </user-dialog>
    </div>

</template>

<style src="../../css/layout/TopNav.css" scoped></style>
<script src="../../js/view/layout/TopNav.js"></script>
