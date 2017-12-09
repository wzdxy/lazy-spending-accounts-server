const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    token: String,
    createTime: String
});

const User = mongoose.model('user', userSchema);

User.isExist = async function (params) {
    let data=await this.find(params);
    console.log('user.js','after find',data.length!==0);
    return data.length!==0;
};

User.verifyPassword=async function () {

};

module.exports = User;