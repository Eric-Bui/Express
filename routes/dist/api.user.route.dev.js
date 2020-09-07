"use strict";

var express = require("express");

var router = express.Router();

var jwtMiddlware = require("../middlewares/jwt.middleware");

var controller = require("../controllers/api.user.controller");

router.get("/:id", jwtMiddlware.jwtClient, controller.profile);
router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/send", controller.sendEmail);
module.exports = router;