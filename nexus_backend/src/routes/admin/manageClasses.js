const express = require("express");
const router = express.Router();
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const manageClassesController = require("../../controllers/admin/manageClassesController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { manageClassesSchema } = require("../../validators");

router.get(
  "/",
  checkPermissions("plan", READ),
  manageClassesController.getAllClasses
);
router.post(
  "/",
  checkPermissions("plan", WRITE),
  joivalidate(manageClassesSchema.createManageClasses),
  manageClassesController.addClasses
);
router.put(
  "/:id",
  checkPermissions("plan", WRITE),
  joivalidate(manageClassesSchema.updateManageClasses),
  manageClassesController.updateClasses
);
router.get(
  "/:id",
  checkPermissions("plan", READ),
  manageClassesController.getManageClasses
);
router.delete(
  "/:id",
  checkPermissions("plan", EXECUTE),
  manageClassesController.deleteClasses
);

module.exports = router;
