import { Controller } from '@/presentation/contracts';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { makeLogControllerDecorator } from '../decorators';
import { makeDbLoadSurveyById, makeDbSaveSurveyResult } from '../usecases';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult(),
  );

  return makeLogControllerDecorator(controller);
};
