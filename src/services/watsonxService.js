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
      input: `${systemPrompt}\n\n${userPrompt}`,
      projectId: projectIds.professionalEmail,
      modelId: "sdaia/allam-1-13b-instruct",
      parameters: {
        max_new_tokens: 400,
        temperature: 0.7,
        top_p: 0.7,
        repetition_penalty: 1.1,
        top_k: 50,
      },
    };

    return await watsonxAIService.generateText(params);
  }
}

module.exports = WatsonXService;
