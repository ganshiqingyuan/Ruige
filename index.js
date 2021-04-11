import Vue from "vue";
import App from "./app.vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(ElementUI);
import router from "./route/route.js"
import request from "./config/request.js"
//import store from "./store/store.js"

Vue.use(request)

window.cdn = {
    productUrl: "https://img.rayvet.cn/",
    newsUrl: "/cdn-news/"
}

new Vue({
    data() {
        return {
            text: 123,
        }
    },
    router,
    //   store,
    el: "#app",
    render: c => c("App"),
    components: {
        App
    }

    //template:"<h1>123123</h1>"
})
