const express = require('express');
const router = express.Router();
const loginCtroller = require('../controller/login')
const homeCtroller = require('../controller/home')



/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('error')
});



module.exports = router