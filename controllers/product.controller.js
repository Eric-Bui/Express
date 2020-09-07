const Categories = require("../models/products/catagories.model");
const Products = require("../models/products/products.model");

const cloudinary = require("cloudinary");
require("../handlers/mongo");
const Multicloudinary = require("../handlers/cloudinary");
const date = require("date-and-time");

module.exports.index = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  Products.find()
    .sort({ price: "Descending" })
    .exec((err, data) => {
      const pages = Math.ceil(data.length / perPage);
      res.render("products/index", {
        products: data.slice(start, end),
        pages: pages,
        current: page,
      });
    });
};

module.exports.search = (req, res) => {
  const q = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const perPage = 10;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const rex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(rex(q), "gi");
  Products.find(
    {
      name: regex,
    },
    (err, data) => {
      const pages = Math.ceil(data.length / perPage);
      res.render("products/index", {
        products: data.slice(start, end),
        values: q,
        searchPages: pages,
        current: page,
      });
    }
  );
};

module.exports.view = async (req, res) => {
  await Products.findById(req.params.id, (err, data) => {
    if (err) {
      res.json({ Mgs: err });
    } else {
      res.render("products/view", { product: data });
    }
  });
};

// get, post categories
module.exports.createCategory = (req, res) => {
  res.render("products/createCategory");
};

module.exports.CreateCategory = async (req, res) => {
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
  res.redirect("/products/createProduct");
};

//get, post products

module.exports.createProduct = async (req, res) => {
  const categories = await Categories.find();
  res.render("products/createProduct", {
    categories: categories,
  });
};

module.exports.postcreateProduct = async (req, res) => {
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
    product.idCat = req.body.caterories;
    product.name = req.body.name;
    product.price = req.body.price;
    product.images = urls;
    product.image_link = image_link;
    product.dateCreate = day;
    await product.save((err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.redirect("/products");
      }
    });
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`,
    });
  }
};

module.exports.gotoUpdate = async (req, res) => {
  await Products.findById(req.params.id, (err, data) => {
    if (err) {
      res.json({ Mgs: err });
    } else {
      res.render("products/edit", { product: data });
    }
  });
};

module.exports.update = async (req, res) => {
  if (req.files.length == 0) {
    await Products.findByIdAndUpdate(
      req.params.id,
      { $set: { name: req.body.name, price: req.body.price } },
      { useFindAndModify: false }
    ).then(() => {
      res.redirect("/products");
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
      await Multicloudinary.uploads(path, "Images");
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
          name: req.body.name,
          price: req.body.price,
          images: urls,
        },
        (err) => {
          if (err) {
            res.json({ Mgs: err });
          } else {
            res.redirect("/products");
          }
        }
      );
    }
  }
};

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  Products.findByIdAndDelete(id, (err, doc) => {
    if (err) throw err;
    else {
      const arrImages = doc.images;
      for (let i = 0; i < arrImages.length; i++) {
        let id = arrImages[i].id;
        cloudinary.v2.uploader.destroy(id);
      }
      res.redirect("/products");
    }
  });
};
