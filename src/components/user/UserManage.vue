<!--用户管理-->
<template>
    <div v-if="user.grade==0">
        <div class="edit-department scrollBar-inner wrap" style="height: 514px;" >
            <!--查询条件 start-->
            <div class="general-search" >
                <div><i class="el-icon-search cursor-default"></i><h5 class="inline-block">用户查询</h5></div>
                <el-form :inline="true" ref="searchData" v-model="users.formData" style="padding-left: 30px">
                    <!--快捷查询 start-->
                    <div class="quick-search clearFix">
                        <div class="f-l color-label">操作</div>
                        <div class="f-l el-tag-list margin-l-5">
                            <el-tag
                                class="margin-b5">
                                <el-button type="text" @click.stop="showCreateUsers($event)">添加用户</el-button>
                            </el-tag>
                        </div>
                    </div>
                    <!--快捷查询 end-->
                    <div style="margin-bottom: 12px;">
                        <div class="inline-block">
                            <el-form-item label="用户名" prop="" class="agent-select-label">
                                <el-input placeholder="按用户名搜索" v-model="users.formData.userName"
                                          required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                        </div>
                        <div class="inline-block">
                            <el-form-item label="用户单位" prop="" class="agent-select-label">
                                <el-input placeholder="按用户单位搜索" v-model="users.formData.role"
                                          required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                        </div>
                        <div class="inline-block">
                            <el-form-item label="用户类别" prop="" class="agent-select-label">
                                <el-input placeholder="按用户类别搜索" v-model="users.formData.grade"
                                          required
                                          prefix-icon="el-icon-search"
                                          class="input-with-select nick-name-input"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <!--按钮-->
                    <div class="text-c medium-btn">
                        <el-button type="primary" @click="queryUsers(true)">查询</el-button>
                        <el-button type="primary" @click="showDefaultQuickQuery(false)">重置</el-button>
                    </div>
                </el-form>
            </div>
            <!--查询条件 end-->
            <!--表格start-->
            <div class="report-form element-table less-condition">
                <el-table
                    ref="multipleTable"
                    :data="users.userList"
                    tooltip-effect="light"
                    @click.stop.prevent="stopPropagationPreventDef($event)"
                    style="width: 100%;">
                    <el-table-column show-overflow-tooltip prop="userName" label="用户名">
                        <template slot-scope="scope">{{scope.row.userName}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="role" label="用户单位">
                        <template slot-scope="scope">{{scope.row.role}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="time" label="用户密码">
                        <template slot-scope="scope">{{scope.row.password}}</template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip prop="grade" label="用户类别">
                        <template slot-scope="scope">{{scope.row.grade}}</template>
                    </el-table-column>
                    <el-table-column label="操作" class="text-c">
                        <template slot-scope="scope">
                            <a @click.stop="showUpdateUsers($event,scope.row)">修改</a>
                            <a @click.stop="deleteUsers($event,scope.row)">删除</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--表格end-->
            <!--分页 start-->
            <div class="text-r margin-t10">
                <div class="f-r clearFix">
                    <div class="f-l pagination-total">
                        <a class=""v-if="!showCountNumber && IsNewMediaSessionLargeData == '1'"  @click="queryUsersCount">查询总数</a>
                        <span class=""  v-else >共 <span>{{users.count}}</span> 条</span>
                    </div>
                    <el-pagination class="f-r"
                                   @current-change ="queryUsers(false)"
                                   layout="prev, pager, next, jumper"
                                   :total="users.count"
                                   :current-page.sync ="users.currentPage"
                    >
                    </el-pagination>
                </div>

            </div>
            <!--分页 end-->
        </div>
        <el-drawer
            title="新增用户"
            :visible.sync="drawerDetails"
            :direction="direction"
            custom-class="demo-drawer"
            ref = "createUserDraw"
            size=55%
            :before-close="handleClose">
            <div class="wrap wrap-crowded position-r clearfix scrollBar-inner" style="height: 500px;">
                <el-form :model="createUser" :rules="rules" class="width300" ref="createUser">
                    <el-form-item label="用户名" prop="userName" class="margin-b10">
                        <el-input v-model="createUser.userName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="级别"  prop="grade" class="margin-b10">
                        <el-radio-group v-model="createUser.grade">
                            <el-radio label="1" value="1"></el-radio>
                            <el-radio label="2" value="2"></el-radio>
                            <el-radio label="3" value="3"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密码"  prop="password" class="margin-b10">
                        <el-input v-model="createUser.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="单位"  prop="role" class="margin-b10">
                        <el-input  v-model="createUser.role" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                    <el-button @click="closeForm">取 消</el-button>
                    <el-button type="primary" @click="createUsers" :loading="loading">{{ loading ? '提交中 ...' : '提交' }}
                    </el-button>
                </div>
            </div>
        </el-drawer>
        <el-drawer
            title="修改用户"
            :visible.sync="drawer"
            :direction="direction"
            custom-class="demo-drawer"
            ref = "updateUserDrawer"
            size=55%
            :before-close="handleClose">
            <div class="wrap wrap-crowded position-r clearfix scrollBar-inner" style="height: 500px;">
                <el-form :model="updateUser" :rules="rules" class="width300" ref="updateUser">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="updateUser.userName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="级别"  prop="grade">
                        <el-radio-group v-model="updateUser.grade">
                            <el-radio label="1" value="'1'"></el-radio>
                            <el-radio label="2" value="'2'"></el-radio>
                            <el-radio label="3" value="'3'"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="密码"  prop="password">
                        <el-input v-model="updateUser.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="单位"  prop="role">
                        <el-input  v-model="updateUser.role" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer margin-t-25" style="text-align: center;">
                    <el-button @click="closeUpdateForm">取 消</el-button>
                    <el-button type="primary" @click="updateUsers" :loading="loading">{{ loading ? '更新中 ...' : '更新' }}
                    </el-button>
                </div>
            </div>
        </el-drawer>
    </div>
    <div v-else>
        暂无查看权限
    </div>

</template>
<script src="../../js/view/user/UserManageView.js"></script>

<style>
    .width300 .el-form-item__label {
        width: 130px;
    }

    .width300 .el-form-item .el-form-item__content {
        display: inline-block;
    }
</style>
