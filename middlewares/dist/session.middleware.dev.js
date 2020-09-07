"use strict";

var shortid = require("shortid");

var Cart = require("../models/cart/cart.model");

var Users = require("../models/users/users.model");

module.exports = function (req, res, next) {
  if (!req.signedCookies.sessionId) {
    var sessionId = shortid.generate();
    res.cookie("sessionId", sessionId, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000) // 1 week

    });
    var user = new Users();
    user.sessionId = sessionId;
    user.save();
    console.log(user);
  }

  next();
};