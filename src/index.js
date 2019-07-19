/**
 * @file 微信nodejs sdk
 * @author lihuazhai
 */
const https = require('https');
const querystring = require("querystring");
const cache = require('memory-cache');
const sha1 = require('sha1');

// const wxpay = require('./components/wxPay/wxpay');

// 常量
const accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token'; //获取access_token的地址
const ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'; //获取jsapi_ticket的地址

/**
 * 对https请求封装成Promise
 * @param {String} url 
 */
var request = function (url) {
    return new Promise((resole, reject) => {
        var req = https.request(url, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                resole(chunk);
            });
        });
        req.on('error', function (e) {
            reject(e);
        });
        req.end();
    });
}

/**
 *  获取微信签名所需的access_token，第一步
 */
let getAccessToken = async function (appId, secret) {
    let param = {
        grant_type: 'client_credential',
        appId: appId,
        secret: secret
    };

    let qs = querystring.stringify(param);
    let url = accessTokenUrl + '?' + qs;
    let result = JSON.parse(await request(url));

    // console.log("result",result)

    if (result.access_token) {
        return result;
    } else {
        throw new Error(JSON.stringify(result));
        //console.error(`获取微信access_token错误：${JSON.stringify(result)}`)
    }
}

/**
 * 获取微信签名所需的ticket，第二步
 */
let getTicket = async function (appId, secret) {
    let jsapiTicket = {
        ticket: '',
        expiresIn: 0,
        access_token: ''
    }
    let access_token = (await getAccessToken(appId, secret)).access_token;

    let qs = querystring.stringify({
        access_token: access_token,
        type: 'jsapi'
    });
    let result = JSON.parse(await request(ticketUrl + '?' + qs));
    //console.log(result);

    if (result.errcode == 0) {
        jsapiTicket.ticket = result.ticket;
        jsapiTicket.expiresIn = result.expires_in;
        jsapiTicket.access_token = access_token;
        return jsapiTicket;
    } else {
        throw new Error(JSON.stringify(result));
    }
}

/**
 * 微信开发库
 * @class WxchatSdk
 */
class WxchatSdk {
    constructor(appId, secret, mch_id) {
        this.appId = appId;//AppID
        this.secret = secret;//AppSecret
        this.mch_id = mch_id || '';//和appid成对绑定的支付商户号，收款资金会进入该商户号
        this.noncestr = 'Wm3WZYTPz0wzccnW';//随机生成的字符串
        this.cache_duration = 1000 * 60 * 60 * 2; //缓存时长为2小时
    }

    /**
     * 获取签名
     */
    getSign(url) {
        return new Promise(async (resolve, reject) => {
            let noncestr = this.noncestr,
                timestamp = Math.floor(Date.now() / 1000), //精确到秒
                jsapi_ticket, access_token;

            if (cache.get('ticket')) {
                jsapi_ticket = cache.get('ticket');
                access_token = cache.get('access_token');
                resolve({
                    appId: this.appId,
                    timestamp: timestamp,
                    noncestr: noncestr,
                    access_token: access_token,
                    jsapi_ticket: jsapi_ticket,
                    signature: sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                });
            } else {
                let ticketObj = await getTicket(this.appId, this.secret);
                cache.put('ticket', ticketObj.ticket, this.cache_duration, function () {
                    //console.log('值已经过期了!')
                });
                cache.put('access_token', ticketObj.access_token, this.cache_duration, function () {
                    //console.log('值已经过期了!')
                });
                let signature = sha1('jsapi_ticket=' + ticketObj.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                resolve({
                    appId: this.appId,
                    timestamp: timestamp,
                    noncestr: noncestr,
                    access_token: ticketObj.access_token,
                    jsapi_ticket: ticketObj.ticket,
                    signature: signature
                });
            }

        });
    }


    /**
     * 获取token
     */
    getToken() {
        return new Promise(async (resolve, reject) => {
            let noncestr = this.noncestr,
                timestamp = Math.floor(Date.now() / 1000), //精确到秒
                access_token;

            if (cache.get('access_token')) {
                access_token = cache.get('access_token');
                resolve({
                    appId: this.appId,
                    timestamp: timestamp,
                    noncestr: noncestr,
                    access_token: access_token
                });
            } else {
                let { access_token } = await getAccessToken(this.appId, this.secret);
                cache.put('access_token', access_token, this.cache_duration, function () {
                    //console.log('值已经过期了!')
                });
                resolve({
                    appId: this.appId,
                    timestamp: timestamp,
                    noncestr: noncestr,
                    access_token: access_token,
                });
            }
        });
    }
}

module.exports = WxchatSdk;