const express = require("express");
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const settingController = require("../../controllers/admin/settingController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { settingSchema } = require("../../validators");
const router = express.Router();
const path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "public/uploads/icons",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", checkPermissions("setting", READ), settingController.getAllSettings);


router.get("/social-links", checkPermissions("setting", READ), settingController.getSocialMediaLink);
router.post("/social-links", checkPermissions("setting", READ), joivalidate(settingSchema.createSocialLinkschema), settingController.updateSocialLinks);
router.delete("/social-links/:id", checkPermissions("setting", EXECUTE), settingController.deleteSocialLinks);

router.get("/email", checkPermissions("setting", READ), settingController.getEmailSettings);
router.get("/email/:id", checkPermissions("setting", READ), settingController.getEmailSetting);
router.put("/email/:id", checkPermissions("setting", READ), settingController.updateEmailSetting);

router.post("/", checkPermissions("setting", WRITE), joivalidate(settingSchema.createSettingSchema), settingController.addSetting);
router.put("/:id", checkPermissions("setting", WRITE), joivalidate(settingSchema.updateSettingSchema), settingController.updateSetting);
router.get("/:id", checkPermissions("setting", READ), settingController.getSetting);
router.delete("/:id", checkPermissions("setting", EXECUTE), settingController.deleteSetting);

module.exports = router;