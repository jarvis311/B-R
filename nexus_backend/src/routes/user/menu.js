const express = require("express");
const menuController = require("../../controllers/user/menuController");
const router = express.Router();

router.get("/", menuController.getMenus);

module.exports = router;