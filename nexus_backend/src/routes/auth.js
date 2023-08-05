const express = require("express");
const { login } = require("../controllers/authCustomer");
const {adminlogin} = require("../controllers/authController")
const router = express.Router();

router.post("/login", login);
router.post("/admin/login", adminlogin);

module.exports = router;
