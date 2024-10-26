const ActivityLogService = require("../services/activityLogService");

class ActivityLogController {
  static async create(req, res, next) {
    try {
      const result = await ActivityLogService.createActivityLog(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const result = await ActivityLogService.getActivityLogs(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const result = await ActivityLogService.deleteActivityLog(req);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityLogController;
