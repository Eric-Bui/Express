const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dayCreate: String,
  expireAt: {
    type: Date,
    default: Date.now,
  },
});
usersSchema.index({ expireAt: 1 }, { expireAfterSeconds: 86400 });

const users = mongoose.model("users", usersSchema, "users");

module.exports = users;
