const Products = require("../models/products/products.model");
const Categories = require("../models/products/catagories.model");
const Items = require("../models/cart/items.model");
const Cart = require("../models/cart/cart.model");

module.exports.products = (req, res) => {
  Products.find((err, products) => {
    if (err) {
      res.json({ Error: err });
    } else {
      res.json(products);
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

module.exports.productbyId = (req, res) => {
  Products.findById(req.params.id, (err, product) => {
    if (err) {
      res.json({ Mgs: err });
    } else {
      res.json(product);
    }
  });
};

//get info cart
module.exports.cart = (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  Cart.findOne({ sessionId: sessionId }, (err, cart) => {
    res.json(cart);
  });
};

//add to cart
module.exports.addToCart = async (req, res) => {
  const productId = req.params.productId;
  const sessionId = req.signedCookies.sessionId;

  const client = await Cart.findOne({ sessionId: sessionId });
  const cart = new Items(client ? client : {});
  Products.findById(productId, (err, product) => {
    if (err) {
      return res.send(err);
    }
    cart.add(product, product.id);

    const items = cart.items;
    Cart.findOneAndUpdate(
      { sessionId: sessionId },
      {
        $set: {
          cart: items,
          totalQty: cart.totalQty,
          totalPrice: cart.totalPrice,
        },
      },
      { new: true },
      (err, data) => {
        res.json(data);
      }
    );
  });
};
