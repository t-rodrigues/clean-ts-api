import { MissingParamError } from '@/presentation/errors';
import { ValidationSpy } from '@/presentation/test/mocks';

import { ValidationComposite } from './validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: ValidationSpy[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [new ValidationSpy(), new ValidationSpy()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
};

describe('ValidateComposite', () => {
  it('should return an error if any validation fails', async () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more then one validation fails', async () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  it('should not return if validation success', async () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
