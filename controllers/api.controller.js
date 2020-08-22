const Products = require("../models/products/products.model");
const Categories = require("../models/products/catagories.model");

module.exports.products = (req, res) => {
  Products.find((err, products) => {
    if (err) {
      res.json({ Error: err });
    } else {
      res.json(products);
    }
  });
};

module.exports.productbyId = (req, res) => {
  Products.findById(req.params.id, (err, product) => {
    if (err) {
      res.json({ Mgs: err });
    } else {
      res.json(product);
    }
  });
};

module.exports.categories = (req, res) => {
  Categories.find((err, categories) => {
    if (err) {
      res.json({ Error: err });
    } else {
      res.json(categories);
    }
  });
};

module.exports.categoriesbyId = (req, res) => {
  idCat = req.params.id;
  Categories.findById(idCat, (err, category) => {
    if (err) {
      res.json(err);
    } else {
      Products.find({ idCat: idCat }, (err, products) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ category, products });
        }
      });
    }
  });
};
