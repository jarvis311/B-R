const express = require("express");
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const planController = require("../../controllers/admin/planController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { planSchema } = require("../../validators");
const router = express.Router();

router.get("/", checkPermissions("plan", READ), planController.getAllPlans);

router.post("/plan-option",checkPermissions("plan", READ), planController.getPlanOption);


router.post(
  "/",
  checkPermissions("plan", WRITE),
  joivalidate(planSchema.createPlanSchema),
  planController.addPlan
);
router.put(
  "/:id",
  checkPermissions("plan", WRITE),
  joivalidate(planSchema.updatePlanSchema),
  planController.updatePlan
);
router.get("/:id", checkPermissions("plan", READ), planController.getPlan);
router.delete(
  "/:id",
  checkPermissions("plan", EXECUTE),
  planController.deletePlan
);

module.exports = router;
