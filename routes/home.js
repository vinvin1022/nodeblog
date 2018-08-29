const express = require('express');
const router = express.Router();
const loginCtroller = require('../controller/login')
const homeCtroller = require('../controller/home')
const verifyToken = require('../verifyToken')

/* GET home page. */
router.get('/', homeCtroller.index);
router.post('/getUserList',[verifyToken], homeCtroller.getUserList);

router.get('/register', function(req, res, next) {
  res.render('login/register', { title: '注册' });
});
router.post('/register', loginCtroller.register);
router.get('/login', function(req, res, next) {
  res.render('login/login', { title: '登录'});
});
router.post('/logout',loginCtroller.logout)
router.post('/login', loginCtroller.login);

module.exports = router