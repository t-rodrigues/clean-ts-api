import { Authentication, AuthenticationDTO } from '@/domain/usecases';
import { HttpRequest, Validation } from '@/presentation/contracts';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';
import { LoginController } from './login-controller';

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth({ email, password }: AuthenticationDTO): Promise<string> {
      return 'token';
    }
  }

  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: makeFakeAuthenticationDTO(),
});

const makeFakeAuthenticationDTO = (): AuthenticationDTO => ({
  email: 'any_email@mail.com',
  password: '123123',
});

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('LoginController', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(httpRequest);

    expect(authSpy).toHaveBeenCalledWith(makeFakeAuthenticationDTO());
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(null);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'token' }));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});