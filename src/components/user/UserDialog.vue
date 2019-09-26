<template>
  <div class="user-dialog">
      <el-dialog title="" :visible.sync="userDialogVisible">
        <!--个人信息-->
        <div class="user-info middle-spacing-tab" v-if="userInfo">
          <el-tabs v-model="userInfoActiveName">
            <el-tab-pane label="密码修改" name="password">
              <div class="user-info-password width360">
                <el-form ref="password" :model="password" label-width="100px">
                  <el-form-item label="原密码">
                    <el-input v-model="password.oldPassword" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码">
                    <div class="clearFix">
                      <el-input v-model="password.password" type="password" :maxlength = "16"
                                @blur="checkNewPasswordByBlur()" id="newPassword" class="f-l"></el-input>
                      <div class="f-l margin-l" v-show="passwordWarning">
                        <i class="el-icon-warning margin-r10 color-origine"></i><span style="color:#ff0000">密码过于简单，请重新设置~</span>
                      </div>
                      <div v-show="!passwordWarning && showPasswordStrength" id="passwordStrength" class="f-l flex text-c margin-t10 margin-l">
                        <div class="password-strength bg-color-ccc weak">弱</div>
                        <div class="password-strength bg-color-ccc middle">中</div>
                        <div class="password-strength bg-color-ccc strong">强</div>
                      </div>
                    </div>
                    <div><el-tag class="margin-t10">
                      <i class="el-icon-warning margin-r10"></i> 至少包含8个字符，由“数字 + 字母（区分大小写）”组合
                    </el-tag></div>
                  </el-form-item>
                  <el-form-item label="确认新密码">
                    <el-input v-model="password.newPassword" type="password" :maxlength = "15"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="save-btn text-c">
                <el-button type="primary" @click="appUserPasswordUpdate">保 存</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-dialog>
  </div>
</template>
<style src="../../css/user/UserDialog.css"></style>
<script src="../../js/view/user/UserDialogView.js"></script>
