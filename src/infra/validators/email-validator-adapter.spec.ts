import validator from 'validator';

import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', async () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    expect(sut.isValid('invalid_email')).toBe(false);
  });

  it('should return false if validator returns false', async () => {
    const sut = makeSut();

    expect(sut.isValid('valid_email')).toBe(true);
  });

  it('should call validator with correct value', async () => {
    const sut = makeSut();
    const validEmail = 'valid_email';
    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    sut.isValid(validEmail);

    expect(isEmailSpy).toHaveBeenCalledWith(validEmail);
  });
});
