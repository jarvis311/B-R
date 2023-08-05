const express = require("express");
const frontController = require("../../controllers/user/frontController");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { frontSchema } = require("../../validators");
const router = express.Router();

router.post("/contacts", joivalidate(frontSchema.addContactSchema),frontController.addContacts);
router.post("/newsletters", joivalidate(frontSchema.addNewsLetterSchema),frontController.addNewsLetter);

module.exports = router;