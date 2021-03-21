import { DbLoadSurveyResult } from '@/application/usecases';
import { SurveyResultsMongoRepository } from '@/infra/db/mongodb';

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyResultsRespository = new SurveyResultsMongoRepository();
  return new DbLoadSurveyResult(surveyResultsRespository);
};
