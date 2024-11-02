const MIN_LENGTH_FOR_FRANC = 20; // Minimum character length for using franc
const arabicRegex =
  /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669\s]+$/; // Simple regex to check if input is in Arabic script

function isArabicByRegex(text) {
  return arabicRegex.test(text);
}

async function validateLanguage(input) {
  // For longer input, use both franc and regex
  if (input.length >= MIN_LENGTH_FOR_FRANC) {
    const { franc } = await import("franc-all");
    const francResult = franc(input);
    console.log(`نتيجة فحص franc: ${francResult}`);

    // Return true if either franc detects Arabic or the regex check passes
    return francResult === "arb" || isArabicByRegex(input);
  }

  // For shorter input, use regex only
  const regexResult = isArabicByRegex(input);
  console.log(`نتيجة فحص regex: ${regexResult}`);
  return regexResult;
}

async function validateProfessionalEmailInputMiddleware(req, res, next) {
  try {
    let { purpose, recipient, tone, mainDetails, cta } = req.body;

    console.log("المدخلات المستلمة:", {
      purpose,
      recipient,
      tone,
      mainDetails,
      cta,
    });

    // Check presence of all required fields
    if (!purpose || !recipient || !tone || !mainDetails || !cta) {
      return res.status(400).json({
        status: "error",
        message:
          "جميع الحقول (الغرض، المستلم، النبرة، التفاصيل الرئيسية، الدعوة للعمل) مطلوبة.",
      });
    }

    // Trim and normalize whitespace for all fields
    purpose = purpose.trim().replace(/\s+/g, " ");
    mainDetails = mainDetails.trim().replace(/\s+/g, " ");
    cta = cta.trim().replace(/\s+/g, " ");

    // Language detection using both franc and regex
    const isPurposeArabic = await validateLanguage(purpose);
    const isMainDetailsArabic = await validateLanguage(mainDetails);
    const isCtaArabic = await validateLanguage(cta);

    console.log(`فحص الغرض باللغة العربية: ${isPurposeArabic}`);
    console.log(`فحص التفاصيل الرئيسية باللغة العربية: ${isMainDetailsArabic}`);
    console.log(`فحص الدعوة للعمل باللغة العربية: ${isCtaArabic}`);

    if (!isPurposeArabic || !isMainDetailsArabic || !isCtaArabic) {
      return res.status(400).json({
        status: "error",
        message: "يجب أن يكون المحتوى المدخل باللغة العربية.",
      });
    }

    console.log(
      "تمت جميع عمليات التحقق بنجاح. الانتقال إلى المعالجة التالية..."
    );
    next();
  } catch (error) {
    console.error(
      "حدث خطأ في validateProfessionalEmailInputMiddleware:",
      error
    );
    return res.status(500).json({
      status: "error",
      message: "حدث خطأ أثناء معالجة الطلب. الرجاء المحاولة لاحقًا.",
    });
  }
}

module.exports = validateProfessionalEmailInputMiddleware;
