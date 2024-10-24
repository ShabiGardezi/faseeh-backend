const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
const { WATSON_API_KEY, WATSON_URL, WATSON_VERSION } = require("./environment");

const projectIds = {
  professionalEmail: "efa13c2a-416e-4ebc-a9e5-db4affda7983",
  tashkeel: "133cf26d-ccbb-4adf-8793-b644aa85f023",
  proofReading : "d50e5302-695b-4a8d-b2e5-1a3e7a25b929"
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
