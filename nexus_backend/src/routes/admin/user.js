const express = require("express");
const userController = require("../../controllers/admin/userController");
const router = express.Router();
const { joivalidate } = require('../../middleware/validationMiddleware');
const { userSchema } = require("../../validators");
const path = require('path')
const multer = require('multer');
const { WRITE, EXECUTE, READ } = require("../../constants/permissions");
const { checkPermissions } = require("../../middleware/permissionMiddleware");
const storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", checkPermissions("user", READ), userController.getAllUsers);
router.get("/profile", userController.getUserProfile);
router.post("/", checkPermissions("user", WRITE), upload.single('profile'), joivalidate(userSchema.createUserSchema), userController.addUser);
router.get("/:id", userController.getUser);
router.put("/:id", checkPermissions("user", WRITE), upload.single('profile'), joivalidate(userSchema.updateUserSchema), userController.updateUser);
router.delete("/:id", checkPermissions("user", EXECUTE), userController.deleteUser);
router.post("/forgot-password", joivalidate(userSchema.forgotPasswordSchema), userController.forgotPassword);
router.post("/reset-password", joivalidate(userSchema.resetPasswordSchema), userController.resetPassword);
router.post("/verify-token", userController.verifyToken);

module.exports = router;