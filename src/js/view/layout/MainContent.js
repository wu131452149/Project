/**
 *  路由懒加载
 *  定义：懒加载也叫延迟加载，即在需要的时候进行加载，随用随载。从而提升了系统性能。
 *
 */
const Home = resolve => require(['../../../components/index/Home.vue'], resolve);
const UserManage = resolve => require(['../../../components/user/UserManage.vue'], resolve);
const ShowNewProject = resolve => require(['../../../components/project/step1/ShowNewProject.vue'], resolve);
const ProjectDoing = resolve => require(['../../../components/project/ProjectDoing.vue'], resolve);
const ProjectFinish = resolve => require(['../../../components/project/step7/ProjectFinish.vue'], resolve);
const ProjectReturned = resolve => require(['../../../components/project/ProjectReturned.vue'], resolve);
const EditInsituation = resolve => require(['../../../components/project/EditInsituation.vue'], resolve);


export default {
    name: "mainContentView",
    components: {
        "home": Home, // 将动态组件注册进来
        "user-manage": UserManage,
        "show-new-project": ShowNewProject,
        "project-doing":ProjectDoing,
        "project-finish":ProjectFinish,
        "project-returned": ProjectReturned,
        "edit-insituation":EditInsituation
    },
    data() {
        return {
            currComponent: ""
        };
    },
    watch: {
        "$route": function (to, from) {
            let _this = this;
            let menuData = sessionStorage.getItem('menuData');
            if (menuData) {
                menuData = JSON.parse(menuData);
            }
            // 分割跳转到的url
            let pathArr = to.params["pathMatch"].split("/");
            if (pathArr.length < 1) return;
            for (let firstLevelMenu in menuData) {
                if (menuData[firstLevelMenu].id == pathArr[0]) {
                    if (menuData[firstLevelMenu].component) {
                        _this.currComponent = menuData[firstLevelMenu].component;
                        break;
                    } else {
                        let secondMenuData = menuData[firstLevelMenu].children;
                        for (let secondLevelMenu in secondMenuData) {
                            if (secondMenuData[secondLevelMenu].id == pathArr[1]) {
                                _this.currComponent = secondMenuData[secondLevelMenu].component;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    },
    mounted: function () {

    },
    methods: {},
    activated: function() {
        this.getCase()
    }
}
