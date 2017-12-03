const Koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const secret = 'my secret';
const jwt = require('jsonwebtoken');
const koaBody= require('koa-body');

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

const app = new Koa();
const router = new Router();
app.use(koaBody());

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
    ctx.type='json';
    ctx.set("Access-Control-Allow-Origin", "*");
    next();
});


const token = jwt.sign({
    data: {name: 'z'},
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
}, secret);

app.use(async function (ctx, next) {
     jwt.verify('', secret,await function (err, decoded) {
        if(err){
            ctx.status=401;
            ctx.throw(401, 'access_denied', {});
        }
    });
    next()
});

router.post("/api/signup",async (ctx, next) => {
    let req=ctx.request.body;
    if(req.id && req.pw){
        console.log(req);
    }
    ctx.body=JSON.stringify({code:0,message:'ok ok ok'});
});

router.get("/hello", async (ctx, next) => {
    ctx.body = "DATA : \n";
    await analysis.find(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
        ctx.body += JSON.stringify(data, null, 4);
        next();
    });
    ctx.body += "<br/> END";
});

app.use(router.routes()).use(router.allowedMethods());

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});


app.listen(3000);
