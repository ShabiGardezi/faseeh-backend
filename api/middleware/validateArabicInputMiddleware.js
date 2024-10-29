const checkArabicGrammar = require("../utils/checkArabicGrammar");

const arabicRegex = /^[\u0621-\u064A\s\u0660-\u0669.,؟،؛]+$/;

function extendInput(input) {
  return input.length < 10 ? input.repeat(2) : input;
}

async function validateArabicInputMiddleware(req, res, next) {
  const { content } = req.body;

  console.log("Checking input by NLP");

  const { franc } = await import("franc-all");

  const processedText = extendInput(content);
  const detectedLang = franc(processedText);
  console.log(`Detected Language: ${detectedLang}`);

  if (detectedLang !== "arb" && detectedLang !== "pes") {
    return res
      .status(200)
      .json({ generated_text: "الإدخال المقدم ليس باللغة العربية" });
  }

  console.log("Checking input by regex");

  if (!arabicRegex.test(content)) {
    return res.status(200).json({
      generated_text: "النص يحتوي على رموز أو أحرف غير مسموح بها.",
    });
  }

  console.log("Checking input by API");

  const isValidGrammar = await checkArabicGrammar(content);
  if (!isValidGrammar) {
    return res.status(200).json({
      generated_text: "يوجد أخطاء نحوية في النص المدخل.",
    });
  }

  console.log("Middleware passed");
  next();
}

module.exports = validateArabicInputMiddleware;
