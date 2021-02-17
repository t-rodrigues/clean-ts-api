import { DbSaveSurveyResult } from '@/application/usecases';
import { SaveSurveyResultMongoRepository } from '@/infra/db/mongodb';

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const saveSurveyResultRepository = new SaveSurveyResultMongoRepository();
  return new DbSaveSurveyResult(saveSurveyResultRepository);
};
