import { Controller } from '@/presentation/contracts';
import { AddSurveyController } from '@/presentation/controllers/survey';
import { makeLogControllerDecorator } from '@/main/factories/decorators';
import { makeDbAddSurvey } from '@/main/factories/usecases';
import { makeAddSurveyValidation } from './add-survey-validation';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );

  return makeLogControllerDecorator(controller);
};
