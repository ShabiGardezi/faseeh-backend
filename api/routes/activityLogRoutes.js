const express = require("express");
const ActivityLogController = require("../controllers/activityLogController");

const router = express.Router();

router.post("/", ActivityLogController.create);
router.get("/:userId", ActivityLogController.get);
router.delete("/:logId", ActivityLogController.delete);

module.exports = router;
