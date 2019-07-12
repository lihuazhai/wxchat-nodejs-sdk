/**
 * @file 微信接口请求配置文件
 */
module.exports = {
    grant_type: 'client_credential',
    appid: 'wxf4c64eee773f85f1', 
    mch_id:'1511690841',
    secret: '3b23df57ba7c1bb7b88e5c54e7d6c3c9',  
    noncestr: 'Wm3WZYTPz0wzccnW',
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token', //获取access_token
    ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket', //获取jsapi_ticket地址
    cache_duration: 1000 * 60 * 60 * 2 //缓存时长为2小时
}