const express = require("express");
const router = express.Router();

const controller = require("../controllers/api.transaction.controller");

router.get("/transaction/:orderId", controller.getTransaction);

router.get("/order/:orderId", controller.getOrder);

router.post("/", controller.postTransaction);

router.post("/create_payment", controller.create_payment);

router.get("/vnpay_return", controller.vnpay_return);

router.get("/vnpay_ipn", controller.vnpay_ipn);

module.exports = router;
