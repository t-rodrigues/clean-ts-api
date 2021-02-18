import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';

import { mockAuthenticationParams, throwError } from '@/domain/test/mocks';
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test/mocks';
import { LoginController } from './login-controller';

type SutTypes = {
  sut: LoginController;
  authenticationSpy: AuthenticationSpy;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);

  return {
    sut,
    authenticationSpy,
    validationSpy,
  };
};

const makeFakeRequest = () => ({ body: mockAuthenticationParams() });

describe('LoginController', () => {
  describe('Authentication', () => {
    it('should call Authentication with correct values', async () => {
      const { sut, authenticationSpy } = makeSut();
      const authSpy = jest.spyOn(authenticationSpy, 'auth');
      await sut.handle(makeFakeRequest());

      expect(authSpy).toHaveBeenCalledWith(mockAuthenticationParams());
    });

    it('should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticationSpy } = makeSut();
      jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(unauthorized());
    });

    it('should return 500 if Authentication throws', async () => {
      const { sut, authenticationSpy } = makeSut();
      jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  describe('Validation', () => {
    it('should call Validation with correct value', async () => {
      const { sut, validationSpy } = makeSut();
      const validateSpy = jest.spyOn(validationSpy, 'validate');
      await sut.handle(makeFakeRequest());

      expect(validateSpy).toHaveBeenCalledWith(mockAuthenticationParams());
    });

    it('should return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut();
      jest
        .spyOn(validationSpy, 'validate')
        .mockReturnValueOnce(new MissingParamError('any_field'));
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(
        badRequest(new MissingParamError('any_field')),
      );
    });
  });

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'token' }));
  });
});
