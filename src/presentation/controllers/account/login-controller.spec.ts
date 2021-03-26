import faker from 'faker';

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

const mockRequest = () => ({ body: mockAuthenticationParams() });

describe('LoginController', () => {
  describe('Authentication', () => {
    it('should call Authentication with correct values', async () => {
      const { sut, authenticationSpy } = makeSut();
      const httpRequest = mockRequest();
      await sut.handle(httpRequest);

      expect(authenticationSpy.authParams).toEqual(httpRequest.body);
    });

    it('should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticationSpy } = makeSut();
      authenticationSpy.token = null;
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(unauthorized());
    });

    it('should return 500 if Authentication throws', async () => {
      const { sut, authenticationSpy } = makeSut();
      jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  describe('Validation', () => {
    it('should call Validation with correct value', async () => {
      const { sut, validationSpy } = makeSut();
      const httpRequest = mockRequest();
      await sut.handle(httpRequest);

      expect(validationSpy.input).toEqual(httpRequest.body);
    });

    it('should return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut();
      validationSpy.error = new MissingParamError(faker.random.word());
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(badRequest(validationSpy.error));
    });
  });

  it('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ accessToken: authenticationSpy.token }));
  });
});
