const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  status: Number,
  cart: {},
  payment_method: Number,
  totalPrice: Number,
  totalQty: Number,
  createDate: String,
  status: Number,
});

const Order = mongoose.model("Order", orderSchema, "order");

module.exports = Order;
