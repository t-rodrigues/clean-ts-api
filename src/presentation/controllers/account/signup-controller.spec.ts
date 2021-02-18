import {
  EmailInUseError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors';
import {
  badRequest,
  created,
  forbidden,
  serverError,
} from '@/presentation/helpers';

import {
  mockAddAccountParams,
  mockAuthenticationParams,
  throwError,
} from '@/domain/test/mocks';
import {
  AddAccountSpy,
  AuthenticationSpy,
  ValidationSpy,
} from '@/presentation/test/mocks';
import { SignUpController } from './signup-controller';

type SutTypes = {
  sut: SignUpController;
  addAccountSpy: AddAccountSpy;
  authenticationSpy: AuthenticationSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new SignUpController(
    addAccountSpy,
    authenticationSpy,
    validationSpy,
  );

  return {
    sut,
    addAccountSpy,
    authenticationSpy,
    validationSpy,
  };
};

describe('SignUpController', () => {
  describe('AddAccount', () => {
    it('should call AddAccount with correct values', async () => {
      const { sut, addAccountSpy } = makeSut();
      const addSpy = jest.spyOn(addAccountSpy, 'add');
      await sut.handle({ body: mockAddAccountParams() });

      expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams());
    });

    it('should return 500 if AddAccount throws', async () => {
      const { sut, addAccountSpy } = makeSut();
      jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError);
      const httpResponse = await sut.handle({ body: mockAddAccountParams() });

      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    it('should return 403 if AddAccount returns null', async () => {
      const { sut, addAccountSpy } = makeSut();
      jest.spyOn(addAccountSpy, 'add').mockReturnValueOnce(null);
      const httpResponse = await sut.handle({ body: mockAddAccountParams() });

      expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
    });
  });

  describe('Validation', () => {
    it('should call Validation with correct value', async () => {
      const { sut, validationSpy } = makeSut();
      const validateSpy = jest.spyOn(validationSpy, 'validate');
      await sut.handle({ body: mockAddAccountParams() });

      expect(validateSpy).toHaveBeenCalledWith(mockAddAccountParams());
    });

    it('should return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut();
      jest
        .spyOn(validationSpy, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'));
      const httpResponse = await sut.handle({ body: mockAddAccountParams() });

      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field')),
      );
    });
  });

  describe('Authentication', () => {
    it('should call Authentication with correct values', async () => {
      const { sut, authenticationSpy } = makeSut();
      const authSpy = jest.spyOn(authenticationSpy, 'auth');
      await sut.handle({ body: mockAddAccountParams() });

      expect(authSpy).toHaveBeenCalledWith(mockAuthenticationParams());
    });

    it('should return 500 if Authentication throws', async () => {
      const { sut, authenticationSpy } = makeSut();
      jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
      const httpResponse = await sut.handle({ body: mockAddAccountParams() });

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  it('should return 201 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ body: mockAddAccountParams() });

    expect(httpResponse).toEqual(created({ accessToken: 'token' }));
  });
});
