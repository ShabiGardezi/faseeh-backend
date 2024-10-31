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
        timeout: 5000,
      }
    );

    const errors = response.data.matches || [];
    console.log("Grammar API Errors:", errors);

    // Filter critical grammar issues, spelling issues, and clarity suggestions
    const grammarIssues = errors.filter(
      (error) =>
        error.rule.issueType === "grammar" && error.rule.category.id !== "TYPOS"
    );

    const spellingIssues = errors.filter(
      (error) => error.rule.category.id === "TYPOS"
    );

    const claritySuggestions = errors.filter((error) =>
      error.rule.description.includes("clarity")
    );

    // Map all errors into a consistent suggestion format
    const suggestions = errors.map((error) => ({
      message: error.message,
      replacements: error.replacements.map((r) => r.value),
      context: error.context.text,
      offset: error.context.offset,
      length: error.context.length,
    }));

    return {
      valid: grammarIssues.length === 0,
      errors: grammarIssues,
      suggestions,
      claritySuggestions,
    };
  } catch (error) {
    console.error("Error during grammar check:", error.message);
    return {
      valid: false,
      errors: [],
      suggestions: [],
      claritySuggestions: [],
    };
  }
}

module.exports = checkArabicGrammar;
