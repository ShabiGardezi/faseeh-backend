const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
const { WATSON_API_KEY, WATSON_URL, WATSON_VERSION } = require("./environment");

const projectIds = {
  professionalEmail: "efa13c2a-416e-4ebc-a9e5-db4affda7983",
  tashkeel: "133cf26d-ccbb-4adf-8793-b644aa85f023",
  proofReading: "d50e5302-695b-4a8d-b2e5-1a3e7a25b929",
  grammer: "a36f820a-1829-4695-bb7c-dbe8dfd39547",
  childrenStory: "b84b33c4-5bed-4717-bbcf-d64e8d25677b",
  marketing: "63d24698-057a-4e50-90e6-e11edd5eb788",
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
