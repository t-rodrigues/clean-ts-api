import { DbSaveSurveyResult } from '@/application/usecases';
import { SurveyResultsMongoRepository } from '@/infra/db/mongodb';

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultRepository = new SurveyResultsMongoRepository();
  return new DbSaveSurveyResult(surveyResultRepository);
};
