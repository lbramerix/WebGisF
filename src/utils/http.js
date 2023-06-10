// http.js
import axios from "axios";
// import {
//     Loading
// } from "element-ui";
/* 解决同时报多个错误 */
import domMessage from "@/utils/onceTipsForMessage.js";
import {
    config
} from '@/config/config'
const messageOnce = new domMessage();
//创建axios的一个实例
//统一接口实例方法
let http = axios.create({
    baseURL: config.getDomain() + config.gatewayPath, //接口统一域名
    timeout: 20000, //设置超时
    // transformRequest: [//转换为formdata
    //     function (oldData) {
    //         let newStr = '';
    //         for (let item in oldData) {
    //             newStr += encodeURIComponent(item) + '=' + encodeURIComponent(oldData[item]) + '&'
    //         }
    //         newStr = newStr.slice(0, -1);
    //         return newStr
    //     }
    // ],
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});
// let loading;
//显示loading
// const showLoading = () => {
//     loading = Loading.service({
//         text: "请求数据中",
//         background: "rgba(0, 0, 0, 0.7)",
//         spinner: "el-icon-loading",
//     });
// };
//隐藏loading
// const hideLoading = () => {
//     loading.close();
// };
//请求拦截器
http.interceptors.request.use((config) => {
    // showLoading();
    //   const token = localStorage.getItem("token");
    //   config.headers["X-Access-Token"] = token;
    return config;
});
//响应拦截器
http.interceptors.response.use(
    (response) => {
        // hideLoading();
        //响应成功
        // console.log('拦截器报错');
        return response.data;
    },
    (error) => {
        // if (error.response && error.response.status == "500") {
        //     messageOnce.error(error.response.data.message);
        //     if (error.response.data.message == "Token失效，请重新登录") {
        //         if (process.env.NODE_ENV === "production") {
        //             window.location.href = process.env.VUE_APP_PC_URL;
        //         }
        //     }
        // }
        //响应错误
        if (error.response && error.response.status) {
            const status = error.response.status;
            let message = "";
            switch (status) {
                case 400:
                    message = "请求错误";
                    break;
                case 401:
                    message = "请求错误";
                    break;
                case 404:
                    message = "请求地址出错";
                    break;
                case 408:
                    message = "请求超时";
                    break;
                case 500:
                    message = "服务器内部错误!";
                    break;
                case 501:
                    message = "服务未实现!";
                    break;
                case 502:
                    message = "网关错误!";
                    break;
                case 503:
                    message = "服务不可用!";
                    break;
                case 504:
                    message = "网关超时!";
                    break;
                case 505:
                    message = "HTTP版本不受支持";
                    break;
                default:
                    message = "请求失败";
            }
            // hideLoading();
            messageOnce.error(message);
            // return Promise.reject(error);
        } else {
            // hideLoading();
            messageOnce.error("连接服务器失败");
        }
        return Promise.reject(error);
    }
);
//导出
export {
    http
};