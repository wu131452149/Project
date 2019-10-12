<template>
    <div>
        <el-row :gutter="20" style="color:#FFFFFF;">
            <el-col :span="8" :push=14>
                欢迎您，{{user.role}}管理员
            </el-col>
            <el-col :span="2" :push=13>
                <i class="fa fa-user" @click="toggleDialog($event,'changePassWord')"></i>
            </el-col>
            <el-col :span="2" :push=12>
                <i class="fa fa-sign-out" @click="exitSystem"></i>
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
