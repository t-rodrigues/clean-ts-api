import { EmailValidatorAdapter } from '@/infra/validators';
import { Controller } from '@/presentation/contracts';
import { SignUpController } from '@/presentation/controllers/signup';
import { makeDbAddAccount } from '@/main/factories';
import { LogControllerDecorator } from '@/main/decorators';

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();

  const controller = new SignUpController(emailValidator, makeDbAddAccount());

  return new LogControllerDecorator(controller);
};
