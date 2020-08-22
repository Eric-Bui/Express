const express = require("express");
const router = express.Router();
const upload = require("../handlers/multer");

const controller = require("../controllers/api.user.controller");

router.post("/login", controller.login);

router.post("/signup", controller.signup);

router.post("/send", controller.sendEmail);

module.exports = router;
