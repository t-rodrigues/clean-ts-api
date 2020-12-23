import { Validation } from '@/presentation/contracts';
import {
  CompareFieldsValidation,
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
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
