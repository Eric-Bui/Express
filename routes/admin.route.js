const express = require("express");
const router = express.Router();
const upload = require("../handlers/multer");
const controller = require("../controllers/admin.controller");
const jwtMiddlware = require("../middlewares/jwt.middleware");

//categories

router.get("/product", jwtMiddlware.jwtAdmin, controller.getProducts);

router.get("/product/:id", jwtMiddlware.jwtAdmin, controller.productById);

router.post(
  "/product/edit/:id",
  jwtMiddlware.jwtAdmin,
  controller.changeStatusProduct
);

router.post(
  "/addproduct",
  upload.array("image"),
  jwtMiddlware.jwtAdmin,
  controller.product
);

router.post(
  "/edit/:id",
  upload.array("image"),
  jwtMiddlware.jwtAdmin,
  controller.update
);

router.get("/delproduct/:id", jwtMiddlware.jwtAdmin, controller.deleteProduct);

router.post(
  "/category",
  upload.single("image"),
  jwtMiddlware.jwtAdmin,
  controller.category
);

router.get(
  "/delcategory/:id",
  jwtMiddlware.jwtAdmin,
  controller.deleteCategory
);

//order
router.get("/order", jwtMiddlware.jwtAdmin, controller.getOrder);

router.get("/order/:orderId", jwtMiddlware.jwtAdmin, controller.getOrderById);

router.post("/order/edit/:id", jwtMiddlware.jwtAdmin, controller.editOrder);

router.post("/order/delete/:id", jwtMiddlware.jwtAdmin, controller.deleteOrder);

router.get(
  "/transaction/:orderId",
  jwtMiddlware.jwtAdmin,
  controller.getTransactionbyId
);

//authentication
router.post("/signup", controller.signup);

router.post("/login", controller.login);

router.get("/logout", jwtMiddlware.jwtAdmin, controller.logout);

module.exports = router;
