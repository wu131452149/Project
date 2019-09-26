import TopNav from "../../../components/layout/TopNav.vue"

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
            menuData: []
        }
    },
    mounted: function () {
        $('.el-aside').height($(window).height());
        let user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.userName = user.userName || '';
            this.password = user.avatar || '';
        }
        this.queryMenu();
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
