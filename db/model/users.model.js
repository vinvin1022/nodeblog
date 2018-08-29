const mongoose = require('../config');
let userSchema = new mongoose.Schema({
    memberCellphone: { type: String },
    userName: { type: String },
    email: { type: String },
    loginPwd: { type: String},
    regIp: {type:String},
    loginIp: {type:String}
});

//生成一个具体user的model并导出
//第一个参数是集合名，在数据库中会自动加s
//把Model名字字母全部变小写和在后面加复数s
let user = mongoose.model('user', userSchema);
module.exports = user;