import { Validation } from '@/presentation/contracts';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('@/validation/validators/validation-composite');

describe('SignUpValidationFactory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeSignUpValidation();

    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
