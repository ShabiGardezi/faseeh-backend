const checkArabicGrammar = require("../utils/checkArabicGrammar");
const arabicRegex = /^[\u0621-\u064A\s\u0660-\u0669.,؟،؛!؟]+$/;
const WatsonXService = require("../services/watsonxService");

function extendInput(input) {
  return input.length < 10 ? input.repeat(2) : input;
}

async function validateArabicInputMiddleware(req, res, next) {
  try {
    const { content } = req.body;

    console.log("Received Input:", content);

    // Check if content is not empty
    if (!content || content.trim() === "") {
      return res.status(400).json({
        status: "error",
        generated_text: "النص المدخل فارغ. الرجاء إدخال نص صالح.",
      });
    }

    console.log("Checking input by NLP...");

    // Dynamically import franc for language detection
    const { franc } = await import("franc-all");

    // Process the text to enhance language detection
    const processedText = extendInput(content);
    const detectedLang = franc(processedText);

    console.log(`Detected Language: ${detectedLang}`);

    // Ensure input is Arabic or Persian
    if (detectedLang !== "arb" && detectedLang !== "pes") {
      return res.status(200).json({
        status: "error",
        generated_text: "الإدخال المقدم ليس باللغة العربية.",
      });
    }

    console.log("Validating input by regex...");

    // Check if input matches Arabic regex pattern
    if (!arabicRegex.test(content)) {
      return res.status(200).json({
        status: "error",
        generated_text: "النص يحتوي على رموز أو أحرف غير مسموح بها.",
      });
    }

    console.log("Performing flexible grammar check...");

    // Perform grammar check with Watson service
    const { valid, errors, suggestions } = await checkArabicGrammar(content);

    if (!valid) {
      console.log("Minor grammar issues detected:", suggestions);

      // Call Watson service to generate the correct response despite minor errors
      const generatedResult = await WatsonXService.generateTashkeelText({
        content,
      });

      return res.status(200).json({
        status: "warning",
        generated_text: generatedResult.generated_text,
        suggestions, // Provide feedback but proceed with output
      });
    }

    console.log("All checks passed. Generating correct output...");

    // If no issues, proceed with generating the desired response
    const generatedResult = await WatsonXService.generateTashkeelText({
      content,
    });

    return res.status(200).json({
      status: "success",
      generated_text: generatedResult.generated_text,
    });
  } catch (error) {
    console.error("Error in validateArabicInputMiddleware:", error);
    return res.status(500).json({
      status: "error",
      generated_text: "حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة لاحقًا.",
    });
  }
}

module.exports = validateArabicInputMiddleware;
