const express = require("express");
const { Auth } = require("../middleware/authMiddleware");
const router = express.Router();
const moduleController = require("../controllers/admin/moduleController");



router.use("/auth", require("./auth"));
router.use("/users", Auth, require("./admin/user"));
router.use("/admin/menus", Auth, require("./admin/menu"));
router.use("/admin/settings", Auth, require("./admin/settings"));
router.use("/admin/pages", Auth, require("./admin/pages"));
router.use("/admin/roles", Auth, require("./admin/roles"));
router.use("/admin/modules", Auth, require("./admin/modules"));
router.use("/admin/plan", Auth, require("./admin/plan"));
router.get("/modules", Auth, moduleController.getAllRoleModules);
router.use("/admin/plan", Auth, require('./admin/plan'));
// router.use("/admin/planfeature", Auth, require('./admin/planFeature'));
router.use("/admin/classes", Auth, require('./admin/manageClasses'));
router.use("/admin/templates", Auth, require('./admin/templates'));
router.use("/admin/contacts", Auth, require('./admin/contacts'));
router.use("/admin/newsletters", Auth, require('./admin/newsLetters'));
router.use("/admin/schedule", Auth, require('./admin/schedule'))
router.use("/admin/booking", Auth, require('./admin/booking'))


router.use("/menus", require("./user/menu"));
router.use("/pages", require("./user/pages"));
router.use("/plan", require("./user/plan"));
router.use("/", require("./user/front"));

// customer 
router.use("/customer/", require('./customer/customer'))

module.exports = router;
