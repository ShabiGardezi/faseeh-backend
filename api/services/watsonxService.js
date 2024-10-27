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

  tashkeel: `Task: Add proper Arabic vowelization (tashkeel/diacritics) to the following Arabic text while maintaining its meaning and grammatical correctness. The input may contain multiple lines and spaces.

Instructions:
- Add all necessary diacritical marks (حَرَكَات) including:
  * Fatha (فَتحة)
  * Kasra (كِسرة)
  * Damma (ضَمة)
  * Sukun (سُكُون)
  * Shadda (شَدة)
  * Tanwin (تنوين)
- Process each word independently, preserving all spaces and line breaks
- Maintain the original text structure exactly as provided
- Apply tashkeel to every word, regardless of its position in the text
- Ensure proper Arabic grammar rules (قواعد النحو) are followed
- Return the text with exactly the same formatting as input, only adding diacritics

Note: Process the entire text as a single unit while preserving its structure. The output should maintain all original spacing and line breaks.`,

  proofread: `SYSTEM: You are in strict correction-only mode. Output must contain only the corrected Arabic text with no additional content.

TASK: Proofread and correct the Arabic text, fixing grammar, spelling, and punctuation. Return the corrected text exactly as is, with no additions.

FORMAT: Return corrected Arabic text only. Stop immediately after the last Arabic character or punctuation mark. Any text in other languages or meta-notes will be considered an error.

المطلوب: تصحيح النص التالي وإعادته مباشرة دون أي إضافات أو تعليقات:

النص:`,

  grammar_analysis: `SYSTEM: You are an Arabic grammar analyzer. Analyze each word's grammatical position exactly as shown in the example.

TASK: Provide grammatical analysis (إعراب) for each word. Follow the exact format shown in the example below.

Example Input: ذهب أحمد للمدرسة
Example Output: ذهب: فعل ماضٍ مبني على الفتح.أحمد: فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره.للمدرسة: اللام حرف جر، المدرسة: اسم مجرور وعلامة جره الكسرة الظاهرة على آخره.

Rules:
- Separate each word's analysis with a period
- Combine prepositions with their nouns in analysis
- No line breaks
- No additional explanations
- Exact format matching the example

النص:`,
  story: `
  أنت كاتب محترف متخصص في كتابة قصص الأطفال التعليمية. مهمتك كتابة قصة تربوية للأطفال تستند على مثل عربي.

  إرشادات كتابة القصة:
  1. ابدأ القصة بـ "كان يا مكان"
  2. اجعل البطل الرئيسي هو الطفل المذكور في المدخلات
  3. اربط القصة بالمثل العربي بشكل غير مباشر
  4. استخدم لغة بسيطة تناسب عمر الطفل
  5. اجعل القصة تحتوي على:
     - مقدمة تعرف بالشخصية الرئيسية
     - حدث أو تحدي رئيسي
     - حل يرتبط بمعنى المثل
     - خاتمة تذكر المثل وتوضح معناه
  6. اجعل طول القصة مناسباً (400-600 كلمة)
  7. ادمج المثل في سياق القصة مرتين على الأقل
  8. اختم القصة بذكر المثل والحكمة المستفادة منه
  `,
  marketing: `
    You are an expert marketing copywriter. Create compelling marketing text that:
    - Starts with an attention-grabbing headline
    - Speaks directly to the target audience's needs and desires
    - Clearly communicates the key benefits in a persuasive way
    - Uses engaging and persuasive language
    - Ends with a strong call-to-action
    
    Format the text with:
    1. A bold headline
    2. 2-3 compelling paragraphs
    3. The call-to-action at the end
    
    Keep the tone professional yet conversational, and focus on creating emotional connection with the audience.
    `,
};

const DEFAULT_MODEL_PARAMS = {
  max_new_tokens: 900,
  temperature: 0.7,
  top_p: 0.7,
  repetition_penalty: 1,
  top_k: 50,
  decoding_method: "greedy",
  stop_sequences: ['"""'],
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

  // Normalize line endings and ensure proper text boundaries
  const normalizedContent = content.replace(/\r\n/g, "\n").trim();

  const prompt = `${PROMPTS.tashkeel}

Input text:
"""
${normalizedContent}
"""

Vowelized output:
"""`;

  const response = await generateResponse({
    input: prompt,
    projectId: projectIds.tashkeel,
    modelId: "sdaia/allam-1-13b-instruct",
  });

  response.generated_text = response.generated_text.replace(/"""/g, "").trim();

  return response;
}

async function generateProofReadingText(reqBody) {
  const { content } = reqBody;

  const prompt = `${PROMPTS.proofread}
${content}

النص المصحح:`;
  return await generateResponse({
    input: prompt,
    projectId: projectIds.proofReading,
    modelId: "sdaia/allam-1-13b-instruct",
  });
}

async function generateGrammaticalAnalysisText(reqBody) {
  const { content } = reqBody;

  const prompt = `${PROMPTS.grammar_analysis}
${content}

الإعراب:`;

  return await generateResponse({
    input: prompt,
    projectId: projectIds.grammer,
    modelId: "sdaia/allam-1-13b-instruct",
  });
}

async function generateChildrenStoryText(reqBody) {
  const { childName, age, proverb } = reqBody;

  if (!childName || !age || !proverb) {
    throw new Error(
      "Missing required parameters: childName, age, and proverb are required"
    );
  }

  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum < 1 || ageNum > 18) {
    throw new Error("Age must be a number between 1 and 18");
  }

  const input = constructStoryPrompt({
    childName,
    age: ageNum,
    proverb,
  });

  return await generateResponse({
    input,
    projectId: projectIds.childrenStory,
    modelId: "sdaia/allam-1-13b-instruct",
  });
}

async function generateMarketingText(reqBody) {
  const { productService, targetAudience, keyBenefits, callToAction } = reqBody;

  validateInputs({
    productService,
    targetAudience,
    keyBenefits,
    callToAction,
  });

  const input = constructMarketingPrompt({
    productService,
    targetAudience,
    keyBenefits,
    callToAction,
  });

  return await generateResponse({
    input,
    projectId: projectIds.marketing,
    modelId: "sdaia/allam-1-13b-instruct",
  });
}

const validateInputs = ({
  productService,
  targetAudience,
  keyBenefits,
  callToAction,
}) => {
  if (!productService?.trim()) {
    throw new Error("Product/Service name is required");
  }
  if (!targetAudience?.trim()) {
    throw new Error("Target audience description is required");
  }
  if (keyBenefits.length <= 0) {
    throw new Error("Key benefits are required");
  }
  if (!callToAction?.trim()) {
    throw new Error("Call to action is required");
  }
};

const constructMarketingPrompt = ({
  productService,
  targetAudience,
  keyBenefits,
  callToAction,
}) => {
  return `
  ${PROMPTS.marketing}

  Product/Service Information:
  Name: ${productService}
  
  Target Audience:
  ${targetAudience}
  
  Key Benefits:
  ${keyBenefits.map((benefit) => `- ${benefit}`).join("\n")}
  
  Call to Action:
  ${callToAction}

  Generate a single, compelling marketing text that effectively combines all these elements.
  `;
};

const constructStoryPrompt = ({ childName, age, proverb }) => {
  return `
  ${PROMPTS.story}

  معلومات القصة:
  - اسم الطفل: ${childName}
  - العمر: ${age} سنوات
  - المثل العربي: "${proverb}"

  اكتب قصة كاملة تناسب هذه المعلومات. القصة يجب أن تكون مترابطة وممتعة وتعليمية.
  `;
};

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
  generateProofReadingText,
  generateGrammaticalAnalysisText,
  generateChildrenStoryText,
  generateMarketingText,
};
