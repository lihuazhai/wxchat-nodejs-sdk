/**
 * @file wxJsSdk
 */

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
            opt.success(JSON.parse(xmlHttp.responseText));
        }
    };
}

/**
 * 微信初始化
 */
let init = (url) => {
    ajax({
        url: '/api/weixin/getSign', //请求后端接口获取签名
        data: { url: url },
        method: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            const { appId, timestamp, noncestr, signature } = data.content;
            wx.config({
                debug: false,//调试模式   当为true时，开启调试模式 
                appId: appId,
                timestamp: timestamp,//签名时间戳
                nonceStr: noncestr, //生成签名的随机串，注意前端字段名称为nonceStr，S要大写，值和就是后端返回来值一样
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
                console.log('wx init success');
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

/** 
 * 调起相册和拍照
*/
function takePicture(params) {
    console.log(wx);
    // wx.chooseImage({
    //     count: 8, // 张数， 默认9
    //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //     success: function (res) {
    //         var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片；
    //         // wxuploadImage(localIds);//上传图片到微信服务器, 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片,同时设置state
    //     },
    //     fail: function (res) {
    //         console.log('操作提示：fail', JSON.stringify(res));
    //     },
    //     complete: function () {
    //         console.log('complete');
    //     }
    // });
}

/**
 * 
 * @param {String} localId 
 */
function asyncFunc(localId) {
    return new Promise(function (resolve, reject) {
        wx.uploadImage({
            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得  
            isShowProgressTips: 1, // 默认为1，显示进度提示  
            success: function (res) {
                resolve(res.serverId);
            },
            fail: function (error) {
                console.error(JSON.stringify(error));
                reject(error);
            }
        });
    });
}

/**
 * 
 * @param {Array} localIds  本地图片ID列表 
 */
// async function wxuploadImage(localIds){
//     var imgArray = [];
//     for (let i = 0; i < localIds.length; i++) {
//         let serverId = await asyncFunc(localIds[i]);
//         let imgObj = {
//             localId: localIds[i],
//             serverId: serverId
//         }
//         imgArray.push(imgObj);
//     }
// }

/**
 * [previewImage 预览图片]
 * @param  {[type]} e
 * @return {[type]}   [description]
 */
// function previewImage(e) {
//     var e = e || window.event;
//     var curImageSrc = $(e.target).attr('src');
//     var oParent = $(this).parent();
//     var imgArray = this.state.imgArray;
//     var urlList = [];
//     imgArray.map(function (item) {
//         urlList.push(item.localId);
//     })
//     wx.previewImage({
//         current: curImageSrc,
//         urls: urlList
//     });
// }

export { init, takePicture };