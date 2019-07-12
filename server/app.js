'use strict';
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

const weixin = require('./router/router-weixin');
router.use('/api/weixin', weixin.routes(), weixin.allowedMethods());
router.get('/', async (ctx) => {
    ctx.body = "首页";
})
app.use(router.routes(), router.allowedMethods());
app.listen(3004, () => console.log('Koa start at 3004'));