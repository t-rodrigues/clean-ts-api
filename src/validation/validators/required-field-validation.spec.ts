import { MissingParamError } from '@/presentation/errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredFieldValidation', () => {
  it('should return a MissinParamError if validation fails', async () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should not return if validation success', async () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ field: 'any_field' });

    expect(error).toBeFalsy();
  });
});
