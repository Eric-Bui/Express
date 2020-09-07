const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const Categories = mongoose.model("Categories", categoriesSchema, "categories");

module.exports = Categories;
