"use strict";

var express = require("express");

var router = express.Router();

var sessionMiddleware = require("./..//middlewares/session.middleware");

var controller = require("../controllers/api.controller");

router.get("/products", sessionMiddleware, controller.products);
router.get("/products/:id", controller.productbyId);
router.get("/categories", controller.categories);
router.get("/categories/:id", controller.categoriesbyId);
module.exports = router;