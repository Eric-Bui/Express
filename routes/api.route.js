const express = require("express");
const router = express.Router();
const sessionMiddleware = require("./..//middlewares/session.middleware");

const controller = require("../controllers/api.controller");

router.get("/products", sessionMiddleware, controller.products);

router.get("/products/:id", controller.productbyId);

router.get("/categories", controller.categories);

router.get("/categories/:id", controller.categoriesbyId);

module.exports = router;
