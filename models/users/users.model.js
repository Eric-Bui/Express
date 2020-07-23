const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dayCreate: String,
});

const users = mongoose.model("users", usersSchema, "users");

module.exports = users;
