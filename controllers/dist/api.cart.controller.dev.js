"use strict";

var Items = require("../models/cart/items.model");

var DeleteItem = require("../models/cart/delete.model");

var UpdateItem = require("../models/cart/update.model");

var Users = require("../models/users/users.model");

var Products = require("../models/products/products.model"); //get info cart


module.exports.cart = function (req, res) {
  var sessionId = req.signedCookies.sessionId;
  Users.findOne({
    sessionId: sessionId
  }, function (err, cart) {
    res.json(cart);
  });
}; //add to cart


module.exports.addToCart = function _callee(req, res) {
  var productId, sessionId, client, cart;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          productId = req.params.productId;
          sessionId = req.signedCookies.sessionId;
          _context.next = 4;
          return regeneratorRuntime.awrap(Users.findOne({
            sessionId: sessionId
          }));

        case 4:
          client = _context.sent;
          cart = new Items(client ? client : {});
          Products.findById(productId, function (err, product) {
            if (err) {
              return res.send(err);
            }

            cart.add(product, product.id);
            var items = cart.items;
            Users.findOneAndUpdate({
              sessionId: sessionId
            }, {
              $set: {
                cart: items,
                totalQty: cart.totalQty,
                totalPrice: cart.totalPrice
              }
            }, {
              "new": true
            }, function (err, data) {
              res.json(data);
            });
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}; //delete cart item


module.exports.deleteCart = function _callee2(req, res) {
  var productId, sessionId, client, cart;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          productId = req.params.productId;
          sessionId = req.signedCookies.sessionId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Users.findOne({
            sessionId: sessionId
          }));

        case 4:
          client = _context2.sent;
          cart = new DeleteItem(client ? client : {});
          Products.findById(productId, function (err, product) {
            if (err) {
              return res.send(err);
            }

            cart["delete"](product, product.id);
            var items = cart.items;
            Users.findOneAndUpdate({
              sessionId: sessionId
            }, {
              $set: {
                cart: items,
                totalQty: cart.totalQty,
                totalPrice: cart.totalPrice
              }
            }, {
              "new": true
            }, function (err, data) {
              res.json(data);
            });
          });

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //update cart item


module.exports.updateCart = function _callee3(req, res) {
  var params, productId, sessionId, qty, client, cart;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          params = req.params.productId;
          productId = params.substring(0, params.length - 1);
          sessionId = req.signedCookies.sessionId;
          qty = params.slice(params.length - 1);
          _context3.next = 6;
          return regeneratorRuntime.awrap(Users.findOne({
            sessionId: sessionId
          }));

        case 6:
          client = _context3.sent;
          cart = new UpdateItem(client ? client : {});
          Products.findById(productId, function (err, product) {
            if (err) {
              return res.send(err);
            }

            cart.update(product, product.id, qty);
            var items = cart.items;
            Users.findOneAndUpdate({
              sessionId: sessionId
            }, {
              $set: {
                cart: items,
                totalQty: cart.totalQty,
                totalPrice: cart.totalPrice
              }
            }, {
              "new": true
            }, function (err, data) {
              res.json(data);
            });
          });

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
};