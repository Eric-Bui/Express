const Items = require("../models/cart/items.model");
const DeleteItem = require("../models/cart/delete.model");
const UpdateItem = require("../models/cart/update.model");
const Users = require("../models/users/users.model");
const Products = require("../models/products/products.model");

//get info cart
module.exports.cart = (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  Users.findOne({ sessionId: sessionId }, (err, cart) => {
    res.json(cart);
  });
};

//add to cart
module.exports.addToCart = async (req, res) => {
  //const productId = req.params.productId;
  const params = req.params.productId;
  const productId = params.substring(0, params.length - 1);
  const qty = params.slice(params.length - 1);
  const sessionId = req.signedCookies.sessionId;

  const client = await Users.findOne({ sessionId: sessionId });
  const cart = new Items(client ? client : {});
  Products.findById(productId, (err, product) => {
    if (err) {
      return res.send(err);
    }
    cart.add(product, product.id, qty);

    const items = cart.items;
    Users.findOneAndUpdate(
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

//delete cart item
module.exports.deleteCart = async (req, res) => {
  const productId = req.params.productId;
  const sessionId = req.signedCookies.sessionId;

  const client = await Users.findOne({ sessionId: sessionId });
  const cart = new DeleteItem(client ? client : {});
  Products.findById(productId, (err, product) => {
    if (err) {
      return res.send(err);
    }
    cart.delete(product, product.id);

    const items = cart.items;
    Users.findOneAndUpdate(
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

//update cart item
module.exports.updateCart = async (req, res) => {
  const params = req.params.productId;
  const productId = params.substring(0, params.length - 1);
  const sessionId = req.signedCookies.sessionId;
  const qtyProduct = params.slice(params.length - 1);

  const client = await Users.findOne({ sessionId: sessionId });
  const cart = new UpdateItem(client ? client : {});
  Products.findById(productId, (err, product) => {
    if (err) {
      return res.send(err);
    }
    cart.update(product, product.id, qtyProduct);

    const items = cart.items;
    Users.findOneAndUpdate(
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
