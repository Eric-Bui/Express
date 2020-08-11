const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  sessionId: String,
  cart: {},
  totalQty: Number,
  totalPrice: Number,
});

const cart = mongoose.model("cart", cartSchema, "cart");

module.exports = cart;
