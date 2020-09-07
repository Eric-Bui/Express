const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  orderId: String,
  name: String,
  email: String,
  phone: String,
  address: String,
  description: String,
  amount: Number,
  createDate: String,
  status: Number,
  bankCode: String,
  payment_method: Number,
});

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transaction"
);

module.exports = Transaction;
