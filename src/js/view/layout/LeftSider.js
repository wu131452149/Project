import Vue from "vue";
import EventBus from "../../lib/event/EventBus.js"

export default {
    props: ["menuData"],
    name: "leftSiderView",
    components: {
      
    },
      data() {
          return {
              isCollapse: false,
              activeIndex: null,
              ifNewPro:{},
              // 有红点的菜单
              badge: {},
              user:{},
          };
    },
      watch: {
          "$route": function (to, from) {
              let _this = this;
              // 分割跳转到的url
              let key = to.params.pathMatch;
              _this.activeIndex = key;
          }
        },
      mounted: function() {
        var self = this;
          self.user = JSON.parse(sessionStorage.getItem('user'));
          if(self.user.grade==2){
              self.queryIfNewProject();
          }
          EventBus.$on("showMenuBadge", function (pageID) {
              Vue.set(self.badge, pageID, true);
          });
          EventBus.$on("hideMenuBadge", function (pageID) {
              Vue.delete(self.badge, pageID);
          });
      },
    methods: {
        //是否要显示小红点
        queryIfNewProject: function () {
            let self = this;
            var data = {};
            data.role = self.user.role;
            self.$http.post('/api/project/queryIfNewProject', data).then(res => {
                let status = res.status;
                let statusText = res.statusText;
                if (status !== 200) {
                    self.$message({
                        message: statusText,
                        type: 'error'
                    });
                } else {
                    if (res.data.length != 0) {
                        if(res.data && res.data.recordset.length>0){
                            self.ifNewPro = res.data.recordset[0];
                            if(self.ifNewPro.stepOne >0){
                                Vue.set(self.badge, "show_new_project", true);
                            }
                            if(self.ifNewPro.stepTwo >0 ||self.ifNewPro.stepThree >0
                                ||self.ifNewPro.stepFour >0||self.ifNewPro.stepFive >0||self.ifNewPro.stepSix >0){
                                Vue.set(self.badge, "project_doing", true);
                            }
                            if(self.ifNewPro.stepSeven >0){
                                Vue.set(self.badge, "project_finish", true);
                            }
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
        changeCollapse() { 
            let _this = this;
            if (_this.isCollapse) {
                _this.isCollapse = false;
                _this.$emit("update:isCollapse", false);
                $("#app").removeClass("app-mini");
            } else {
                _this.$emit("update:isCollapse", true);
                _this.isCollapse = true;
                $("#app").addClass("app-mini");
            }
        },
        handleOpen(key, keyPath) {
            let _this = this;
            _this.activeIndex = key;
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            let _this = this;
            //console.log(key, keyPath);
        }
    }
  }
