import { DbAddSurvey } from '@/application/usecases';
import { SurveysMongoRepository } from '@/infra/db/mongodb';

export const makeDbAddSurvey = (): DbAddSurvey => {
  const addSurveyRepository = new SurveysMongoRepository();

  return new DbAddSurvey(addSurveyRepository);
};
