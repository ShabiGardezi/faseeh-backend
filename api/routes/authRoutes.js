const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", AuthController.signUpUser);
router.post("/login", AuthController.loginUser);
router.post("/google-login", AuthController.googleLoginUser);
router.post("/verify-token", AuthController.verifyToken);
router.post("/reset-password-request", AuthController.resetPasswordRequest);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
