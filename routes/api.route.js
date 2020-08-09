const express = require("express");
const router = express.Router();

const controller = require("../controllers/api.controller");

router.post("/products", controller.products);

router.post("/categories", controller.categories);

router.get("/products/:id", controller.productbyId);

module.exports = router;
