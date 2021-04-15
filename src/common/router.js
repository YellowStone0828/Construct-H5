import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter) // 注册vue-router
import store from '@/common/vuex.js' //全局仓储
import Global from '@/common/global.js' //全局封装方法

const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/Login',
        name: 'Login',
        meta: {title: '登录'},//requireAuth: false
        component: (resolve) => require(['@/pages/Login.vue'], resolve),
    }, {
        path: '/',
        name: 'Home',
        redirect: '/Home'
    }, {
        path: '/Home',
        name: 'Home',
        meta: {title: '首页'},
        component: (resolve) => require(['@/pages/Home.vue'], resolve),
        children: [
            {
                path: '/WorkerManage',
                name: 'WorkerManage',
                meta: {title: '员工管理', keepAlive: true},
                component: (resolve) => require(['@/pages/Admin/WorkerManage.vue'], resolve),
            },
        ]
    }]
})

router.beforeEach((to, from, next) => {

    // console.log(to)
    const loginUserStr = sessionStorage.getItem("loginUser");
    let loginUser = {};
    loginUserStr && (loginUser = JSON.parse(loginUserStr));

    let {username, role} = loginUser;
    if ((!username || !role) && to.name !== 'Login') {
        next('/Login')
    }
    if (to.name === 'Login') {
        next()
    } else if (to.name === 'Home' || to.meta.title) {
        store.commit('pageJump', to)
        store.state.pagination.page = 0;
        next()
    } else {
        //通知一下
        console.error('stop to errorPage')
        Global.toast('页面路径无效')
    }
});


export default router
