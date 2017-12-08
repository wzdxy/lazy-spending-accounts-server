const Router = require("koa-router");

const apiRouter= new Router();
apiRouter.post("/signup", async (ctx, next) => {
    let req = JSON.parse(ctx.request.body);
    if (req.id && req.pw) {
        console.log(req);
    }
    ctx.body = JSON.stringify({code: 0, message: 'sign up ok'});
});

apiRouter.post("/login", async (ctx, next) => {
    let req = JSON.parse(ctx.request.body);
    if (req.id && req.pw) {
        console.log(req);
    }
    ctx.body = JSON.stringify({code: 0, message: 'login ok'});
});

apiRouter.get("/hello", async (ctx, next) => {
    ctx.body = "DATA : \n";
    await analysis.find(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
        ctx.body += JSON.stringify(data, null, 4);
        next();
    });
    ctx.body += "<br/> END";
});

module.exports={
    router:apiRouter
};

