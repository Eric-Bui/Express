const express = require("express");
const router = express.Router();
const upload = require("../handlers/multer");

const controller = require("../controllers/api.user.controller");
const validate = require("../validate/user.validate");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create", controller.create);

router.get("/:id", controller.view);

router.post("/create", controller.postCreate);

module.exports = router;
