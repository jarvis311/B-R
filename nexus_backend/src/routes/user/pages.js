const express = require("express");
const pageController = require("../../controllers/user/pageController");
const router = express.Router();

router.get("/:slug", pageController.getPage);

module.exports = router;