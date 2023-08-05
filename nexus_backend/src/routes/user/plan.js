const router = require("express").Router();
const planController = require("../../controllers/user/planController");

router.get("/", planController.getPlan);

module.exports = router;
