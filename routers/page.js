const Router = require("koa-router");

const api = new Router();


api.get("/", async (ctx, next) => {
    ctx.body=JSON.stringify({name:'zchi'})
});

module.exports = api;

