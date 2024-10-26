const express = require("express");
const watsonRoutes = require("./watsonRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.use("/api/watson", watsonRoutes);
router.use("/api/auth", authRoutes);

module.exports = router;
