// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Router from "vue-router";
import App from "./App.vue";
import "font-awesome/css/font-awesome.min.css";
import router from "./router";
import VCharts from "v-charts";
import "@/styles/index.scss";
// import './mock/index'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
import VueLazyload from 'vue-lazyload'
Vue.use(ElementUI);
Vue.use(Router);
Vue.use(VCharts);
// 图片懒加载插件
Vue.use(VueLazyload)
Vue.config.productionTip = false;
Vue.prototype.$busEvent = new Vue();
console.log(1);
/**
 * 判断当前是否登录，未登录不能跳转路由
 * 防止未登录状态下直接输入路由跳转
 */
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
    if (to.path == "/login") {
        sessionStorage.removeItem("user");
    }
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user && to.path != "/login") {
        next({
            path: "/login"
        });
    } else {
        next();
    }
});

// 引入路由
new Vue({
    el: "#app",
    store,
    model: 'history',
    router, // 注入到根实例中
    render: h => h(App)
});