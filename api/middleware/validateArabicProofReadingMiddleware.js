const checkArabicGrammar = require("../utils/checkArabicGrammarForProofReading");
const arabicRegex =
  /^[\u0600-\u06FF\s\u0750-\u077F\u08A0-\u08FF\u0660-\u0669.,؟،؛!(){}[\]«»"'\u064B-\u0652]*$/;
const WatsonXService = require("../services/watsonxService");

function extendInput(input) {
  return input.length < 10 ? input.repeat(2) : input;
}

// Helper function to apply corrections based on suggestions
function applyCorrections(text, suggestions) {
  let correctedText = text;
  // Sort suggestions by offset in descending order to avoid conflicts in index adjustment
  suggestions.sort((a, b) => b.offset - a.offset);

  suggestions.forEach((suggestion) => {
    if (suggestion.replacements && suggestion.replacements.length > 0) {
      // Use the first replacement suggestion for simplicity
      const replacement = suggestion.replacements[0];

      // Apply replacement in the text
      correctedText =
        correctedText.slice(0, suggestion.offset) +
        replacement +
        correctedText.slice(suggestion.offset + suggestion.length);
    }
  });

  return correctedText;
}

async function validateArabicProofReadingMiddleware(req, res, next) {
  try {
    const { content } = req.body;

    console.log("Received Proofreading Input:", content);

    if (!content || content.trim() === "") {
      return res.status(400).json({
        status: "error",
        generated_text: "النص المدخل فارغ. الرجاء إدخال نص صالح.",
      });
    }

    // Check if the input is purely numbers or non-textual
    if (/^\d+$/.test(content.trim())) {
      return res.status(200).json({
        status: "error",
        generated_text: "الإدخال ليس نصًا. الرجاء إدخال نص صالح.",
      });
    }

    // Check if input is short (fewer than 3 words or 10 characters)
    const isShortText =
      content.trim().split(/\s+/).length < 3 || content.length < 10;
    let isArabic;

    if (isShortText) {
      // For short input, rely on arabicRegex
      isArabic = arabicRegex.test(content);
    } else {
      // For longer input, use franc for language detection
      const { franc } = await import("franc-all");
      const processedText = extendInput(content);
      const detectedLang = franc(processedText);
      isArabic = detectedLang === "arb";
    }

    if (!isArabic) {
      return res.status(200).json({
        status: "error",
        generated_text: "الإدخال المقدم ليس باللغة العربية.",
      });
    }

    if (!arabicRegex.test(content)) {
      return res.status(200).json({
        status: "error",
        generated_text: "النص يحتوي على رموز أو أحرف غير مسموح بها.",
      });
    }

    // Perform grammar and spelling check
    const { valid, suggestions } = await checkArabicGrammar(content);

    if (!valid) {
      console.log("Proofreading issues found:", suggestions);

      const correctedText = applyCorrections(content, suggestions);

      return res.status(200).json({
        status: "success",
        generated_text: correctedText,
        suggestions: suggestions.map((s) => ({
          message: s.message,
          incorrect_text: s.context,
          offset: s.offset,
          replacements: s.replacements,
        })),
      });
    }

    const generatedResult = await WatsonXService.generateProofReadingText({
      content,
    });

    return res.status(200).json({
      status: "success",
      generated_text: generatedResult.generated_text,
    });
  } catch (error) {
    console.error("Error in validateArabicProofReadingMiddleware:", error);
    return res.status(500).json({
      status: "error",
      generated_text: "حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة لاحقًا.",
    });
  }
}

module.exports = validateArabicProofReadingMiddleware;
