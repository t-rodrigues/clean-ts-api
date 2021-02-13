import { DbLoadSurveys } from '@application/usecases';
import { SurveysMongoRepository } from '@infra/db/mongodb';

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveysRepository = new SurveysMongoRepository();
  return new DbLoadSurveys(surveysRepository);
};
