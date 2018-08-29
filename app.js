var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const verifyToken = require('./verifyToken')
const routerConfig = require('./routes')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用 session 中间件
app.use(session({
  store: new MongoStore({
    url: 'mongodb://localhost:27017/sessionblog',
    'collection':'sessions',// 存在哪个集合里，默认为sessions	
    //'ttl':10, // session过期时间
    'autoRemove': 'native',// mongo2.2+自动移除过期的session，disable为禁用
    //'autoRemoveInterval': 10, //移除过期session间隔时间,默认为10分钟
    //'touchAfter': 24 * 3600 //同步session间隔，默认每次请求都会同步到数据库
  }),
  name:'sessionid',
  cookie: { maxAge: null }, //默认1小时  单位秒
  secret: 'sessionblog',
  resave: false,    // true强制更新 session
  saveUninitialized: false,  // 设置为 false，强制创建一个 session，即使用户未登录
  rolling:true // 如果未true 每请求一次重新设置过期时间
}));

// app.use(verifyToken)

routerConfig(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
