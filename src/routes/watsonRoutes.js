const express = require("express");
const WatsonController = require("../controllers/watsonController");

const router = express.Router();

router.post("/professional-email", WatsonController.generateProfessionalEmail);
router.post("/tashkeel", WatsonController.generateTashkeel);

module.exports = router;
