const { default: mongoose } = require("mongoose");
const ActivityLog = require("../schema/activityLog.schema");

async function createActivityLog(req) {
  const { input, output, userId, serviceType } = req.body;

  const newLog = new ActivityLog({
    input,
    output,
    userId: new mongoose.Types.ObjectId(userId),
    serviceType,
  });
  await newLog.save();

  return { message: "Activity log created successfully" };
}

async function getActivityLogs(req) {
  const { userId } = req.params;

  const logs = await ActivityLog.find({
    userId: new mongoose.Types.ObjectId(userId),
  });
  return logs;
}

async function deleteActivityLog(req) {
  const { logId } = req.params;

  const log = await ActivityLog.findByIdAndDelete(
    new mongoose.Types.ObjectId(logId)
  );

  if (!log) {
    throw new Error("Activity log not found");
  }

  return { message: "Activity log deleted successfully" };
}

module.exports = { createActivityLog, getActivityLogs, deleteActivityLog };
