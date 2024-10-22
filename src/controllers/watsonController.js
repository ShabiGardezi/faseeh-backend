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
}

module.exports = WatsonController;
