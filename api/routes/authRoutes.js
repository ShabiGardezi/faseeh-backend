const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", AuthController.signUpUser);
router.post("/login", AuthController.loginUser);
router.post("/google-login", AuthController.googleLoginUser);

module.exports = router;
