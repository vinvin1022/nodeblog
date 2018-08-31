const express = require('express');
const router = express.Router();
const loginCtroller = require('../controller/login')
const homeCtroller = require('../controller/home')
const upload = require('../controller/login/upload')



/* GET home page. */
router.post('/logout',loginCtroller.logout)
router.post('/login', loginCtroller.login);
router.post('/register', loginCtroller.register);
router.post('/uploadavatar',upload.single('file'), loginCtroller.uploadavatar);


router.get('/', homeCtroller.index);
router.get('/register', function(req, res, next) {
  res.render('login/register', { title: '注册' });
});
router.get('/login', function(req, res, next) {
  res.render('login/login', { title: '登录'});
});


module.exports = router