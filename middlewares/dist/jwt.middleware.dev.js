"use strict";

var jwt = require("jsonwebtoken");

require("dotenv").config();

var Users = require("../models/users/users.model");

module.exports.jwtClient = function _callee2(req, res, next) {
  var token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(req.cookies && req.headers)) {
            _context2.next = 5;
            break;
          }

          token = req.cookies.token;
          jwt.verify(token, process.env.JWT_SECRET, function _callee(err, authData) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Users.findOne({
                      _id: authData
                    }).exec());

                  case 2:
                    if (!err) {
                      _context.next = 6;
                      break;
                    }

                    return _context.abrupt("return", res.json(err));

                  case 6:
                    next();

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          _context2.next = 6;
          break;

        case 5:
          return _context2.abrupt("return", res.json(err));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.jwt = function _callee4(req, res, next) {
  var token;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(req.cookies && req.headers)) {
            _context4.next = 5;
            break;
          }

          token = req.cookies.token;
          jwt.verify(token, process.env.JWT_SECRET, function _callee3(err, authData) {
            var user;
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return regeneratorRuntime.awrap(Users.findOne({
                      _id: authData
                    }).exec());

                  case 2:
                    user = _context3.sent;

                    if (!err) {
                      _context3.next = 7;
                      break;
                    }

                    return _context3.abrupt("return", res.redirect("/auth/login"));

                  case 7:
                    res.locals.user = user;
                    next();

                  case 9:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });
          _context4.next = 6;
          break;

        case 5:
          return _context4.abrupt("return", res.redirect("/auth/login"));

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};