import { DbLoadSurveyById } from '@/application/usecases';
import { SurveysMongoRepository } from '@/infra/db/mongodb';

export const makeDbLoadSurveyById = (): DbLoadSurveyById => {
  const surveysMongoRepository = new SurveysMongoRepository();
  return new DbLoadSurveyById(surveysMongoRepository);
};
