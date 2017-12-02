const Koa = require("koa");
const Router = require("koa-router");
const mongoose = require("mongoose");
const secret='my secret';
const jwt = require('jsonwebtoken');

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
db.once("open", function(params) {
  console.log("hello mongo");
});

const app = new Koa();
const router = new Router();

app.use(function(ctx, next){
    return next().catch((err) => {
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
    });
});

const token = jwt.sign({
  data: {name:'zchi'},
  exp: Math.floor(Date.now() / 1000) + (60 * 60)
}, secret);

router.get("/", async (ctx, next) => {
  ctx.body = "Index";
  jwt.verify(token, secret, function(err, decoded) {
      ctx.body =JSON.stringify(decoded) // bar
  });
  await next();
});

router.get("/hello", async (ctx, next) => {
  ctx.body = "DATA : \n";
  await analysis.find(function(err, data) {
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
