import { Validation } from '@/presentation/contracts';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
};
