const user = require('../../db/model/users.model')
const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const key = "pwd!!"


function uploadavatar(req, res, next) {
	var file = req.file;
	console.log('文件类型：%s', file.mimetype);
	console.log('原始文件名：%s', file.originalname);
	console.log('文件大小：%s', file.size);
	console.log('文件保存路径：%s', file.path);
	res.json({
		code: 200,
		text: '上传成功',
		status: 'success',
		data:{path:file.path}
	})
}

/**
 * 登陆
 * @param {请求对象} req 
 * @param {响应对象} res 
 * @param {*} next 
 */
function login(req, res, next) {
	const body = req.body;
	let loginPwd = aesEncrypt(body.loginPwd, key)
	user.findOne({
		memberCellphone: body.memberCellphone,
		loginPwd: loginPwd
	}, (err, result) => {
		if (err) {
			throw err
		}
		if (result) {
			const {
				_id,
				memberCellphone,
				userName,
				email,
				loginPwd
			} = result
			const token = jsonwebtoken.sign({
				username: userName,
				password: loginPwd
			}, 'guosheng', {
				expiresIn: body.maxAge / 1000
			}); // 单位秒
			// const token = jsonwebtoken.sign({
			//     exp: Math.floor(Date.now() / 1000) + (60),
			//     data: {userName:userName,loginPwd:loginPwd}
			//   }, 'guosheng');
			req.session.userInfo = {
				memberCellphone,
				userName,
				email
			}
			// 设置sessionid过期时间
			req.session.cookie.expires = _setExpires(req)
			res.cookie('isLogin', 1,  { 'signed': true, expires:  _setExpires(req)});



			/**
			 * Model.update(condition,doc,[options],[callback]);
			 * 参数condition：更新的条件，要求是一个对象。 
					参数doc：要更新的内容，要求是一个对象。 
					参数[options]：可选参数，要求也是一个对象。 
					参数[callback]：可选参数，要求是一个回调函数。

					[options]有效值： 
					safe ：（布尔型）安全模式（默认为架构中设置的值（true）） 
					upsert ：（boolean）如果不匹配，是否创建文档（false） 
					multi ：（boolean）是否应该更新多个文档（false） 
					runValidators：如果为true，则在此命令上运行更新验证程序。更新验证器根据模型的模式验证更新操作。 
					setDefaultsOnInsert：如果这upsert是真的，如果创建了新文档，猫鼬将应用模型模式中指定的默认值。该选项仅适用于MongoDB> = 2.4，因为它依赖于MongoDB的$setOnInsert操作符。 
					strict：（布尔）覆盖strict此更新的选项 
					overwrite： （布尔）禁用只更新模式，允许您覆盖文档（false）
			 */
			let ip = _getClientIp(req)
			user.update({memberCellphone:memberCellphone},{loginIp:ip},{multi:false,upsert: false}, (err, raw) => {
				if (err) return false;
				console.log('更新数据成功');
			})

			

			res.json({
				status: 'success',
				code: 200,
				text: '登录成功',
				data: {
					token: token,
					uid: _id,
					memberCellphone: memberCellphone,
					userName: userName,
					email: email
				}
			})
		} else {
			res.json({
				code: 90001,
				status: 'fail',
				text: '帐号与密码不一致',
				data: null
			})
		}
	})
}


/**
 * 登出
 * @param {请求对象} req 
 * @param {响应对象} res 
 * @param {*} next 
 */
function logout(req, res, next) {
	req.session.cookie.expires = new Date(Date.now() - 60);
	res.clearCookie('isLogin')

	res.json({
		code: 200,
		status: 'success',
		text: '登出成功，重新登录',
		data: null
	})
}


/**
 * 注册
 * @param {请求对象} req 
 * @param {响应对象} res 
 * @param {*} next 
 */
function register(req, res, next) {
	if (!req.body.memberCellphone || !req.body.userName || !req.body.email || !req.body.loginPwd || (req.body.loginPwd !== req.body.tooLoginPwd)) {
		res.json({
			code: 90001,
			status: 'fail',
			text: '添加失败，请正确填写相关信息',
			data: req.body
		})
		return
	}
	user.findOne({
		memberCellphone: req.body.memberCellphone
	}, (err, result) => {
		if (err) {
			return
		}

		if (!result) {
			_addUser(req, res);
		} else {
			res.json({
				code: 90003,
				status: 'fail',
				text: '添加失败，该手机号已经存在！',
				data: req.body
			})
		}
	})
}
/**
 * 加密
 * @param {加密数据} data 
 * @param {*} key 
 */
function aesEncrypt(data, key) {
	const cipher = crypto.createCipher('aes192', key);
	var crypted = cipher.update(data, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}
/**
 * 解密
 * @param {解密数据} encrypted 
 * @param {*} key 
 */
function aesDecrypt(encrypted, key) {
	const decipher = crypto.createDecipher('aes192', key);
	var decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}
/**
 * 设置过期时间
 * @param {请求对象} req 
 */
function _setExpires(req) {
	let maxAge = null
	if (req.body.maxAge) {
		maxAge = new Date(Date.now() + req.body.maxAge)
	}
	return maxAge

}

/**
 * 获取ip
 * @param {请求对象} req 
 */
function _getClientIp(req) {
	let ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress || '';
		ip = ip.match(/\d+.\d+.\d+.\d+/);
		ip = ip ? ip.join('.') : null;
		return ip
};

/**
 * 注册用户 添加到数据库
 * @param {请求对象} req 
 * @param {返回对象} res 
 */
function _addUser(req, res) {
	let loginPwd = aesEncrypt(req.body.loginPwd, key)
	let ip = _getClientIp(req)
	// req.body.loginPwd = loginPwd

	let data = {
		memberCellphone: req.body.memberCellphone,
		userName: req.body.userName,
		email: req.body.email,
		loginPwd: loginPwd,
		regIp: ip
	}
	
	user.create(data, (err, docs) => {
		if (err) {
			res.json({
				code: 90004,
				status: 'error',
				text: '添加失败',
				data: req.body
			})
			return false
		}
		res.json({
			code: 200,
			status: 'success',
			text: '添加成功',
			data: req.body
		})
	})

	// let addUser = new user(data)
	// addUser.save((err) => {
	// 	if (err) {
	// 		res.json({
	// 			code: 90004,
	// 			status: 'error',
	// 			text: '添加失败',
	// 			data: req.body
	// 		})
	// 		return false
	// 	}
	// 	res.json({
	// 		code: 200,
	// 		status: 'success',
	// 		text: '添加成功',
	// 		data: req.body
	// 	})
	// })
}

module.exports = {
	login,
	register,
	logout,
	uploadavatar
}