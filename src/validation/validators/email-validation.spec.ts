import { InvalidParamError, ServerError } from '@/presentation/errors';
import { EmailValidator } from '@/validation/contracts';
import { EmailValidation } from './email-validation';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub);

  return { sut, emailValidatorStub };
};

describe('EmailValidation', () => {
  it('should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({ email: 'any_email' });
    expect(emailValidatorSpy).toHaveBeenCalledWith('any_email');
  });

  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const isValid = sut.validate({ email: 'any_email' });
    expect(isValid).toEqual(new InvalidParamError('email'));
  });

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError(null);
    });

    expect(sut.validate).toThrow();
  });
});
