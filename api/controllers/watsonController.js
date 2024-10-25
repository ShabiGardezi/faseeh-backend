const WatsonXService = require("../services/watsonxService");

class WatsonController {
  static async generateProfessionalEmail(req, res, next) {
    try {
      const result = await WatsonXService.generateProfessionalEmailText(
        req.body
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async generateTashkeel(req, res, next) {
    try {
      const result = await WatsonXService.generateTashkeelText(req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async generateProofReading(req, res, next) {
    try {
      const result = await WatsonXService.generateProofReadingText(req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async generateGrammaticalAnalysis(req, res, next) {
    try {
      const result = await WatsonXService.generateGrammaticalAnalysisText(
        req.body
      );
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async generateChildrenStory(req, res, next) {
    try {
      const result = await WatsonXService.generateChildrenStoryText(req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async generateMarketing(req, res, next) {
    try {
      const result = await WatsonXService.generateMarketingText(req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WatsonController;
