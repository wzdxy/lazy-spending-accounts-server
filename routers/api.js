const Router = require("koa-router");
const User = require('./../models/user');
const md5=require('js-md5');
const uuid=require('uuid/v1');

const api = new Router();
api.post("/signup", async (ctx,next) => {
    let req = ctx.request.body;
    if (req.email && req.password) {
        let isExist = await User.isExist({email: req.email});
        if(isExist){
            ctx.body=JSON.stringify({code:-1,message:'email exist'});
        }else {
            let user=new User({
                uuid:uuid(),
                email:req.email,
                username: req.username||new Date().getTime(),
                password: md5(req.password),
                token: '',
                createTime: new Date().getTime()
            });
            let result=await user.save();
            if(result.error){
                ctx.body=JSON.stringify({code:-2,message:'failed'});
            }else{
                let token=await user.signToken();
                ctx.body = JSON.stringify({code: 0, message: 'sign up success',token:token});
            }
        }
    }
});


api.post("/login", async (ctx, next) => {
    let req = ctx.request.body;
    if (req.email && req.password) {
        console.log(req);
        let verifyResult=await User.verifyPassword({email:req.email,password:req.password});
        if(verifyResult.code===0){
            ctx.body = JSON.stringify({code: 0, message: 'login ok',token:verifyResult.token});
        }else{
            ctx.body = JSON.stringify({code: 400, message: 'email not exist or wrong password'});
        }
    }

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

