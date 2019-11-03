import TopNav from "../../../components/layout/TopNav.vue"

// 是否是刷新页面直动登录的标识
var isForceLogin = false;
// 判断当前会话的ID是否存在，如果不存在，尝试在sessionStorage中恢复会话
// (function() {
//     if (!Cache.session.id) {
//         var session = null;
//         // 从本地缓存中获取sessionID
//         if (window.sessionStorage) {
//             var sessionJsonString = window.sessionStorage["session"];
//             if (sessionJsonString) {
//                 session = JSON.parse(sessionJsonString);
//             }
//         }
//         // 如果获取得到session，说明已经登录过，坐席刷新了页面
//         //
//         if (session) {
//             // 恢复Cache.session
//             LoginHandler.userLogined(session, function () {
//                 isForceLogin = true;
//             });
//         }
//     }
// })();
export default {
    name: "mainFrameView",
    components: {
        "top-nav": TopNav,
    },
    data() {
        return {
            isCollapse: false,
            userName: '',
            password: '',
            menuData: [],
            user:{},
        }
    },
    beforeMount: function() {
        var self = this;

        // 如果是刷新登录，则改变router的路径，让左侧菜单与右侧显示出来
        // 如果不改变router的路径，左侧菜单显示不出来
        if (isForceLogin) {
            self.$router.replace({path: "/main"});
        }
    },
    mounted: function () {
        var self = this;
        $('.el-aside').height($(window).height());
        self.user = sessionStorage.getItem('user');
        if (self.user) {
            self.user = JSON.parse(self.user);
            self.userName = self.user.userName || '';
            self.password = self.user.avatar || '';
        }
        self.queryMenu();
        // 将当前url变换为首个菜单的url
        var path = '/home';
        if (path) {
            self.$router.replace({path: path});
        }
    },
    methods: {
        queryMenu() {
            let _this = this;
            _this.$http.get('/api/menu').then(res => {
                _this.menuData = this.initMenu(res.data.recordset);
                window.sessionStorage.setItem('menuData', JSON.stringify( _this.menuData))
            })
                .catch(error =>
                    _this.$message({
                        message: error.message,
                        type: 'error'
                    }),
                );
        },
        initMenu(menu) {
            var menu1 = _.cloneDeep(menu);
            for (var x = 0; x < menu1.length; x++) {
                if (menu1[x].id == "project_index") {
                    menu1[x].children = [];
                }
                if (menu1[x].id == "report_analysis") {
                    menu1[x].children = [];
                }
            }
            for (let y = menu1.length - 1; y >= 0; y--) {
                if (menu1[y].parentid != "root") {
                    menu1.splice(y, 1);
                }
                if(this.user.grade !=0){
                    if (menu1[y].id == "users") {
                        menu1.splice(y, 1);
                    }
                }
            }
            for (var i = 0; i <menu.length; i++) {
                for (var j = 0; j <menu1.length; j++) {
                    if (menu[i].parentid && menu[i].parentid == "project_index") {
                        if (menu1[j]&&menu1[j].id == "project_index") {
                            if(menu1[j]){
                                menu1[j].children.push(menu[i]);
                            }
                        }
                    }
                    if (menu[i].parentid && menu[i].parentid == "report_analysis") {
                        if (menu1[j]&&menu1[j].id == "report_analysis") {
                            if(menu1[j]){
                                menu1[j].children.push(menu[i]);
                            }
                        }
                    }
                }

            }
            return menu1;

        },
        changeCollapse(isCollapse) {
            console.log("-====")
            console.log(isCollapse)
        }
    }
}
