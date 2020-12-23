import { EmailValidatorAdapter } from '@/infra/validators';
import { Controller } from '@/presentation/contracts';
import { SignUpController } from '@/presentation/controllers/signup/signup';
import { makeDbAddAccount, makeLogControllerDecorator } from '@/main/factories';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();

  const controller = new SignUpController(
    emailValidator,
    makeDbAddAccount(),
    makeSignUpValidation(),
  );

  return makeLogControllerDecorator(controller);
};
