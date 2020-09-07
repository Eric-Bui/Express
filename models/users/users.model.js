const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  sessionId: String,
  cart: {},
  totalQty: Number,
  totalPrice: Number,
  dayCreate: String,
  name: String,
  address: String,
  phone: String,
  resetLink: String,
  expireAt: {
    type: Date,
    default: Date.now,
  },
});
usersSchema.index({ expireAt: 1 }, { expireAfterSeconds: 86400 });

const users = mongoose.model("users", usersSchema, "users");

module.exports = users;
