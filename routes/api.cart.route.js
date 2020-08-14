const express = require("express");
const router = express.Router();

const controller = require("../controllers/api.cart.controller");

router.get("/", controller.cart);

router.post("/add/:productId", controller.addToCart);

router.post("/delete/:productId", controller.deleteCart);

router.post("/update/:productId", controller.updateCart);

module.exports = router;
