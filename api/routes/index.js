const express = require("express");
const watsonRoutes = require("./watsonRoutes");
const authRoutes = require("./authRoutes");
const activityLogRoutes = require("./activityLogRoutes");

const router = express.Router();

router.use("/api/watson", watsonRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/user/activity-log", activityLogRoutes);

module.exports = router;
