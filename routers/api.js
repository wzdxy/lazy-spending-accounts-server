const Router = require("koa-router");
const User = require('./../models/user');
const md5=require('js-md5');

const api = new Router();
api.post("/signup", async (ctx,next) => {
    let req = JSON.parse(ctx.request.body);
    if (req.username && req.password) {
        let isExist = await User.isExist({username: req.username});
        if(isExist){
            ctx.body=JSON.stringify({code:-1,message:'username exist'});
        }else {
            let user=new User({
                username: req.username,
                password: md5(req.password),
                token: '',
                createTime: new Date().getTime()
            });
            let result=await user.save();
            if(result.error){
                ctx.body=JSON.stringify({code:-2,message:'failed'});
            }else{
                ctx.body = JSON.stringify({code: 0, message: 'sign up success'});
            }
        }
    }
});


api.post("/login", async (ctx, next) => {
    let req = JSON.parse(ctx.request.body);
    if (req.id && req.pw) {
        console.log(req);
    }
    ctx.body = JSON.stringify({code: 0, message: 'login ok'});
});

api.get("/hello", async (ctx, next) => {
    ctx.body = "DATA : \n";
    await analysis.find(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
        ctx.body += JSON.stringify(data, null, 4);
        next();
    });
    ctx.body += "<br/> END";
});

module.exports = api;

