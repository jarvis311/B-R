const express = require("express");
const { READ, WRITE, EXECUTE } = require("../../constants/permissions");
const moduleController = require("../../controllers/admin/moduleController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { moduleSchema } = require("../../validators");
const router = express.Router();
const path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", checkPermissions("modules", READ), moduleController.getAllModules);
router.get("/",moduleController.getAllRoleModules);
router.get("/roles", checkPermissions("roles", READ), moduleController.getAllModuleRoles);
router.post("/", checkPermissions("modules", WRITE), upload.single('icon'), joivalidate(moduleSchema.createModuleSchema), moduleController.addModule);
router.put("/:id", checkPermissions("modules", WRITE), upload.single('icon'), joivalidate(moduleSchema.updateModuleSchema), moduleController.updateModule);
router.get("/:id", checkPermissions("modules", READ), moduleController.getModule);
router.delete("/:id", checkPermissions("modules", EXECUTE), moduleController.deleteModule);

module.exports = router;