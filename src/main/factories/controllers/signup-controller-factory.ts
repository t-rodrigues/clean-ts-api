import { Controller } from '@/presentation/contracts';
import { SignUpController } from '@/presentation/controllers/signup';

import { makeDbAddAccount, makeLogControllerDecorator } from '@/main/factories';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../usecases';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeDbAuthentication(),
    makeSignUpValidation(),
  );

  return makeLogControllerDecorator(controller);
};
