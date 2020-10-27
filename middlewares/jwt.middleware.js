var jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../models/users/users.model");
const Admin = require("../models/users/admin.model");

exports.jwtClient = async (req, res, next) => {
  if (req.cookies.token && req.headers) {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
      //await Users.findOne({ _id: authData }).exec();
      if (err) return res.json(err);
      else {
        next();
      }
    });
  }
};

exports.jwtAdmin = async (req, res, next) => {
  if (req.signedCookies.id_admin && req.headers) {
    const token = req.signedCookies.id_admin;
    jwt.verify(token, process.env.JWT_ADMIN, async (err, authData) => {
      //await Admin.findOne({ _id: authData }).exec();
      if (err) return res.json(err);
      else {
        next();
      }
    });
  } else {
    return res.json(err);
  }
};

exports.jwt = async (req, res, next) => {
  if (req.cookies && req.headers) {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
      const user = await Users.findOne({ _id: authData }).exec();
      if (err) return res.redirect("/auth/login");
      else {
        res.locals.user = user;
        next();
      }
    });
  } else {
    return res.redirect("/auth/login");
  }
};
