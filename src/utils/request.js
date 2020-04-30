import axios from 'axios'
import { Message } from 'element-ui';

// 创建拦截器 赋值变量 service
// api地址 http://www.web-jshtml.cn/productapi

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';

const service = axios.create({
    baseURL: BASEURL, // http://192.168.0.101:8080/devApi/  ==  http://www.web-jshtml.cn/productApi
    timeout: 1000,
});



// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});



// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data;
    if (data.resCode !== 0) {
        Message.error(data.message);
        return Promise.reject(data)
    } else {
        return response
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});



export default service;