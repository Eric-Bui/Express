const express = require("express");
const router = express.Router();
const jwtMiddlware = require("../middlewares/jwt.middleware");

const controller = require("../controllers/api.user.controller");

router.get("/profile/:id", jwtMiddlware.jwtClient, controller.profile);

router.post("/update/:id", jwtMiddlware.jwtClient, controller.updateInfo);

router.post("/order", jwtMiddlware.jwtClient, controller.getInfoOrder);

router.post("/login", controller.login);

router.post("/signup", controller.signup);

router.post("/forgotpw", controller.forgotpw);

router.post("/resetpw/:token", controller.resetpw);

router.get("/logout", jwtMiddlware.jwtClient, controller.logout);

module.exports = router;
