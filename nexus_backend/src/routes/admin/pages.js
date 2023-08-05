const express = require("express");
const pageController = require("../../controllers/admin/pageController");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { pageSchema } = require("../../validators");
const router = express.Router();
const path = require('path')
const multer = require('multer');
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { READ, WRITE, EXECUTE } = require("../../constants/permissions");
const storage = multer.diskStorage({
    destination: "public/uploads/banners",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", checkPermissions("page", READ), pageController.getAllPages);
router.post("/", checkPermissions("page", WRITE), upload.array('banner'), joivalidate(pageSchema.createPageSchema), pageController.addPage);
router.put("/:id", checkPermissions("page", WRITE), upload.array('banner'), joivalidate(pageSchema.updatePageSchema), pageController.updatePage);
router.get("/:id", checkPermissions("page", READ), pageController.getPage);
router.delete("/:id", checkPermissions("page", EXECUTE), pageController.deletePage);
router.delete("/banner/:id", checkPermissions("page", EXECUTE), pageController.deleteBanner);

module.exports = router;