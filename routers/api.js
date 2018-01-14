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
                ctx.body = JSON.stringify({code: 0, message: 'sign up success',token:token,email:req.email});
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

api.post("/sync", async (ctx, next) =>{
    let req = ctx.request.body;
    console.log(req);
    let user = ctx.state.currentUser;
    let idListHasSync = [];
    if(req.hasOwnProperty('list') && req.list.length){
        let listForSync = JSON.parse(req.list);
        let modifyList = listForSync.filter((i)=>i.status===2 || i.status===1); // 修改和删除
        let addList = listForSync.filter((i)=>i.status===0);        // 新增
        modifyList.forEach((item)=>{
            for(let i=user.account.length-1;i>=0;i--){
                let existItem=user.account[i];
                if(item.id===existItem.id){
                    Object.assign(existItem,item);
                    idListHasSync.push(item.id);
                    break;
                }
            }
        });
        addList.map((item)=>{
            user.account.push(item);
            idListHasSync.push(item.id);
        });
    }
    ctx.body = JSON.stringify({code: 0, message: 'get sync request',syncList:idListHasSync});
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

