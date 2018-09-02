const pagination = require('pagination');
const users = require('../../db/model/users.model')

function index(req, res, next) {
	if (req.session && !req.session.userInfo) {
		res.json({
			status: 'fail',
			code: 900401,
			text: '登录失效，请重新登录',
			data: null
		})
		return
	};

	let pageNum = parseInt(req.query.pageNum || 1);
	let pageSize = req.query.pageSize || 5;


	users.count((err, count) => {
		var paginator = pagination.create('search', {
			prelink: '/',
			pageLinks: 5,
			current: pageNum,
			rowsPerPage: pageSize,
			totalResult: count
		});
		users.find({})
			.skip((pageNum - 1) * pageSize)
			.limit(pageSize)
			.exec(function (err, docs) {
				if (err) {
					return
				}
				res.render('index', {
					usersList: docs,
					title: '首页',
					pageData: paginator.getPaginationData()
				});
			});
	})
}

/**
 * 获取用户数据列表
 * @param {请求对象} req 
 * @param {响应对象} res 
 * @param {*} next 
 */
function getUserList(req, res, next) {
	console.log(req.signedCookies)
	let pageNum = parseInt(req.body.pageNum || 1);
	let pageSize = req.body.pageSize || 5;
	users.count((err, count) => {

		let paginator = pagination.create('search', {
			current: pageNum,
			rowsPerPage: pageSize, 
			totalResult: count
		});
		let pageData = paginator.getPaginationData()
		users.find({}, ['userName', 'memberCellphone', 'email','loginIp', 'regIp', 'avatarSrc'])
			.skip((pageNum - 1) * pageSize)  // 从哪条数据开始
			.limit(pageSize)         // 每一页取多少条数据
			.exec(function (err, docs) {
				if (err) {
					return
				}

				pageData.userList = docs
			
				res.json({
					status: 'success',
					code: 200,
					text: '获取成功',
					data: pageData
				})
				
			
			});
	})
}


module.exports = {
	index,
	getUserList
}