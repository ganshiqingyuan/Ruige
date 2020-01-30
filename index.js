import Vue from "vue";
import App from "./app.vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import config from "./elementconfig.js"
import router from "./route/route.js"
import request from "./config/request.js"
//import store from "./store/store.js"

Vue.use(request)

new Vue({
    data(){
        return{
            text:123,
        }
    },
    router,
 //   store,
    el:"#app",
    render:c=>c("App"),
    components:{
        App
    }   
    
    //template:"<h1>123123</h1>"
})
