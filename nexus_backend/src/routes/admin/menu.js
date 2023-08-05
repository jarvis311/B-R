const express = require("express");
const { READ, WRITE, EXECUTE } = require("../../constants/permissions");
const menuController = require("../../controllers/admin/menuController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { menuSchema } = require("../../validators");
const router = express.Router();

router.get("/", checkPermissions("menu", READ), menuController.getAllMenus);
router.post("/", checkPermissions("menu", WRITE), joivalidate(menuSchema.createMenuSchema), menuController.addMenu);
router.put("/:id", checkPermissions("menu", WRITE), joivalidate(menuSchema.updateMenuSchema), menuController.updateMenu);
router.get("/:id", checkPermissions("menu", READ), menuController.getMenu);
router.delete("/:id", checkPermissions("menu", EXECUTE), menuController.deleteMenu);

module.exports = router;