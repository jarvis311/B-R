const express = require("express");
const customerController = require("../../controllers/customer/customerController");
const router = express.Router();
const { joivalidate } = require("../../middleware/validationMiddleware");
const { customerSchema } = require("../../validators");
const path = require("path");
const multer = require("multer");
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
// const storage = multer.diskStorage({
//     destination: "public/uploads",
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage: storage })

router.get(
  "/",
  checkPermissions("customer", READ),
  customerController.getAllCustomer
);
router.post(
  "/",
  // checkPermissions("customer", WRITE),
  joivalidate(customerSchema.createCustomerSchema),
  customerController.addCustomer
);
router.get("/:id", customerController.getCustomer);
router.put(
  "/:id",
  checkPermissions("user", WRITE),
  joivalidate(customerSchema.upadetCustomerSchema),
  customerController.updateCustomerByAdmin
);

router.put(
  "/block-customer/:id",
  checkPermissions("user", WRITE),
  customerController.updateCustomerIsBlock
);
router.delete(
  "/:id",
  checkPermissions("user", EXECUTE),
  customerController.deleteCustomer
);
router.post(
  "/forgot-password",
  joivalidate(customerSchema.forgotPasswordSchema),
  customerController.forgotPassword
);
router.post(
  "/reset-password",
  joivalidate(customerSchema.resetPasswordSchema),
  customerController.resetPassword
);
router.post("/verify-token", customerController.verifyToken);

module.exports = router;
