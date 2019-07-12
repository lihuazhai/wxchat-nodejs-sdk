/**
 * @file 微信服务
 */
'use strict';
const Router = require('koa-router');
var sha1 = require('node-sha1');
const takenServer = require('../components/wechatTaken/getToken');
const wxpay = require('../components/wxpay/wxpay');
const router = new Router();

var xml2jsparseString = require('xml2js').parseString;

//微信服务验证
router.get('/checkSignature', async function (ctx, next) {
    const token = 'wutongxia';
    let { signature, timestamp, nonce, echostr } = ctx.request.query;

    let tmpArr = new Array(token, timestamp, nonce);
    tmpArr.sort();
    var tmpStr = tmpArr.join("");
    tmpStr = sha1(tmpStr);

    if (tmpStr == signature) {
        ctx.body = echostr;
    } else {
        ctx.body = "error";
    }
});

router.get('/getToken', async function (ctx, next) {
    try {
        let url = ctx.request.query.url;
        //const res = await takenServer.sign('http://zhuan.lihuazhai.com:3003/sell/add');
        //const res = await takenServer.sign('http://zhuan.lihuazhai.com:8081/sell/add');
        const res = await takenServer.sign(url);
        ctx.response.type = 'json';
        ctx.body = db.createResponse(res);
    } catch (e) {
        //console.log(e);
        ctx.response.type = 'json';
        ctx.body = db.createResponse(e);
    }
});

//微信支付
router.post('/payment', async function (ctx, next) {
    let { openid, orderId } = ctx.request.body;
    //const orderMsg = await goodsModel.getOrderMsgData(orderId);
    var argumentObj = {
        openid: openid,
        body: orderMsg.goods_name,
        out_trade_no: orderMsg.order_number, //订单号
        money: orderMsg.amount,
        notify_url: "http://zhuan.lihuazhai.com/api/weixin/wxpay/notify"//支付通知地址 
    }
    console.log(argumentObj);
    let obj = await wxpay.order(argumentObj);//统一下单

    ctx.response.type = 'json';
    ctx.body = db.createResponse(obj);
});

//微信回调通知 采用数据流形式读取微信返回的xml数据 
router.get('/wxpay/notify', function (ctx, next) {
    //console.log(ctx);
    xml2jsparseString(ctx, { async: false }, function (error, result) {
        console.log("result", result);
        console.log("result.xml", result.xml);
        if (!error) {
            if (result.xml.return_code == 'FAIL') {
                ctx.status = 200
                ctx.body = '<xml><return_code><![CDATA[FAIL]]></return_code></xml>'
                return;
            } else if (result.xml.return_code == 'SUCCESS' && result.xml.return_msg == 'ok') {
                let { appid, mch_id, openid, out_trade_no, total_fee } = result.xml;
                //校验
                //let flag = weixinCon.checkWxPayResult({ appid, mch_id, openid, out_trade_no, total_fee });

                if (flag) {
                    ctx.status = 200
                    ctx.body = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'
                    return;
                } else {
                    ctx.status = 200
                    ctx.body = '<xml><return_code><![CDATA[FAIL]]></return_code></xml>'
                    return;
                }
            }
        } else {
            console.log('解析错误!');
        }
    });
});

module.exports = router;