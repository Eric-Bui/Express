const Categories = require("../models/products/catagories.model");
const Products = require("../models/products/products.model");
const cloudinary = require("cloudinary");
require("../handlers/mongo");
require("dotenv").config();
const Multicloudinary = require("../handlers/cloudinary");

const date = require("date-and-time");
const Order = require("../models/transaction/order.model");
const Transaction = require("../models/transaction/transaction.model");
const Admin = require("../models/users/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getProducts = (req, res) => {
  Products.find((err, products) => {
    if (err) {
      res.json({ Error: err });
    } else {
      res.json(products);
    }
  });
};

exports.productById = (req, res) => {
  Products.findById(req.params.id, (err, product) => {
    if (err) {
      res.json({ Mgs: err });
    } else {
      res.json(product);
    }
  });
};

exports.changeStatusProduct = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const product = await Products.findByIdAndUpdate(
    id,
    {
      $set: {
        active: status,
      },
    },
    (err, data) => {}
  );
  res.json(product);
};

exports.category = async (req, res) => {
  const shortid = require("shortid");
  const sessionId = shortid.generate();
  const day = date.format(new Date(), "DD-MM-YYYY");
  const Filename = day + "_" + sessionId;
  const image = await cloudinary.v2.uploader.upload(req.file.path, {
    public_id: `Collection/${Filename}`,
    tags: `Collection`,
  });
  const category = new Categories();
  category.name = req.body.name;
  category.image = image.secure_url;
  category.save();
  res.json(category);
};

module.exports.product = async (req, res) => {
  const uploader = async (path) =>
    await Multicloudinary.uploads(path, "Products");
  if (req.method === "POST") {
    const urls = await [];
    const files = req.files;
    const day = date.format(new Date(), "DD-MM-YYYY");
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }
    const image_link = urls[0].url;
    const product = new Products();
    product.idCat = req.body.selected;
    product.name = req.body.name;
    product.price = req.body.price;
    product.price_input = req.body.price_input;
    product.qty = req.body.qty;
    product.images = urls;
    product.image_link = image_link;
    product.active = true;
    product.dateCreate = day;
    await product.save((err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(product);
      }
    });
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`,
    });
  }
};

module.exports.update = async (req, res) => {
  if (req.files.length == 0) {
    await Products.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          idCat: req.body.selected,
          name: req.body.name,
          price: req.body.price,
          price_input: req.body.price_input,
          qty: req.body.qty,
        },
      },
      { useFindAndModify: false }
    ).then(() => {
      res.json({ result: "ok" });
    });
  } else {
    const id = req.params.id;
    //delete images current
    await Products.findById(id, (err, data) => {
      if (err) throw err;
      else {
        const arrImages = data.images;
        for (let i = 0; i < arrImages.length; i++) {
          let id = arrImages[i].id;
          cloudinary.v2.uploader.destroy(id);
        }
      }
    });
    //upload new images
    const uploader = async (path) =>
      await Multicloudinary.uploads(path, "Products");
    if (req.method === "POST") {
      const urls = await [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
      }
      Products.updateOne(
        { _id: id },
        {
          idCat: req.body.selected,
          name: req.body.name,
          price: req.body.price,
          price_input: req.body.price_input,
          qty: req.body.qty,
          images: urls,
        },
        (err) => {
          if (err) {
            res.json({ Mgs: err });
          } else {
            res.send({ result: "ok" });
          }
        }
      );
    }
  }
};

module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  Products.findByIdAndDelete(id, (err, doc) => {
    if (err) throw err;
    else {
      const arrImages = doc.images;
      for (let i = 0; i < arrImages.length; i++) {
        let id = arrImages[i].id;
        cloudinary.v2.uploader.destroy(id);
      }
      res.json({ result: "ok" });
    }
  });
};

exports.deleteCategory = (req, res) => {
  const id = req.params.id;
  Categories.findByIdAndDelete(id, (err, doc) => {
    if (err) throw err;
    else {
      res.json({ result: "ok" });
    }
  });
};

//get list order
exports.getOrder = (req, res) => {
  Order.find((err, order) => {
    res.json(order);
  });
};

exports.getOrderById = (req, res) => {
  const orderId = req.params.orderId;
  Order.findOne({ orderId: orderId }, (err, order) => {
    res.json(order);
  });
};

exports.editOrder = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const order = await Order.findByIdAndUpdate(
    id,
    {
      $set: {
        status: status,
      },
    },
    (err, data) => {}
  );
  res.json(order);
};

exports.deleteOrder = async (req, res) => {
  const id = req.params.id;
  Order.findByIdAndDelete(id, (err, data) => {
    res.json(data);
  });
};

exports.getTransactionbyId = (req, res) => {
  const orderId = req.params.orderId;
  Transaction.findOne({ orderId: orderId }, (err, transaction) => {
    res.json(transaction);
  });
};

exports.signup = async (req, res) => {
  const hashedEmail = await bcrypt.hash(req.body.username, 10);
  const hashedPassword = await bcrypt.hash(req.body.password, 15);
  const admin = new Admin();
  admin.username = hashedEmail;
  admin.password = hashedPassword;
  admin.save((err, data) => {
    res.json(data);
  });
};

module.exports.login = async (req, res) => {
  const admin = await Admin.findOne({ username: req.body.username }).exec();
  if (admin == null) {
    res.json({ err: "Tên đăng nhập không đúng!" });
    return;
  }
  try {
    if (await bcrypt.compare(req.body.password, admin.password)) {
      const token = jwt.sign({ _id: admin._id }, process.env.JWT_ADMIN);
      res.cookie("id_admin", token, {
        signed: true,
        expires: new Date(Date.now() + 60 * 60 * 5 * 1000), // 5h
      });
      res.json({ admin, token });
    } else {
      res.send({ err: "Mật khẩu không đúng!" });
      return;
    }
  } catch {
    res.status(500).send();
  }
};

exports.logout = (req, res) => {
  res.clearCookie("id_admin");
  res.json({ note: "success" });
};
