const express = require("express");
const { READ, WRITE, EXECUTE } = require("../../constants/permissions");
const roleController = require("../../controllers/admin/roleController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { roleSchema } = require("../../validators");
const router = express.Router();

router.get("/", checkPermissions("roles", READ), roleController.getAllRoles);
router.post("/", checkPermissions("roles", WRITE), joivalidate(roleSchema.createRoleSchema), roleController.addRole);
router.put("/:id", checkPermissions("roles", WRITE), joivalidate(roleSchema.updateRoleSchema), roleController.updateRole);
router.get("/:id", checkPermissions("roles", READ), roleController.getRole);
router.delete("/:id", checkPermissions("roles", EXECUTE), roleController.deleteRole);

module.exports = router;