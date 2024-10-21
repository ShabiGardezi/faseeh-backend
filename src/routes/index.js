const express = require("express");
const watsonRoutes = require("./watsonRoutes");

const router = express.Router();

router.use("/api/watson", watsonRoutes);

module.exports = router;
