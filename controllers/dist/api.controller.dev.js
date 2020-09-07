"use strict";

var Products = require("../models/products/products.model");

var Categories = require("../models/products/catagories.model");

module.exports.products = function (req, res) {
  Products.find(function (err, products) {
    if (err) {
      res.json({
        Error: err
      });
    } else {
      res.json(products);
    }
  });
};

module.exports.productbyId = function (req, res) {
  Products.findById(req.params.id, function (err, product) {
    if (err) {
      res.json({
        Mgs: err
      });
    } else {
      res.json(product);
    }
  });
};

module.exports.categories = function (req, res) {
  Categories.find(function (err, categories) {
    if (err) {
      res.json({
        Error: err
      });
    } else {
      res.json(categories);
    }
  });
};

module.exports.categoriesbyId = function (req, res) {
  idCat = req.params.id;
  Categories.findById(idCat, function (err, category) {
    if (err) {
      res.json(err);
    } else {
      Products.find({
        idCat: idCat
      }, function (err, products) {
        if (err) {
          res.json(err);
        } else {
          res.json({
            category: category,
            products: products
          });
        }
      });
    }
  });
};