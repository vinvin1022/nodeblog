const jsonwebtoken = require('jsonwebtoken')
module.exports = function (req, res, next) {
    let token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers.token
    // jsonwebtoken.verify(token, 'guosheng', (err, decoded) => {
		// 	if (err) {
		// 			res.json({
		// 					status: 'fail',
		// 					code: 900401,
		// 					text: '登录失效，请重新登录',
		// 					data: null
		// 			})
		// 			return false
		// 	}
		// 	console.log(decoded)
		// 	next()
		// })
		
		if(!req.session.userInfo){
			res.json({
					status: 'fail',
					code: 900401,
					text: '登录失效，请重新登录',
					data: null
			})
			return false
		}
		next()
   
}