const express = require("express");
const scheduleController = require("../../controllers/admin/manageScheduleController");
const { joivalidate } = require("../../middleware/validationMiddleware");
const { manageScheduleSchema } = require("../../validators");
const router = express.Router();
// const path = require('path')
// const multer = require('multer');
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const { READ, WRITE, EXECUTE } = require("../../constants/permissions");

// const storage = multer.diskStorage({
//     destination: "public/uploads/banners",
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage: storage })

router.get(
  "/",
  checkPermissions("schedule", READ),
  scheduleController.getAllSchedule
);
router.post(
  "/",
  checkPermissions("schedule", WRITE),
  scheduleController.addSchedule
);
router.put(
  "/:id",
  checkPermissions("schedule", WRITE),
  // joivalidate(manageScheduleSchema.updateManageScheduleSchema),
  scheduleController.updateSchedule
);
router.get(
  "/reapet",
  // checkPermissions("schedule", WRITE),
  // joivalidate(manageScheduleSchema.updateManageScheduleSchema),
  scheduleController.getRepeatEvent
);
router.get(
  "/:id",
  checkPermissions("schedule", READ),
  scheduleController.getSchedule
);
router.delete(
  "/:id",
  checkPermissions("schedule", EXECUTE),
  scheduleController.deleteSchedule
);
router.delete(
  "/events/:id",
  checkPermissions("schedule", EXECUTE),
  scheduleController.deleteScheduleByEvent
);
// router.delete("/banner/:id", checkPermissions("page", EXECUTE), scheduleController.deleteBanner);

module.exports = router;
