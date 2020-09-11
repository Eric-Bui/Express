const Transaction = require("../models/transaction/transaction.model");
const Users = require("../models/users/users.model");

var config = require("config");
var dateFormat = require("dateformat");
var date = new Date();
var querystring = require("qs");
var sha256 = require("sha256");
const Order = require("../models/transaction/order.model");
//send mail
require("dotenv").config();
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const $ = require("jquery");

exports.getTransaction = (req, res) => {
  const orderId = req.params.orderId;
  const sessionId = req.signedCookies.sessionId;
  Users.findOneAndUpdate(
    { sessionId: sessionId },
    {
      $set: {
        cart: {},
        totalPrice: 0,
        totalQty: 0,
      },
    }
  ).exec();
  Transaction.findOne({ orderId: orderId }, (err, transaction) => {
    res.json(transaction);
  });
};

exports.getOrder = (req, res) => {
  const orderId = req.params.orderId;
  Order.findOne({ orderId: orderId }, (err, order) => {
    res.json(order);
  });
};

exports.postTransaction = async (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  const query = req.body.params.query;
  if (query.vnp_ResponseCode == "00") {
    Users.findOneAndUpdate(
      { sessionId: sessionId },
      {
        $set: {
          cart: {},
          totalPrice: 0,
          totalQty: 0,
        },
      }
    ).exec();
  }
  const info = await Transaction.findOne({ orderId: query.vnp_TxnRef }).exec();
  if (info.payment_method == 3) {
    Transaction.findOneAndUpdate(
      { orderId: query.vnp_TxnRef },
      {
        $set: {
          status: query.vnp_ResponseCode,
          bankCode: query.vnp_BankCode,
        },
      },
      { new: true },
      (err, data) => {
        res.json(data);
      }
    );
  }
};

//send mail payment_method transfer
const readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

exports.create_payment = async (req, res) => {
  var date = new Date();
  const orderId = dateFormat(date, "HHmmss");
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const description = req.body.description;
  const payment_method = req.body.payment_method;
  const dateCreate = req.body.createDate;
  const discount = req.body.discount;
  const feeship = req.body.feeship;
  const amount = req.body.amount;

  //tạo bảng order lưu sản phẩm checkout
  const sessionId = req.signedCookies.sessionId;
  const user = await Users.findOne({ sessionId: sessionId }).exec();
  const order = new Order();
  order.orderId = orderId;
  order.status = 0;
  order.cart = user.cart;
  order.totalPrice = user.totalPrice;
  order.totalQty = user.totalQty;
  order.createDate = dateCreate;
  order.amount = amount;
  order.payment_method = payment_method;
  order.save();

  //lưu dữ liệu vào database
  const transaction = new Transaction();
  transaction.orderId = orderId;
  transaction.name = name;
  transaction.email = email;
  transaction.phone = phone;
  transaction.address = address;
  transaction.description = description;
  transaction.payment_method = payment_method;
  transaction.createDate = dateCreate;
  transaction.discount = discount;
  transaction.feeship = feeship;
  transaction.amount = amount;
  await transaction.save();

  // thanh toán qua vnpay
  if (payment_method == 3) {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var tmnCode = config.get("vnp_TmnCode");
    var secretKey = config.get("vnp_HashSecret");
    var vnpUrl = config.get("vnp_Url");
    var returnUrl = config.get("vnp_ReturnUrl");
    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var bankCode = "";
    var orderInfo = description || "milcah";
    var orderType = "fashion";
    var locale = "vn";

    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData =
      secretKey + querystring.stringify(vnp_Params, { encode: false });

    var secureHash = sha256(signData);

    vnp_Params["vnp_SecureHashType"] = "SHA256";
    vnp_Params["vnp_SecureHash"] = secureHash;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: true });

    //Neu muon dung Redirect thi dong dong ben duoi
    res.status(200).json({ data: vnpUrl });
    //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
    //res.redirect(vnpUrl)
  }
  if (payment_method == 2) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    readHTMLFile("./public/pages/transfer.hbs", (err, html) => {
      handlebars.registerHelper("formatAmount", function () {
        return amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      });

      const template = handlebars.compile(html);
      const replacements = {
        name: name,
        feeship: feeship,
        discount: discount,
        amount: amount,
        cart: user.cart,
      };
      const htmlToSend = template(replacements);
      const mailOptions = {
        from: "<noreply@milcah.com>",
        to: email,
        subject: "Thông tin chuyển khoản mua hàng",
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
    res.json(transaction);
  }
  if (payment_method == 1) {
    res.json(transaction);
  }
};

exports.vnpay_return = (req, res) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  var secretKey = config.get("vnp_HashSecret");

  var signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  var checkSum = sha256(signData);

  if (secureHash === checkSum) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    res.json({
      code: vnp_Params,
    });
  } else {
    res.render("checkout", { code: "97" });
  }
};

exports.vnpay_ipn = (req, res) => {
  var vnp_Params = req.query;
  var secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  var secretKey = config.get("vnp_HashSecret");

  var signData =
    secretKey + querystring.stringify(vnp_Params, { encode: false });

  var checkSum = sha256(signData);

  if (secureHash === checkSum) {
    var orderId = vnp_Params["vnp_TxnRef"];
    var rspCode = vnp_Params["vnp_ResponseCode"];
    //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    res.status(200).json({ RspCode: "00", Message: "success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }
};

function sortObject(o) {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}
