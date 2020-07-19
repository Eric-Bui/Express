const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	fullname: String,
	username: String,
	password: String,
	avatar: String,
});

const users = mongoose.model('users', usersSchema, 'users');

module.exports = users;
