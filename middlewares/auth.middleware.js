const db = require("../db");
const Users = require("../models/users/users.model");

module.exports.requireAuth = (req, res, next) => {
  console.log(res.signedCookies);
  if (!req.signedCookies.sessionId) {
    res.redirect("/auth/login");
    return;
  }
  const user = db.get("users").find({ id: req.signedCookies.userId }).value();

  if (!user) {
    res.redirect("/auth/login");
    return;
  }
  res.locals.user = user;

  next();
};
