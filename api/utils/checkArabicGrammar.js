const axios = require("axios");
const qs = require("qs");

async function checkArabicGrammar(input) {
  try {
    const response = await axios.post(
      "https://api.languagetoolplus.com/v2/check",
      qs.stringify({
        text: input,
        language: "ar",
        enabledOnly: "false",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const errors = response.data.matches;
    if (errors.length > 0) {
      console.log("Errors found:", errors);
      return false;
    } else {
      console.log("No grammar issues detected.");
      return true;
    }
  } catch (error) {
    console.error(
      "Error during grammar check:",
      error.response?.data || error.message
    );
    return false;
  }
}

module.exports = checkArabicGrammar;
