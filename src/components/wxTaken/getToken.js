/**
 * @file 微信接口token生产
 */
const https = require('https');
const querystring = require("querystring");
const cache = require('memory-cache');
const sha1 = require('sha1');
const config = require('./wechat.cfg');

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
 *  获取微信签名所需的access_token
 */
var getAccessToken = async function () {
    var accessToken = {
        token: '',
        expiresIn: 0
    }

    var param = {
        grant_type: 'client_credential',
        appid: config.appid,
        secret: config.secret
    };
    var qs = querystring.stringify(param);
    var url = config.accessTokenUrl + '?' + qs;
    var result = JSON.parse(await request(url));

    if (result.access_token) {
        accessToken.token = result.access_token;
        accessToken.expiresIn = result.expires_in * 1;
        return accessToken;
    } else {
        throw new Error(JSON.stringify(result));
        //console.error(`获取微信access_token错误：${JSON.stringify(result)}`)
    }
}

/**
 * 获取微信签名所需的ticket
 */
var getTicket = async function () {
    var jsapiTicket = {
        ticket: '',
        expiresIn: 0,
        access_token: ''
    }
    var access_token = (await getAccessToken()).token;
    //console.log(access_token);
    var qs = querystring.stringify({
        access_token: access_token,
        type: 'jsapi'
    });
    var result = JSON.parse(await request(config.ticketUrl + '?' + qs));
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

exports.sign = function (url) {
    return new Promise(async (resolve, reject) => {
        var noncestr = config.noncestr,
            timestamp = Math.floor(Date.now() / 1000), //精确到秒
            jsapi_ticket, access_token;

        if (cache.get('ticket')) {
            jsapi_ticket = cache.get('ticket');
            access_token = cache.get('access_token');
            resolve({
                appId: config.appid,
                timestamp: timestamp,
                noncestr: noncestr,
                access_token: access_token,
                jsapi_ticket: jsapi_ticket,
                signature: sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
            });
        } else {
            var ticketObj = await getTicket();
            cache.put('ticket', ticketObj.ticket, config.cache_duration, function () {
                //console.log('值已经过期了!')
            });
            cache.put('access_token', ticketObj.access_token, config.cache_duration, function () {
                //console.log('值已经过期了!')
            });
            var signature = sha1('jsapi_ticket=' + ticketObj.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
            resolve({
                appId: config.appid,
                timestamp: timestamp,
                noncestr: noncestr,
                access_token: ticketObj.access_token,
                jsapi_ticket: ticketObj.ticket,
                signature: signature
            });
        }

    });

}

exports.getToken = function () {
    return new Promise(async (resolve, reject) => {
        var noncestr = config.noncestr,
            timestamp = Math.floor(Date.now() / 1000), //精确到秒
            access_token;

        if (cache.get('access_token')) {
            access_token = cache.get('access_token');
            resolve({
                appId: config.appid,
                timestamp: timestamp,
                noncestr: noncestr,
                access_token: access_token
            });
        } else {
            var access_token = await getAccessToken().token;
            cache.put('access_token', access_token, config.cache_duration, function () {
                //console.log('值已经过期了!')
            });
            resolve({
                appId: config.appid,
                timestamp: timestamp,
                noncestr: noncestr,
                access_token: access_token,
            });
        }
    });
}