import { throwError } from '@/domain/test/mocks';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidatorSpy } from '../test/mocks';

import { EmailValidation } from './email-validation';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorSpy: EmailValidatorSpy;
};

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation('email', emailValidatorSpy);

  return { sut, emailValidatorSpy };
};

describe('EmailValidation', () => {
  it('should call emailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid');
    sut.validate({ email: 'any_email' });

    expect(isValidSpy).toHaveBeenCalledWith('any_email');
  });

  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut();
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false);
    const isValid = sut.validate({ email: 'any_email' });

    expect(isValid).toEqual(new InvalidParamError('email'));
  });

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut();
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError);

    expect(sut.validate).toThrow();
  });
});
