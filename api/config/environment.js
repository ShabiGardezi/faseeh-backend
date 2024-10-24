const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  PORT: process.env.PORT || 5000,
  WATSON_API_KEY: process.env.WATSON_API_KEY,
  WATSON_URL: process.env.WATSON_URL,
  WATSON_VERSION: "2024-05-31",
};
