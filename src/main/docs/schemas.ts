import {
  loginParamsSchema,
  accountSchema,
  addSurveyParamsSchema,
  apiKeyAuthSchema,
  errorSchema,
  saveSurveyParamsSchema,
  signUpParamsSchema,
  surveySchema,
  surveyAnswerSchema,
  surveyResultSchema,
  surveysSchema,
} from './schemas/';

export const schemas = {
  account: accountSchema,
  addSurveyParams: addSurveyParamsSchema,
  apiKeyAuth: apiKeyAuthSchema,
  error: errorSchema,
  loginParams: loginParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  signUpParams: signUpParamsSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveyResult: surveyResultSchema,
  surveys: surveysSchema,
};
