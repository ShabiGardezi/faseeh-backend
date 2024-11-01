const express = require("express");
const WatsonController = require("../controllers/watsonController");
const validateArabicInputMiddleware = require("../middleware/validateArabicInputMiddleware");
const validateArabicProofReadingMiddleware = require("../middleware/validateArabicProofReadingMiddleware");
const validateArabicGrammarAnalysisMiddleware = require("../middleware/validateArabicGrammarAnalysisMiddleware");

const router = express.Router();

router.post("/professional-email", WatsonController.generateProfessionalEmail);
router.post(
  "/tashkeel",
  validateArabicInputMiddleware,
  WatsonController.generateTashkeel
);
router.post(
  "/proofread",
  validateArabicProofReadingMiddleware,
  WatsonController.generateProofReading
);
router.post(
  "/grammatical-analysis",
  validateArabicGrammarAnalysisMiddleware,
  WatsonController.generateGrammaticalAnalysis
);
router.post("/children-story", WatsonController.generateChildrenStory);
router.post("/marketing-text", WatsonController.generateMarketing);

module.exports = router;
