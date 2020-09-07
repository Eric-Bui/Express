const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  idCat: String,
  name: String,
  price: Number,
  price_input: Number,
  qty: Number,
  description: String,
  images: [],
  image_link: String,
  view: Number,
  dateCreate: String,
  active: Boolean,
});

const Products = mongoose.model("Products", productSchema, "products");

module.exports = Products;
