'use strict';
const fs = require('fs'); // 载入fs模块
const path = require('path');// 文件路径模块
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

const staticServe = require('koa-static');

const clientPath = path.resolve(__dirname, '../client/dist');// 返回绝对路径

//加载静态文件-网站页面
app.use(staticServe(clientPath));

router.get('/', async (ctx) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('index.html');// 返回页面文章
})

// 后端接口
const weixin = require('./router/router-weixin');
router.use('/api/weixin', weixin.routes(), weixin.allowedMethods());

app.use(router.routes(), router.allowedMethods());
app.listen(3003, () => console.log('Koa start at 3003'));