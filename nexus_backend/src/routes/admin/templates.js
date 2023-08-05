const express = require("express");
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const templateController = require("../../controllers/admin/templateController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { templateSchema } = require("../../validators");
const router = express.Router();

router.get("/", checkPermissions("templates", READ), templateController.getAllTemplates);
router.post("/", checkPermissions("templates", WRITE), joivalidate(templateSchema.createTemplateSchema), templateController.addTemplate);
router.put("/:id", checkPermissions("templates", WRITE), joivalidate(templateSchema.updateTemplateSchema), templateController.updateTemplate);
router.post("/test", templateController.testTemplate);
router.get("/:id", checkPermissions("templates", READ), templateController.getTemplate);
router.delete("/:id", checkPermissions("templates", EXECUTE), templateController.deleteTemplate);

module.exports = router;