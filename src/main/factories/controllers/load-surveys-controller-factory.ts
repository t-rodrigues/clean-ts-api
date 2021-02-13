import { Controller } from '@presentation/contracts';
import { LoadSurveysController } from '@presentation/controllers/survey';
import { makeLogControllerDecorator } from '../decorators';
import { makeDbLoadSurveys } from '../usecases';

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());

  return makeLogControllerDecorator(controller);
};
