const axios = require("axios");
const qs = require("qs");

async function checkArabicGrammarForGrammarAnalysis(input) {
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
    console.log("Grammar API Errors:", JSON.stringify(errors, null, 2));

    // Map suggestions with detailed logging for replacements
    const suggestions = errors.map((error) => {
      const start = error.context.offset;
      const end = start + error.context.length;

      const incorrectText = error.context.text.slice(
        start,
        Math.min(end, error.context.text.length)
      );

      // Log the structure of replacements for debugging
      console.log(
        "Replacements structure:",
        JSON.stringify(error.replacements, null, 2)
      );

      return {
        message: error.message,
        incorrect_text: incorrectText,
        offset: start,
        length: error.context.length,
        replacements: error.replacements.map((r) => r.value),
      };
    });

    return {
      valid: errors.length === 0,
      suggestions,
      completenessIssues: errors
        .filter((e) => e.message.toLowerCase().includes("incomplete sentence"))
        .map((e) => e.message),
      diacriticIssues: errors
        .filter((e) => e.rule.description.toLowerCase().includes("diacritic"))
        .map((e) => e.message),
      verbSubjectIssues: errors
        .filter((e) =>
          e.rule.description.toLowerCase().includes("verb-subject agreement")
        )
        .map((e) => e.message),
      wordOrderIssues: errors
        .filter((e) => e.rule.description.toLowerCase().includes("word order"))
        .map((e) => e.message),
    };
  } catch (error) {
    console.error("Error during grammar check:", error.message);
    return {
      valid: false,
      suggestions: [],
    };
  }
}

module.exports = checkArabicGrammarForGrammarAnalysis;
