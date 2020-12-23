import { Controller } from '@/presentation/contracts';
import { SignUpController } from '@/presentation/controllers/signup/signup';
import { makeDbAddAccount, makeLogControllerDecorator } from '@/main/factories';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
  );

  return makeLogControllerDecorator(controller);
};
