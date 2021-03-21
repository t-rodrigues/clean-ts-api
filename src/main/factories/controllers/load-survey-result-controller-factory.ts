import { Controller } from '@/presentation/contracts';
import { LoadSurveyResultController } from '@/presentation/controllers';
import { makeLogControllerDecorator } from '../decorators';
import { makeDbLoadSurveyResult } from '../usecases';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyResult());

  return makeLogControllerDecorator(controller);
};
