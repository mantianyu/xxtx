import axios from 'axios'
import qs from 'qs'
import store from '../store/index'

let sstore = store;

// 定义类
class ApiRequestor {
    //构造函数
    constructor(option) {
        option = option || {};
        this.baseUrl = option.baseUrl || '';//请求的基地址
        this.loginUrl = option.loginUrl || '/login'; //登录地址
        this.refreshTokenUrl = option.refreshTokenUrl || '/auth/token/refresh'; //登录地址
        this.tokenExpiredMinutes = option.tokenExpiredMinutes || 10; //token过期提前时间差，分钟。
        this.keepAlive = (typeof option.keepAlive === 'undefined') ? true : option.keepAlive === true;//登录地址
        this.storageKey = option.storageKey || option.baseUrl;
        this.axios = axios.create({
            baseURL: this.baseUrl,
            timeout: 30000
        });

        /*是否有请求正在刷新token*/
        this.isRefreshing = false;
        /*被挂起的请求数组*/
        this.refreshSubscribers = [];
        this.setRequestInterceptors();
        this.setResponseInterceptors();
        this.__token__ = null;
        this.keepAliveTimer = 0;
        if (this.keepAlive) {
            this.doKeepAlive();
        }
    };

    doKeepAlive() {
        let self = this;
        this.keepAliveTimer = window.setInterval(() => {
            try {
                let token = self.getToken();
                if (self.needRefreshToken(token)) {
                    self.doRefreshToken();
                }
            } catch (e) {
            }
        }, 10000);
    }

    /*判断token是否过期*/
    checkTokenExpired(token) {
        token = token || this.getToken();
        if (token) {
            if (token.expires_at < Date.now()) {
                this.setToken(null);
                this.pressLogin();
            }
        }
    }

    parseToken(data) {
        if (data && (typeof data.access_token !== 'undefined')) {
            let token = {};
            token.token_type = data.token_type || 'Bearer';
            token.access_token = data.access_token;
            token.expires_in = parseInt(data.expires_in) - 1;
            token.expires_at = Date.now() + token.expires_in * 1000;
            token.refresh_token = data.refresh_token;
            token.refresh_expires_in = parseInt(data.refresh_expires_in || token.expires_in * 2) - 1;
            token.refresh_expires_at = Date.now() + token.refresh_expires_in * 1000;
            this.setToken(token);
        }
    }

    /*获取token信息*/
    getToken() {
        if (this.__token__ === null) {
            let token = localStorage.getItem(this.storageKey);
            if (token) {
                this.__token__ = JSON.parse(token);
            }
        }
        return this.__token__;
    }

    setToken(token) {
        if (token) {
            this.__token__ = token;
            sstore.dispatch("token", token.access_token);
            localStorage.setItem(this.storageKey, JSON.stringify(token));
        } else {
            this.__token__ = null;
            localStorage.removeItem(this.storageKey);
        }
    }

    subscribeTokenRefresh(cb) {
        this.refreshSubscribers.push(cb)
    }

    onRefreshed(token) {
        this.refreshSubscribers.map(cb => cb(token));
        this.refreshSubscribers = [];
    }

    pressLogin() {
        window.location.href = this.loginUrl;
    }

    post(url, data) {
        data = qs.stringify(data);
        return this.axios.post(url, data, {});
    }

    get(url, data) {
        data = qs.stringify(data);
        return this.axios.get(url, data, {});
    }

    doRefreshToken() {
        if(this.isRefreshing){
            return;
        }
        this.isRefreshing = true;
        let token = this.getToken();
        if(token) {
            this.checkTokenExpired();
            this.post(this.refreshTokenUrl, {refresh_token: token.refresh_token}).then(res => {
                this.parseToken(res.data.data);
                token = this.getToken();
                /*将标志置为false*/
                this.isRefreshing = false;
                /*执行数组里的函数,重新发起被挂起的请求*/
                this.onRefreshed(token)
            }).catch(err=>{
                return err;
            });
        }
    }

    needRefreshToken(token) {
        token = token || this.getToken();
        if (token) {
            let t = token.expires_in > 120 ? 60 : 10;
            return (token.expires_at - parseInt(t + parseInt(token.expires_in) / 2) * 1000 < Date.now());
        } else {
            return false;
        }
    }

    setRequestInterceptors() {
        this.axios.interceptors.request.use(
            config => {
                let token = this.getToken();
                /*判断是否已登录*/
                if (token) {
                    this.checkTokenExpired(token);
                    /*在请求头中添加token类型、token*/
                    config.headers.Authorization = token.token_type + ' ' + token.access_token;
                    /*判断token是否将要过期*/
                    if (this.needRefreshToken(token) && config.url.indexOf(this.refreshTokenUrl) === -1) {
                        /*判断是否正在刷新*/
                        if (!this.isRefreshing) {
                            /*发起刷新token的请求*/
                            this.doRefreshToken();
                        }
                        /*把请求(token)=>{....}都push到一个数组中*/
                        return new Promise((resolve, reject) => {
                            this.subscribeTokenRefresh((token) => {
                                config.headers.Authorization = token.token_type + ' ' + token.access_token;
                                resolve(config)
                            });
                        });
                    }
                    return config
                } else {
                    /*未登录直接返回配置信息*/
                    return config
                }
            },
            /*错误操作*/
            err => {
                return Promise.reject(err)
            }
        );
    }

    setResponseInterceptors() {
        //添加响应拦截器
        this.axios.interceptors.response.use(function (response) {
            return response;
        });
    }
}

export default ApiRequestor;


