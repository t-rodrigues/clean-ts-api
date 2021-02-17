import { Controller } from '@/presentation/contracts';
import { AddSurveyController } from '@/presentation/controllers';
import { makeDbAddSurvey, makeLogControllerDecorator } from '@/main/factories';

import { makeAddSurveyValidation } from './add-survey-validation';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );

  return makeLogControllerDecorator(controller);
};
