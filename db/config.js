//引入mongoose模块
var mongoose = require('mongoose')

//数据库连接地址  链接到myStudent数据库
var DB_URL = 'mongodb://localhost:27017/blog'
//数据库连接
mongoose.connect(DB_URL)


//连接成功终端显示消息
mongoose.connection.on('connected', function () {
    console.log('mongoose connection open to ' + DB_URL)
})
//连接失败终端显示消息
mongoose.connection.on('error', function () {
    console.log('mongoose error ')
})
//连接断开终端显示消息
mongoose.connection.on('disconnected', function () {
    console.log('mongoose disconnected')
})

module.exports = mongoose;