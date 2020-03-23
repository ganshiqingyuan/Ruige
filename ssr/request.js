import axios from "axios"
import Vue from "vue";

var request = axios.create({
    //baseURL: '/',
    baseURL: 'http://localhost:3000',
    //timeout:10000,
    headers: {
        "Content-Type": 'application/json'
    }
});

request.interceptors.request.use(function (config) {
    return config
}, function (error) {
    console.log(error)
})

request.interceptors.response.use(function (response) {
    console.log(response)
    if (response.data.code == '200') {
        return Promise.resolve(response.data);
    } else if (response.data.resultCode === '1') {
        console.log(response.data.msg)
        return Promise.reject(false)
    }
    else {
        console.log(response.data.msg)
        return Promise.reject(false)
    }
}, function (error) {
    console.log(error)
    return Promise.reject(false)
})

export function getProductInfo(params){
    return request({
        url:'/houtai/productmanage/get_product_detail',
        method: 'get',
        params
    })
}
