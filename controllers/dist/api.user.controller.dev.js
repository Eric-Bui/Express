"use strict";

var date = require("date-and-time");

var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

require("dotenv").config();

require("../handlers/mongo");

var Users = require("../models/users/users.model");

var nodemailer = require("nodemailer");

var handlebars = require("handlebars");

var fs = require("fs");

exports.profile = function (req, res) {
  var UserId = req.params.id;
  Users.findById(UserId, function (err, user) {
    res.json(user);
  });
};

module.exports.login = function _callee(req, res) {
  var sessionId, user, token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sessionId = req.signedCookies.sessionId;
          _context.next = 3;
          return regeneratorRuntime.awrap(Users.findOne({
            email: req.body.email
          }).exec());

        case 3:
          user = _context.sent;

          if (!(user == null)) {
            _context.next = 7;
            break;
          }

          res.json({
            err: "Tên đăng nhập không đúng!"
          });
          return _context.abrupt("return");

        case 7:
          _context.prev = 7;
          _context.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 10:
          if (!_context.sent) {
            _context.next = 19;
            break;
          }

          token = jwt.sign({
            _id: user._id
          }, process.env.JWT_SECRET); //delete documents when not logged in

          Users.findOneAndDelete({
            sessionId: sessionId
          }).exec();
          res.clearCookie("sessionId"); //delete cookies when not logged in
          //set cookies form database when user logged

          res.cookie("sessionId", user.sessionId, {
            signed: true,
            httpOnly: true
          });
          res.cookie("token", token);
          res.json(user);
          _context.next = 21;
          break;

        case 19:
          res.send({
            err: "Mật khẩu không đúng!"
          });
          return _context.abrupt("return");

        case 21:
          _context.next = 26;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](7);
          res.status(500).send();

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 23]]);
};

module.exports.signup = function _callee3(req, res) {
  var sessionId;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          sessionId = req.signedCookies.sessionId;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Users.findOne({
            email: req.body.email
          }, function _callee2(err, user) {
            var hashedPassword, day, member, token;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!user) {
                      _context2.next = 5;
                      break;
                    }

                    res.json({
                      err: "Tên đăng nhập đã tồn tại!"
                    });
                    return _context2.abrupt("return");

                  case 5:
                    _context2.next = 7;
                    return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

                  case 7:
                    hashedPassword = _context2.sent;
                    day = date.format(new Date(), "DD-MM-YYYY");
                    _context2.next = 11;
                    return regeneratorRuntime.awrap(Users.findOneAndUpdate({
                      sessionId: sessionId
                    }, {
                      $set: {
                        email: req.body.email,
                        password: hashedPassword,
                        dayCreate: day
                      },
                      $unset: {
                        expireAt: 1
                      }
                    }, function (err, user) {}));

                  case 11:
                    member = _context2.sent;
                    token = jwt.sign({
                      _id: member._id
                    }, process.env.JWT_SECRET);
                    res.cookie("token", token);
                    res.json(member);

                  case 15:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //send mail reset password


var readHTMLFile = function readHTMLFile(path, callback) {
  fs.readFile(path, {
    encoding: "utf-8"
  }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

module.exports.sendEmail = function _callee4(req, res) {
  var email, user, transporter;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.body.email;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Users.findOne({
            email: email
          }));

        case 3:
          user = _context4.sent;

          if (!user) {
            res.json({
              err: "Địa chỉ email không tồn tại!"
            });
          } else {
            transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
              }
            }); //PASSWORD=lgesuxvcucenwrki

            readHTMLFile("./public/pages/email.html", function (err, html) {
              var template = handlebars.compile(html);
              var htmlToSend = template();
              var mailOptions = {
                from: "<noreply@milcah.com>",
                to: user.email,
                subject: "Cài lại mật khẩu Milcah của bạn",
                html: htmlToSend
              }; //Nodemailer SendMail

              transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                  res.json(err);
                } else {
                  console.log("Email sent :" + info.response);
                }
              });
            });
          }

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};