import { EmailValidatorAdapter } from './email-validator-adapter';

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidatorAdapter', () => {
  it('should return false if validator returns false', async () => {
    const sut = makeSut();

    expect(sut.isValid('invalid_email')).toBe(false);
  });
});
