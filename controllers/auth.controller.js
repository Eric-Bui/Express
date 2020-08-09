const Users = require("../models/users/users.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postlogin = async (req, res) => {
  const user = await Users.findOne({ email: req.body.email }).exec();
  if (user == null) {
    res.render("auth/login", {
      errors: ["email does not exist"],
      values: req.body,
    });

    return;
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errors: ["Wrong password."],
      });
      return;
    }
  } catch {
    res.status(500).send();
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
