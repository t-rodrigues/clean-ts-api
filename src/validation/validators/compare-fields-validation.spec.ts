import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare');
};

describe('CompareFieldsValidation', () => {
  it('should return a InvalidParamError if validation fails', async () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_field' });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should not return if validation success', async () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_field',
      fieldToCompare: 'any_field',
    });

    expect(error).toBeFalsy();
  });
});
