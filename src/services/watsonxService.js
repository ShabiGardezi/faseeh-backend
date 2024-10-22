const { watsonxAIService, projectIds } = require("../config/watsonx");

class WatsonXService {
  static async generateProfessionalEmailText(reqBody) {
    const { purpose, recipient, tone, mainDetails, cta } = reqBody;

    const toneGuides = {
      formal: {
        style: "highly professional and business-appropriate",
        language: "formal business English",
        greeting: "Dear Mr./Ms./Dr.",
        closing: "Sincerely,\nYours faithfully,",
      },
      friendly: {
        style: "warm yet professional",
        language: "polite and approachable",
        greeting: "Hello,\nDear",
        closing: "Best regards,\nKind regards,",
      },
      informal: {
        style: "casual and conversational",
        language: "simple and direct",
        greeting: "Hi,\nHey",
        closing: "Thanks,\nBest,",
      },
    };

    const selectedTone = toneGuides[tone.toLowerCase()] || toneGuides.formal;

    const systemPrompt = `You are an AI email writing assistant. Create a ${selectedTone.style} email based on the following structured information:

Role: Professional email composer
Task: Generate a clear, purposeful email
Style: ${selectedTone.style}
Language: ${selectedTone.language}`;

    const userPrompt = `Generate an email with these specifics:

PURPOSE: ${purpose}
RECIPIENT: ${recipient}
MAIN DETAILS: ${mainDetails}

Requirements:
1. Use ${selectedTone.style} tone throughout
2. Create a clear subject line based on the purpose
3. Use appropriate greeting from: ${selectedTone.greeting}
4. Organize main details in clear paragraphs
5. Include a clear call-to-action if needed
6. End with appropriate closing from: ${selectedTone.closing}
7. Keep it concise and focused
8. Ensure all key points from MAIN DETAILS are addressed


Format the email with:
- Subject line
- Appropriate greeting
- Main body
- Clear closing
- Sender placeholder

**Please respond with only the email text, without any additional notes or explanations.**
`;

    const question = `الغرض من البريد الإلكتروني هو ${purpose}، موجه إلى ${recipient}، مكتوب بنبرة ${tone}، يحتوي على التفاصيل الرئيسية ${mainDetails}، مع دعوة للعمل ${cta}.`;

    const formatedQuestion = `<s> [INST] ${question} [/INST]`;

    const prompt_input = `"""<<SYS>>
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
<</SYS>>

 اجتماع عاجل لجميع اعضاء الفريق رسميه بشأن انهاء اجراءات المشروع احضار المستندات اللازمه كل حسب مهمته [/INST]  موضوع: دعوة لاجتماع فريق رسمي لمناقشة إتمام إجراءات المشروع

السلام عليكم ورحمة الله وبركاته،

أتوجه إليكم بهذه الرسالة بصفتي [اسمك ومنصبك] في شركتنا الموقرة، داعياً لعقد اجتماع فريق رسمي لمناقشة إتمام إجراءات مشروعنا الحالي.

الغرض: إتمام إجراءات المشروع والتأكد من جاهزية جميع المستندات والمعلومات اللازمة.

المستلم: أعضاء الفريق الكرام

النبرة: رسمية

التفاصيل الأساسية:
1. سيتم عقد الاجتماع خلال الأسبوع القادم، ونرجو منكم تحديد الوقت المناسب لكم.
2. يُفضّل أن يكون الاجتماع وجهاً لوجه إذا أمكن، وفي حال تعذر ذلك يمكن استخدام أدوات التواصل عن بعد.
3. يُرجى من كل عضو في الفريق تحضير المستندات والمعلومات المتعلقة بمهمته الخاصة بالمشروع.

دعوة لاتخاذ إجراء (CTA):
نرجو منكم تأكيد حضوركم للاجتماع وتحديد الوقت المناسب لكم عن طريق الرد على هذه الرسالة في أقرب وقت ممكن.

شكراً لتعاونكم وتفانيكم في إتمام مشروعنا بنجاح. معاً يمكننا تحقيق أهدافنا وتعزيز مكانة شركتنا.

إذا كنت بحاجة إلى مزيد من المعلومات أو المساعدة بخصوص الاجتماع، لا تترددوا في التواصل معي على البريد الإلكتروني [بريدك الإلكتروني] أو عبر الهاتف على [رقم هاتفك].

مع خالص التقدير والاحترام،

[اسمك ومنصبك]
[اسم الشركة]  </s><s> [INST]"""`;

    const input = `${prompt_input}${formatedQuestion}`;
    // const toneMapping = {
    //   Formal: "رسمي",
    //   Friendly: "ودي",
    //   Informal: "غير رسمي",
    // };

    // const prompt = `Write a professional email addressed to ${
    //   recipient || "the recipient"
    // }.
    // Purpose: ${purpose}
    // Email Tone: ${tone || "Formal"}
    // Main Details: ${mainDetails || "No additional details provided."}${
    //   cta ? `\nCall to Action: ${cta}` : ""
    // }

    // Please respond with the email text only, without any introductions or additional explanations.
    // Write the response in Arabic only.`;

    const params = {
      input: input,
      projectId: projectIds.professionalEmail,
      modelId: "sdaia/allam-1-13b-instruct",
      parameters: {
        max_new_tokens: 900,
        temperature: 0.7,
        top_p: 0.7,
        repetition_penalty: 1,
        top_k: 50,
        decoding_method: "greedy",
      },
    };

    const result = await watsonxAIService.generateText(params);

    return result.result.results[0];
  }
}

module.exports = WatsonXService;
