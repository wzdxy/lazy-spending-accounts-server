const Koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const koaBody = require('koa-body');

const api=require('./routers/api');

const app = new Koa();
app.use(koaBody());

const secret = 'my secret';

// 连接数据库
mongoose.connect("mongodb://localhost/ithome2");
const db = mongoose.connection;
const analysis = mongoose.model(
    "analysis",
    mongoose.Schema({
        name: String
    }),
    "analysis"
);
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function (params) {
    console.log("hello mongo");
});



// 错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err.message
        };
    }
});

// 配置跨域和返回类型
app.use(function (ctx, next) {
    ctx.type = 'json';
    ctx.set("Access-Control-Allow-Origin", "*");
    next();
});


const token = jwt.sign({
    data: {name: 'z'},
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
}, secret);

// jwt 认证
app.use(async function (ctx, next) {
    if (['/api/signup','/api/login'].includes(ctx.originalUrl)) {
        next()
    } else {
        jwt.verify('', secret, await function (err, decoded) {
            if (err) {
                ctx.status = 401;
                ctx.throw(401, 'access_denied', {});
            } else {
                next();
            }
        });
    }
});


// 挂载路由
router=new Router();
router.use('/api',api.router.routes()).use(api.router.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});


app.listen(3000);
