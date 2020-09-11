const Transaction = require("../models/transaction/transaction.model");
const Order = require("../models/transaction/order.model");
const Products = require("../models/products/products.model");
const Items = require("../models/cart/items.model");

const date = require("date-and-time");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("../handlers/mongo");
const Users = require("../models/users/users.model");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

exports.profile = (req, res) => {
  const userId = req.params.id;
  Users.findById(userId, (err, user) => {
    res.json(user);
  });
};

exports.updateInfo = (req, res) => {
  const userId = req.params.id;
  const name = req.body.name;
  const address = req.body.address;
  const phone = req.body.phone;

  Users.findByIdAndUpdate(
    userId,
    {
      $set: {
        name: name,
        address: address,
        phone: phone,
      },
    },
    (err, user) => {
      res.json(user);
    }
  );
};

exports.getInfoOrder = async (req, res) => {
  const email = req.body.email;
  Transaction.find({ email: email }, (err, transaction) => {
    res.json(transaction);
  });
};

module.exports.login = async (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  const user = await Users.findOne({ email: req.body.email }).exec();
  if (user == null) {
    res.json({ err: "Tên đăng nhập không đúng!" });
    return;
  } else {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      //client before login
      const cart = new Items(user ? user : {});
      //check client exsits cart
      Users.findOne({ sessionId: sessionId }, async (err, client) => {
        if (client.cart) {
          //delete documents when not logged in
          Users.findOneAndDelete({ sessionId: sessionId }).exec();
          for (const key in client.cart) {
            const product = await Products.findById(key).exec();
            cart.add(product, product.id, client.cart[key].qty);
          }
          Users.findOneAndUpdate(
            { email: req.body.email },
            {
              $set: {
                cart: cart.items,
                totalQty: cart.totalQty,
                totalPrice: cart.totalPrice,
              },
            },
            { new: true },
            (err, data) => {}
          );
        }
        Users.findOneAndDelete({ sessionId: sessionId }).exec();
        res.clearCookie("sessionId"); //delete cookies when not logged in
        //set cookies form database when user logged
        res.cookie("sessionId", user.sessionId, {
          signed: true,
          httpOnly: true,
        });
        res.cookie("token", token);
        res.json(user);
      });
    } else {
      res.send({ err: "Mật khẩu không đúng!" });
      return;
    }
  }
};

module.exports.signup = async (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  await Users.findOne({ email: req.body.email }, async (err, user) => {
    if (user) {
      res.json({ err: "Tên đăng nhập đã tồn tại!" });
      return;
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const day = date.format(new Date(), "DD-MM-YYYY");
      const member = await Users.findOneAndUpdate(
        { sessionId: sessionId },
        {
          $set: {
            email: req.body.email,
            password: hashedPassword,
            dayCreate: day,
          },
          $unset: { expireAt: 1 },
        },
        (err, user) => {}
      );
      const token = jwt.sign({ _id: member._id }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.json(member);
    }
  });
};

//send mail reset password
const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

exports.forgotpw = async (req, res) => {
  const email = req.body.email;
  const user = await Users.findOne({ email: email });
  if (!user) {
    res.json({ err: "Địa chỉ email không tồn tại!" });
  } else {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "24h",
    });
    const url = `${process.env.CLIENT_URL}/resetpw/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    //PASSWORD=lgesuxvcucenwrki
    readHTMLFile("./public/pages/email.html", (err, html) => {
      const template = handlebars.compile(html);
      const replacements = {
        username: email,
        link: url,
      };
      const htmlToSend = template(replacements);
      const mailOptions = {
        from: "<noreply@milcah.com>",
        to: user.email,
        subject: "Cài lại mật khẩu Milcah của bạn",
        html: htmlToSend,
      };

      //Nodemailer SendMail
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.json(err);
        } else {
          console.log("Email sent :" + info.response);
          Users.findOneAndUpdate(
            { email: email },
            {
              $set: {
                resetLink: token,
              },
            },
            (err, success) => {
              if (err) {
                res.json({ err: err.message });
              }
              res.json({ success: "Vui lòng kiểm tra email" });
            }
          );
        }
      });
    });
  }
};

exports.resetpw = async (req, res) => {
  const token = req.params.token;
  const newpass = await bcrypt.hash(req.body.password, 10);
  if (token) {
    jwt.verify(token, process.env.JWT_RESET_PASSWORD, (err, data) => {
      if (err) {
        return res.json({ err: "Lỗi đường dẫn hoặc hết hạn" });
      }
      Users.findOneAndUpdate(
        { resetLink: token },
        {
          $set: {
            password: newpass,
          },
        },
        (err, user) => {
          if (err) {
            res.json({ err: "Lỗi khi đặt lại mật khẩu" });
          } else {
            res.json(user);
          }
        }
      );
    });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("sessionId");
  res.json({ note: "success" });
};
