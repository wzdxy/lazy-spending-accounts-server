const Koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const koaBody = require('koa-body');

const config=require('./config');
const api=require('./routers/api');
const page=require('./routers/page');

const app = new Koa();
app.use(koaBody());

const secret = 'my secret';
const User = require('./models/user');

// 连接数据库
mongoose.connect("mongodb://localhost/"+config.db_name);
const db = mongoose.connection;
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
        ctx.response.body = err.message || 'server error'
    }
});

// 配置跨域和返回类型
app.use(async function (ctx, next) {
    ctx.type = 'json';
    ctx.set("Access-Control-Allow-Origin", "*");
    await next();
});




// jwt 认证
app.use(async function (ctx, next) {
    if (['/api/signup','/api/login','/page'].includes(ctx.originalUrl)) {
        await next()
    } else {
        // await User.verifyToken(ctx,ctx.req.body.token);

        // jwt.verify('', secret, await function (err, decoded) {
        //     if (err) {
        //         ctx.status = 401;
        //         ctx.throw(401, 'access_denied', {});
        //     } else {
        //         next();
        //     }
        // });
    }
});


// 挂载路由
router=new Router();
router.use('/api',api.routes()).use(api.allowedMethods());
router.use('/page',page.routes()).use(page.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});


app.listen(3000);
