import axios from 'axios'
import api from './api.js'
import ApiRequestor from './ApiRequestor'

let requestor = new ApiRequestor({storageKey: 'erp_token', refreshTokenUrl: api.refreshToken});

const instance = axios.create({});


var CancelToken = axios.CancelToken;
var source = CancelToken.source();

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

// let jse = new JSEncrypt()
// jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
// FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
// xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
// gwQco1KRMDSmXSMkDwIDAQAB
// -----END PUBLIC KEY-----`)

requestor.axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
requestor.axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.status_code == 1) {
        debugger;
        requestor.setToken(null);
        window.location.href = '/login';
    }
    // console.log(response)
    // if(response.data.status_code == 2){
    //   response.data['data'] = '您没有操作权限，请与管理员联系！';
    // }
    return response;
}, function (error) {
    return Promise.reject(error);
});

function checkStatus(response) {
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: '网络异常'
    }
}

function checkCode(res) {
    // 404
    if (res.status === -404) {
        console.log(res.msg)
    }
    // 后端异常根据情况添加

    return res
}

export default {
    post(url, data) {
        // let encryptData = jse.encrypt(data);
        return requestor.post(url, data).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    get(url, params) {
        return requestor.get(url, params).then(
            (response) => {
                return checkStatus(response)
            }
        ).then(
            (res) => {
                return checkCode(res)
            }
        )
    },
    requestor: requestor
}