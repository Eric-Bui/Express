"use strict";

var mongoose = require("mongoose");

var usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  sessionId: String,
  cart: {},
  totalQty: Number,
  totalPrice: Number,
  dayCreate: String,
  expireAt: {
    type: Date,
    "default": Date.now
  }
});
usersSchema.index({
  expireAt: 1
}, {
  expireAfterSeconds: 86400
});
var users = mongoose.model("users", usersSchema, "users");
module.exports = users;