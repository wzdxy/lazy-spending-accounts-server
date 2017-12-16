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
    if (user) return {code: 0, token: user.token};
    else return {code: -1};
};

User.prototype.signToken = async function () {
    this.token = jwt.sign({
        data: {username: this.username, email: this.email, uuid: this.uuid},
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, config.secret);
    await this.save();
    return this.token;
};

User.verifyToken = async function (ctx, token) {
    jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
            ctx.status = 401;
            ctx.throw(401, 'access_denied', {});
        } else {
            if (decoded.token && decoded.email) {
                let user = await this.find({});
            }
            next();
        }
    }.bind(this));
};

module.exports = User;