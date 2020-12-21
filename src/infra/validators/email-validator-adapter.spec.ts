import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(email: string): boolean {
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
});
