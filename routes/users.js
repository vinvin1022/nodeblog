var express = require('express');
var router = express.Router();
const homeCtroller = require('../controller/home')
const verifyToken = require('../verifyToken')


// 获取用户列表
router.post('/getUserList',[verifyToken], homeCtroller.getUserList);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
