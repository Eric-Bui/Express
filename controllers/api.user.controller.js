const date = require("date-and-time");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cloudinary = require("cloudinary");
require("../handlers/mongo");
const Users = require("../models/users/users.model");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

module.exports.login = async (req, res) => {
  const user = await Users.findOne({ email: req.body.email }).exec();
  if (user == null) {
    res.json({ err: "Tên đăng nhập không đúng!" });
    return;
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.json(user);
    } else {
      res.send({ err: "Mật khẩu không đúng!" });
      return;
    }
  } catch {
    res.status(500).send();
  }
};

module.exports.signup = async (req, res) => {
  await Users.findOne({ email: req.body.email }, async (err, user) => {
    if (user) {
      res.json({ err: "Tên đăng nhập đã tồn tại!" });
      return;
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const day = date.format(new Date(), "DD-MM-YYYY");

      const user = new Users();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = hashedPassword;
      user.dayCreate = day;
      user.save((err, user) => {
        res.json(user);
      });
    }
  });
};

const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

module.exports.sendEmail = async (req, res) => {
  const email = req.body.email;
  const user = await Users.findOne({ email: email });
  if (!user) {
    res.json({ err: "Địa chỉ email không tồn tại!" });
  } else {
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
      const htmlToSend = template();
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
        }
      });
    });
  }
};
