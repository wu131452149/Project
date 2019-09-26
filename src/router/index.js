import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login.vue'
import MainFrame from '@/components/layout/MainFrame.vue'
import LeftSider from '@/components/layout/LeftSider.vue'
import MainContent from '@/components/layout/MainContent.vue'

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
export default new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/*',
            name: 'mainFrame',
            component: MainFrame,
            children: [
                {
                    path: '',
                    components: {
                        leftSider: LeftSider,
                        mainContent: MainContent
                    }
                }
            ]
        }
    ]
})
