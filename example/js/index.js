/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 * ajax({
 *   method: 'POST',
 *   url: 'test.php',
 *   data: {
 *      name1: 'value1',
 *      name2: 'value2'
 *  },
 * success: function (response) {
 *    console.log(response)；
 * }
 * });
 */
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () { };
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    } var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}


wechatInit = () => {
    $.ajax({
        url: '/api/weixin/getToken',
        data: { url: url },
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            var appId = data.content.appId;
            var timestamp = data.content.timestamp;
            var nonceStr = data.content.noncestr;
            var signature = data.content.signature;
            wx.config({
                debug: false,//调试模式   当为true时，开启调试模式 
                appId: appId,
                timestamp: timestamp,//签名时间戳
                nonceStr: nonceStr, //生成签名的随机串 
                signature: signature,//签名 
                jsApiList: [
                    'chooseImage',//拍照或从手机相册中选图接口
                    'previewImage',//预览图片接口
                    'uploadImage',//上传图片接口
                    'downloadImage',//下载图片接口
                    'openAddress',//共享地址
                    'chooseWXPay',
                    'onMenuShareTimeline'
                ]
            });
            wx.ready(function () {
                console.log('success');
            });
            wx.error(function (res) {
                console.log('fail:', res);
            });
        },
        error: function () {
            console.log("network error");
        }
    })
}