var jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../models/users/users.model');

module.exports.jwt = async (req, res, next) => {
	if (req.cookies && req.headers) {
		const token = req.cookies.token;

		jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
			const user = await Users.findOne({ _id: authData }).exec();
			if (err) return res.redirect('/auth/login');
			else {
				res.locals.user = user;
				next();
			}
		});
	} else {
		return res.redirect('/auth/login');
	}
};
