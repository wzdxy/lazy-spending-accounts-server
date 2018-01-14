const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const md5=require('js-md5');

const userSchema = new mongoose.Schema({
    uuid: String,
    username: String,
    email: String,
    password: String,
    token: String,
    createTime: String,
    account: Array,
});

const User = mongoose.model('user', userSchema);

User.isExist = async function (params) {
    let data = await this.find(params);
    console.log('user.js', 'after find', data.length !== 0);
    return data.length !== 0;
};

User.verifyPassword = async function (params) {
    let user = await this.findOne({
        email: params.email, password: md5(params.password)
    });
    if (user) {
        await user.signToken();
        return {code: 0, token: user.token};
    }
    else return {code: -1};
};

User.prototype.signToken = async function () {
    this.token = jwt.sign({
        data: {username: this.username, email: this.email, uuid: this.uuid},
        // exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, config.secret);
    await this.save();
    return this.token;
};

User.verifyToken = async function (ctx, token) {
    try{
        let res= await jwt.verify(token, config.secret);
        if(res && res.data){
            let user = await this.findOne({uuid:res.data.uuid})
            if(user)
                return {code:0, message:"ok",user:user};
            else
                return {code:-1, message:"no user"};
        }else{
            return {code:0, message:"jwt verify error"};
        }
    }catch (e){
        return {code:-2, message:e.message|"jwt verify error"};
    }
};

module.exports = User;