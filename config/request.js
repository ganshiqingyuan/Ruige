import axios from "axios"
import router from "../route/route.js"
import {
    Notification as notice
} from 'element-ui';

var request = axios.create({
    baseURL: 'http://localhost:3000',
    //timeout:10000,
    headers: {
        "Content-Type": 'application/json'
    }
});

request.interceptors.request.use(function (config) {
    return config
}, function (error) {
    notice({
        title: '警告',
        message: error,
        type: 'error'
    })
})

request.interceptors.response.use(function (response) {
    console.log(response)
    if (response.data.code == '200') {
        return Promise.resolve(response.data);
    } else if (response.data.resultCode === '1') {
        notice({
            title: '提示',
            message: response.data.resultMessage,
            type: "warning"
        })
        return Promise.reject(false)
    }
    else {
        notice({
            title: '警告',
            message: response.data.resultMessage,
            type: 'error'
        })
        return Promise.reject(false)
    }
}, function (error) {
    notice({
        title: '警告',
        message: error,
        type: 'error'
    })
    return Promise.reject(false)
})

var apis = {
    getTypeList: function(data){
        return request({
            url:'/houtai/productmanage/get_type_list',
            method: 'get',
            data
        })
    }
}
export default {
    install: function (Vue) {
        Vue.prototype.$rq = apis
    }
}