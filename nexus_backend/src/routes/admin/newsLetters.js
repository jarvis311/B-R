const express = require("express");
const { READ, WRITE } = require("../../constants/permissions");
const newsController = require("../../controllers/admin/newsController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { newsLetterSchema } = require("../../validators");
const router = express.Router();

router.get("/", checkPermissions("newsletter", READ), newsController.getAllNewsLetters);
router.post("/", checkPermissions("newsletter", WRITE), joivalidate(newsLetterSchema.sendNewsLetterSchema),newsController.sendNewsLetter);

module.exports = router;