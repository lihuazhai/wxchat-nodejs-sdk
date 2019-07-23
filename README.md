# 微信开发 nodejs SDK（开发工具包）

一个基于nodejs服务的快速开发工具库，提供了微信open api接口的封装.
申请地址：https://mp.weixin.qq.com/ 

## 依赖 jest 

## 功能
* <s>jssdk 初始化</s>

* <s>H5页面微信拍照，图片上传</s>

* H5页面微信登陆 

* H5页面微信支付

* 微信分享

## 效果演示

> H5页面调用微信jssdk,实现拍照，选择相册的图片,用微信扫描打开

![wxchatSdkDemo](http://www.lihuazhai.com/public/wxchatSdkDemo.jpg)

## 组件使用

1、组件安装
> npm i -S wxchat-nodejs-sdk

2、数组引入

```javascript
const WxchatSdk = require('wxchat-nodejs-sdk');
const wxSdk = new WxchatSdk(AppID,AppSecret);
//AppID,AppSecret替换为自己申请得到的值
```
3、获取签名
```javascript
router.get('/getSign', async function (ctx, next) {
    let pageUrl = ctx.query.url;
    try {
        let pageUrl = ctx.query.url;
        const res = await wxSdk.getSign(pageUrl);
        ctx.response.type = 'json';
        ctx.body = { "succee": true, content: { ...res } };
    } catch (e) {
        ctx.response.type = 'json';
        ctx.body = { "succee": false, "msg": "获取是失败" };
    }
});
```

> 注意：pageUrl 是当前前端页面的url,（如：zhuan.lihuazhai.com/buy/ ）,非请求的API接口。

## 联系我们

>如遇到使用问题，或是有其他功能需求，可以联系我们。QQ群：28861454，加时备注"微信sdk"。

![QQjishuQun](http://www.lihuazhai.com/public/QQjishuQun.png)