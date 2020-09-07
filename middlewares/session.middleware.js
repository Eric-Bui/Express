const shortid = require("shortid");
const Cart = require("../models/cart/cart.model");
const Users = require("../models/users/users.model");

module.exports = (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    const sessionId = shortid.generate();
    res.cookie("sessionId", sessionId, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 1 week
    });
    const user = new Users();
    user.sessionId = sessionId;
    user.save();
    console.log(user);
  }
  next();
};
