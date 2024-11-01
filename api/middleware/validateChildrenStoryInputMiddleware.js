const arabicRegex =
  /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669\s.,؟،؛!؛ـًٌٍَُِّْ]+$/;
const prohibitedWords = [
  // 1. Profanity and personal insults
  "كلمة سيئة",
  "إهانة",
  "شتيمة",

  // 2. Racial or discriminatory slurs
  "عنصري",
  "تمييز",
  "عرقي",

  // 3. Ethically or socially inappropriate words
  "غير لائق",
  "مشين",

  // 4. Phrases related to violence or threats
  "تهديد",
  "قتل",
  "عنف",

  // 5. Words with sexual implications
  "جنس",
  "إباحية",
  "محتوى غير مناسب",

  // 6. Phrases inciting hatred or intolerance
  "كراهية",
  "تحريض",
  "عداء",

  // 7. Words promoting drugs or alcohol
  "مخدرات",
  "خمر",
  "كحول",

  // 8. Gambling-related terms or references to illegal activities
  "مقامرة",
  "رهان",
  "غير قانوني",

  // 9. Phrases that demean individuals or contain bullying
  "تنمر",
  "إهانة شخصية",
  "مذلة",
];

const MIN_CHAR_LIMIT = 5;
const MAX_CHAR_LIMIT = 1000; // Adjustable based on model capabilities

function containsProhibitedWords(content) {
  return prohibitedWords.some((word) => content.includes(word));
}

async function validateChildrenStoryInputMiddleware(req, res, next) {
  try {
    const { childName, age, proverb } = req.body;

    console.log("Received Input:", { childName, age, proverb });

    // Check if any of the required fields are missing or empty
    if (
      !childName ||
      !age ||
      !proverb ||
      !childName.trim() ||
      !proverb.trim()
    ) {
      return res.status(400).json({
        status: "error",
        generated_text: "النص المدخل فارغ. الرجاء إدخال نص صالح.",
      });
    }

    // Check if age is a valid number and within the acceptable range
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
      return res.status(400).json({
        status: "error",
        generated_text: "العمر يجب أن يكون رقمًا بين 1 و 18.",
      });
    }

    // Check if the proverb meets the length requirements only
    if (proverb.length < MIN_CHAR_LIMIT) {
      return res.status(400).json({
        status: "error",
        generated_text: `النص المدخل قصير جدًا. يجب أن يكون على الأقل ${MIN_CHAR_LIMIT} حرفًا.`,
      });
    }

    if (proverb.length > MAX_CHAR_LIMIT) {
      return res.status(400).json({
        status: "error",
        generated_text: `النص المدخل طويل جدًا. يجب ألا يزيد عن ${MAX_CHAR_LIMIT} حرفًا.`,
      });
    }

    console.log("Validating input by regex...");

    // Check if inputs match Arabic regex pattern
    if (!arabicRegex.test(childName) || !arabicRegex.test(proverb)) {
      return res.status(200).json({
        status: "error",
        generated_text: "النص يحتوي على رموز أو أحرف غير مسموح بها.",
      });
    }

    console.log("Checking for prohibited words...");

    // Check for prohibited words or inappropriate content
    if (
      containsProhibitedWords(childName) ||
      containsProhibitedWords(proverb)
    ) {
      return res.status(400).json({
        status: "error",
        generated_text: "النص يحتوي على كلمات أو محتوى غير مناسب.",
      });
    }

    console.log("Normalizing whitespace and formatting...");

    // Normalize whitespace and formatting for childName and proverb
    req.body.childName = childName.replace(/\s+/g, " ").trim();
    req.body.proverb = proverb.replace(/\s+/g, " ").trim();

    console.log("All checks passed. Proceeding to next middleware...");

    next();
  } catch (error) {
    console.error("Error in validateChildrenStoryInputMiddleware:", error);
    return res.status(500).json({
      status: "error",
      generated_text: "حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة لاحقًا.",
    });
  }
}

module.exports = validateChildrenStoryInputMiddleware;
