const express = require("express");
const WatsonController = require("../controllers/watsonController");
const validateArabicInputMiddleware = require("../middleware/validateArabicInputMiddleware");

const router = express.Router();

router.post("/professional-email", WatsonController.generateProfessionalEmail);
router.post(
  "/tashkeel",
  validateArabicInputMiddleware,
  WatsonController.generateTashkeel
);
router.post("/proofread", WatsonController.generateProofReading);
router.post(
  "/grammatical-analysis",
  WatsonController.generateGrammaticalAnalysis
);
router.post("/children-story", WatsonController.generateChildrenStory);
router.post("/marketing-text", WatsonController.generateMarketing);

module.exports = router;
