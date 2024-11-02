const MIN_LENGTH_FOR_FRANC = 20; // Minimum character length for using franc
const arabicRegex =
  /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669\s]+$/; // Regex to check if input is in Arabic script

function getCharacterCounts(text) {
  const arabicRegex = /[\u0600-\u06FF]/g; // Match Arabic characters
  const nonArabicRegex = /[a-zA-Z]/g; // Match English alphabet characters

  const arabicCount = (text.match(arabicRegex) || []).length;
  const nonArabicCount = (text.match(nonArabicRegex) || []).length;
  const totalCount = text.replace(/\s/g, "").length; // Exclude spaces

  return { arabicCount, nonArabicCount, totalCount };
}

function isMostlyArabic(text) {
  const { arabicCount, totalCount } = getCharacterCounts(text);
  const arabicPercentage = (arabicCount / totalCount) * 100;
  return arabicPercentage >= 80; // Threshold for majority Arabic
}

async function validateLanguage(input) {
  if (input.length >= MIN_LENGTH_FOR_FRANC) {
    const { franc } = await import("franc-all");
    const francResult = franc(input);
    console.log(`نتيجة فحص franc: ${francResult}`);
    return francResult === "arb" || isMostlyArabic(input);
  }
  return isMostlyArabic(input);
}

async function validateMarketingInputMiddleware(req, res, next) {
  try {
    let { productService, targetAudience, keyBenefits, callToAction } =
      req.body;

    console.log("المدخلات المستلمة:", {
      productService,
      targetAudience,
      keyBenefits,
      callToAction,
    });

    // Check for missing fields
    if (!productService || !targetAudience || !keyBenefits || !callToAction) {
      return res.status(400).json({
        status: "error",
        message:
          "جميع الحقول (اسم المنتج/الخدمة، الجمهور المستهدف، الفوائد الرئيسية، الدعوة للعمل) مطلوبة.",
      });
    }

    // Normalize whitespace for all fields
    productService = productService.trim().replace(/\s+/g, " ");
    targetAudience = targetAudience.trim().replace(/\s+/g, " ");
    callToAction = callToAction.trim().replace(/\s+/g, " ");
    keyBenefits = keyBenefits.map((benefit) =>
      benefit.trim().replace(/\s+/g, " ")
    );

    // Language validation for each field
    const isProductServiceArabic = await validateLanguage(productService);
    const isTargetAudienceArabic = await validateLanguage(targetAudience);
    const isCallToActionArabic = await validateLanguage(callToAction);

    console.log(
      `فحص اسم المنتج/الخدمة باللغة العربية: ${isProductServiceArabic}`
    );
    console.log(
      `فحص الجمهور المستهدف باللغة العربية: ${isTargetAudienceArabic}`
    );
    console.log(`فحص الدعوة للعمل باللغة العربية: ${isCallToActionArabic}`);

    // Check if keyBenefits are mostly Arabic
    const areKeyBenefitsMostlyArabic = keyBenefits.every(isMostlyArabic);

    if (
      !isProductServiceArabic ||
      !isTargetAudienceArabic ||
      !isCallToActionArabic ||
      !areKeyBenefitsMostlyArabic
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "يجب أن يكون المحتوى المدخل في معظمه باللغة العربية مع السماح ببعض المصطلحات الإنجليزية.",
      });
    }

    console.log(
      "تمت جميع عمليات التحقق بنجاح. الانتقال إلى المعالجة التالية..."
    );
    next();
  } catch (error) {
    console.error("حدث خطأ في validateMarketingInputMiddleware:", error);
    return res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة لاحقًا.",
    });
  }
}

module.exports = validateMarketingInputMiddleware;
