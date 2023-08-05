const express = require("express");
const { READ } = require("../../constants/permissions");
const contactController = require("../../controllers/admin/contactController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const router = express.Router();

router.get("/", checkPermissions("contacts", READ), contactController.getAllContacts);

module.exports = router;