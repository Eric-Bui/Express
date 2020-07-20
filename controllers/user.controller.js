const db = require('../db');
const shortid = require('shortid');
const date = require('date-and-time');
const bcrypt = require('bcrypt');

const cloudinary = require('cloudinary');
require('../handlers/mongo');
const Users = require('../models/users/users.model');

module.exports.index = (req, res) => {
	Users.find((err, data) => {
		if (err) throw err;
		res.render('users/users', {
			users: data,
		});
	});
};

module.exports.search = (req, res) => {
	const q = req.query.q;
	const matchedUsers = db
		.get('users')
		.value()
		.filter((user) => {
			return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
		});

	res.render('users/users', {
		users: matchedUsers,
		values: q,
	});
};

module.exports.view = async (req, res) => {
	await Users.findById(req.params.id, (err, data) => {
		if (err) {
			res.json({ Mgs: err });
		} else {
			res.render('users/view', { user: data });
		}
	});
};

module.exports.create = (req, res) => {
	res.render('users/create');
};

module.exports.postCreate = async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const sessionId = shortid.generate();
	const day = date.format(new Date(), 'DD-MM-YYYY');
	const fileName = day + '_' + sessionId;
	const avatar = await cloudinary.v2.uploader.upload(req.file.path, {
		public_id: `Avatar/${fileName}`,
		tags: `Avatar`,
	});

	const user = new Users();
	user.fullname = req.body.fullname;
	user.username = req.body.username;
	user.password = hashedPassword;
	user.avatar = avatar.url;
	user.save();
	res.redirect('/users');
};
