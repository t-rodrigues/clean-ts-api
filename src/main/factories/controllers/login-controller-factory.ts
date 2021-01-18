import { Controller } from '@/presentation/contracts';
import { LoginController } from '@/presentation/controllers/login';

import {
  makeLogControllerDecorator,
  makeDbAuthentication,
} from '@/main/factories';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation(),
  );

  return makeLogControllerDecorator(controller);
};
