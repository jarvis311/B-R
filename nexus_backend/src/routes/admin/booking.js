const router = require('express').Router()
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const bookingController = require("../../controllers/admin/bookingController");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { bookingSchema } = require("../../validators");

router.get(
  "/",
  checkPermissions("booking", READ),
  bookingController.getAllBooking
);
router.post(
  "/",
  checkPermissions("booking", WRITE),
  joivalidate(bookingSchema.createBookingSchema),
  bookingController.addBooking
);
router.put(
  "/:id",
  checkPermissions("booking", WRITE),
  joivalidate(bookingSchema.upadetBookingSchema),
  bookingController.updateBooking
);
router.get(
  "/:id",
  checkPermissions("booking", READ),
  bookingController.getBooking
);
router.delete(
  "/:id",
  checkPermissions("booking", EXECUTE),
  bookingController.deleteBooking
);

module.exports = router;
