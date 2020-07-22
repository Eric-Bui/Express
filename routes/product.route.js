const express = require("express");
const router = express.Router();

const upload = require("../handlers/multer");

const controller = require("../controllers/product.controller");
const validate = require("../validate/product.validate");

const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/view/:id", controller.view);

//categories
router.get("/createCategory", controller.createCategory);

router.post(
  "/createCategory",
  upload.single("image_link"),
  validate.postCreate,
  controller.CreateCategory
);

//products
router.get("/createProduct", controller.createProduct);

router.post(
  "/createProduct",
  upload.array("image"),
  validate.postCreate,
  controller.postcreateProduct
);

router.get("/edit/:id", controller.gotoUpdate);

router.post("/edit/:id", upload.array("image"), controller.update);

router.get("/delete/:id", controller.delete);

module.exports = router;
