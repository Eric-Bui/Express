const shortid = require("shortid");
const Cart = require("../models/cart/cart.model");

module.exports = (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    const sessionId = shortid.generate();
    res.cookie("sessionId", sessionId, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 1 week
    });
    const cart = new Cart();
    cart.sessionId = sessionId;
    cart.save();
    console.log(cart);
  }
  next();
};
