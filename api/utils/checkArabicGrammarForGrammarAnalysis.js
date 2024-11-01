const axios = require("axios");
const qs = require("qs");

// Define the checkDiacritics function
function checkDiacritics(text) {
  try {
    const diacriticRegex = /[\u064B-\u0652]/;
    const wordRegex = /[\u0600-\u06FF]+/g;
    const words = text.match(wordRegex) || [];
    const issues = [];

    console.log("Words detected for diacritic check:", words);

    words.forEach((word) => {
      if (diacriticRegex.test(word)) {
        for (let i = 0; i < word.length; i++) {
          if (diacriticRegex.test(word[i]) && i === 0) {
            console.log(
              "Issue found: Diacritic at the start of the word:",
              word
            );
            issues.push({
              word,
              message: "Diacritic found at the start of the word",
            });
          }
        }
      }
    });

    // Return result specifically for diacritic analysis
    return {
      valid: issues.length === 0,
      issues: issues,
    };
  } catch (error) {
    console.error("Error during diacritic check:", error);
    return {
      valid: false,
      issues: ["Error during diacritic check"],
    };
  }
}

// Main function for grammar analysis
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

    // Add this log statement to inspect the full response
    console.log(
      "Full Grammar API Response:",
      JSON.stringify(response.data, null, 2)
    );

    const errors = response.data.matches || [];
    console.log("Grammar API Errors:", JSON.stringify(errors, null, 2));

    // Run the diacritic check
    const diacriticResult = checkDiacritics(input);

    // Extract verb-subject agreement issues
    const verbSubjectIssues = errors
      .filter((e) =>
        e.rule.description.toLowerCase().includes("verb-subject agreement")
      )
      .map((e) => e.message);

    // Map suggestions with detailed logging for replacements
    const suggestions = errors.map((error) => {
      const start = error.context.offset;
      const end = start + error.context.length;

      const incorrectText = error.context.text.slice(
        start,
        Math.min(end, error.context.text.length)
      );

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
      valid: errors.length === 0 && diacriticResult.valid,
      suggestions,
      completenessIssues: errors
        .filter((e) => e.message.toLowerCase().includes("incomplete sentence"))
        .map((e) => e.message),
      diacriticIssues: Array.isArray(diacriticResult.issues)
        ? diacriticResult.issues.map((issue) => issue.message)
        : [],
      verbSubjectIssues,
      wordOrderIssues: errors
        .filter((e) => e.rule.description.toLowerCase().includes("word order"))
        .map((e) => e.message),
    };
  } catch (error) {
    console.error("Error during grammar check:", error.message);
    return {
      valid: false,
      suggestions: [],
      diacriticIssues: ["Error during diacritic check"],
    };
  }
}

module.exports = checkArabicGrammarForGrammarAnalysis;
