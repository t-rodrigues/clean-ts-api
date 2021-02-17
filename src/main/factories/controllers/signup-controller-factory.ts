import { Controller } from '@/presentation/contracts';
import { SignUpController } from '@/presentation/controllers';
import {
  makeDbAddAccount,
  makeDbAuthentication,
  makeLogControllerDecorator,
} from '@/main/factories';

import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeDbAuthentication(),
    makeSignUpValidation(),
  );

  return makeLogControllerDecorator(controller);
};
