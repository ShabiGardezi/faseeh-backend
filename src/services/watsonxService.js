const { watsonxAIService, projectIds } = require("../config/watsonx");

const PROMPTS = {
  professionalEmail: `<<SYS>>
"أنت كاتب محترف متخصص في كتابة رسائل البريد الإلكتروني الرسمية والشخصية. مهمتك هي كتابة رسالة بريد إلكتروني بناءً على التفاصيل المقدمة. يجب أن تكون الرسالة واضحة، مهنية، ومباشرة، مع الحفاظ على نغمة مناسبة حسب الغرض من الرسالة (رسمية أو غير رسمية). تأكد من أن تكون الرسالة مهيكلة بشكل جيد، مع مقدمة موجزة توضح الهدف من الرسالة، ومحتوى الرسالة الأساسي الذي يتضمن التفاصيل الهامة، وخاتمة تتضمن دعوة واضحة إلى اتخاذ إجراء أو شكر."

ما يجب على المستخدم إدخاله:
الغرض من الرسالة:

توضيح السبب أو الهدف من البريد الإلكتروني (طلب، متابعة، دعوة، شكر، إلخ).
المستلم:

تحديد الشخص أو الجهة التي يتم إرسال الرسالة إليها (مثل عميل، زميل، مسؤول، إلخ).
نبرة الرسالة:

النبرة التي يجب أن تكون عليها الرسالة (رسمية، ودية، إلخ).
التفاصيل الأساسية:

أي معلومات أو تفاصيل يرغب المستخدم في إدراجها ضمن الرسالة (مثل المواعيد، الروابط، الطلبات، إلخ).
الدعوة إلى اتخاذ إجراء (CTA):

الإجراء الذي يرغب المستخدم أن يقوم به المستلم بعد قراءة الرسالة (مثل الرد، الموافقة، إلخ).
مثال على إدخالات المستخدم:
الغرض: طلب اجتماع لمناقشة مشروع جديد
المستلم: زميل في العمل
النبرة: رسمية
التفاصيل الأساسية: الاجتماع سيعقد في الأسبوع المقبل، يمكن اختيار التوقيت المناسب.
الدعوة إلى اتخاذ إجراء: يرجى الرد بتأكيد الموعد المناسب
<</SYS>>`,

  tashkeel: `Task: Add proper Arabic vowelization (tashkeel/diacritics) to the following text while maintaining its meaning and grammatical correctness.

Instructions:
- Add all necessary diacritical marks (حَرَكَات) including:
  * Fatha (فَتحة)
  * Kasra (كِسرة)
  * Damma (ضَمة)
  * Sukun (سُكُون)
  * Shadda (شَدة)
  * Tanwin (تنوين)
- Maintain the original meaning and grammatical structure
- Ensure proper Arabic grammar rules (قواعد النحو) are followed
- Keep the text exactly as provided without any additional explanations`,
};

const DEFAULT_MODEL_PARAMS = {
  max_new_tokens: 900,
  temperature: 0.7,
  top_p: 0.7,
  repetition_penalty: 1,
  top_k: 50,
  decoding_method: "greedy",
};

async function generateProfessionalEmailText(reqBody) {
  const { purpose, recipient, tone, mainDetails, cta } = reqBody;

  const question = formatEmailQuestion({
    purpose,
    recipient,
    tone,
    mainDetails,
    cta,
  });
  const input = constructPromptForProfessionalEmail(
    PROMPTS.professionalEmail,
    question
  );

  return await generateResponse({
    input,
    projectId: projectIds.professionalEmail,
    modelId: "sdaia/allam-1-13b-instruct",
  });
}

function constructPromptForProfessionalEmail(systemPrompt, question) {
  const formattedQuestion = `<s> [INST] ${question} [/INST]`;
  return `"""${systemPrompt}${formattedQuestion}"""`;
}

async function generateTashkeelText(reqBody) {
  const { content } = reqBody;

  const prompt = `${PROMPTS.tashkeel}

Input text:
${content}

Vowelized output:`;

  return await generateResponse({
    input: prompt,
    projectId: projectIds.tashkeel,
    modelId: "sdaia/allam-1-13b-instruct",
  });
}

function formatEmailQuestion({ purpose, recipient, tone, mainDetails, cta }) {
  return `الغرض من البريد الإلكتروني هو ${purpose}، موجه إلى ${recipient}، مكتوب بنبرة ${tone}، يحتوي على التفاصيل الرئيسية ${mainDetails}، مع دعوة للعمل ${cta}.`;
}

async function generateResponse({ input, projectId, modelId }) {
  const params = {
    input,
    projectId,
    modelId,
    parameters: DEFAULT_MODEL_PARAMS,
  };

  const result = await watsonxAIService.generateText(params);
  return result.result.results[0];
}

module.exports = {
  generateProfessionalEmailText,
  generateTashkeelText,
};
