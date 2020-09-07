const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  image: String,
});

const admin = mongoose.model("admin", adminSchema, "admin");

module.exports = admin;
