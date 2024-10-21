const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
const { WATSON_API_KEY, WATSON_URL, WATSON_VERSION } = require("./environment");

const projectIds = {
  professionalEmail: "efa13c2a-416e-4ebc-a9e5-db4affda7983",
};

const watsonxAIService = WatsonXAI.newInstance({
  version: WATSON_VERSION,
  serviceUrl: WATSON_URL,
  authenticator: new IamAuthenticator({ apikey: WATSON_API_KEY }),
});

module.exports = {
  watsonxAIService,
  projectIds,
};
