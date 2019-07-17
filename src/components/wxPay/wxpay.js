const request = require('./node_modules/request');
//var xmlreader = require("");
const fs = require("fs");
const config = require('./wechat.cfg');
const util = require('./util');
var xml2jsparseString = require('./node_modules/xml2js').parseString;

var WxPay = {
    order: function ({ body, openid, out_trade_no, money, notify_url }) {
        let appid = config.appid;
        let mch_id = config.mch_id;
        //let nonce_str = util.createNonceStr() ;
        let nonce_str = "erfzwrje15l";
        let total_fee = util.getmoney(money);
        let timeStamp = util.createTimeStamp();
        let spbill_create_ip = "116.237.29.106";
        let trade_type = 'JSAPI';
        let mchkey = 'tong0115tong01150115tong0115tong';

        //console.log('传过来的参数是', out_trade_no + '----' + money + '----' + mch_id);

        let sign = util.paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey);

        //console.log('sign==', sign);
        //组装xml数据
        var formData = "<xml>";
        formData += "<appid>" + appid + "</appid>"; //appid 
        formData += "<body>" + body + "</body>";
        formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号 
        formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。 
        formData += "<notify_url>" + notify_url + "</notify_url>";
        formData += "<openid>" + openid + "</openid>";
        formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
        formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
        formData += "<total_fee>" + total_fee + "</total_fee>";
        formData += "<trade_type>" + trade_type + "</trade_type>";
        formData += "<sign>" + sign + "</sign>";
        formData += "</xml>";

        console.log('formData===', formData);

        var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";

        // 返回 promise 对象
        return new Promise(function (resolve, reject) {
            request({
                url: url,
                method: 'POST',
                body: formData
            }, function (err, response, body) {
                if (!err && response.statusCode == 200) {

                    console.log(body);
                    var prepay_id = '';
                    // 微信返回的数据为 xml 格式， 需要装换为 json 数据， 便于使用
                    xml2jsparseString(body, { async: false }, function (error, result) {
                        prepay_id = result.xml.prepay_id[0];
                        // 放回数组的第一个元素

                        //签名 
                        var _paySignjs = util.paysignjsapifinal(appid, timeStamp, nonce_str, prepay_id, mchkey);
                        var args = {
                            appId: appid,
                            timeStamp: timeStamp,
                            nonceStr: nonce_str,
                            signType: "MD5",
                            prepay_id: prepay_id,
                            paySign: _paySignjs
                        };
                        //console.log(args);
                        //将预支付订单和其他信息一起签名后返回给前端
                        resolve(args);
                    });
                } else {
                    reject(body);
                }
            });
        })

    },
    //支付回调通知 
    notify: function (obj) {
        var output = "";
        if (obj.return_code == "SUCCESS") {
            var reply = {
                return_code: "SUCCESS",
                return_msg: "OK"
            };

        } else {
            var reply = {
                return_code: "FAIL",
                return_msg: "FAIL"
            };
        }
        return output;
    }

}

module.exports = WxPay;

