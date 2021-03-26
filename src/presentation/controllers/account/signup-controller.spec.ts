import faker from 'faker';

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

import { throwError } from '@/domain/test/mocks';
import {
  AddAccountSpy,
  AuthenticationSpy,
  ValidationSpy,
} from '@/presentation/test/mocks';
import { SignUpController } from './signup-controller';
import { HttpRequest } from '@/presentation/contracts';

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

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    },
  };
};

describe('SignUpController', () => {
  describe('AddAccount', () => {
    it('should call AddAccount with correct values', async () => {
      const { sut, addAccountSpy } = makeSut();
      const httpRequest = mockRequest();
      await sut.handle(httpRequest);

      expect(addAccountSpy.accountData).toEqual({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
      });
    });

    it('should return 500 if AddAccount throws', async () => {
      const { sut, addAccountSpy } = makeSut();
      jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(throwError);
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    it('should return 403 if AddAccount returns null', async () => {
      const { sut, addAccountSpy } = makeSut();
      addAccountSpy.account = null;
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
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

  describe('Authentication', () => {
    it('should call Authentication with correct values', async () => {
      const { sut, authenticationSpy } = makeSut();
      const httpRequest = mockRequest();
      await sut.handle(httpRequest);

      expect(authenticationSpy.authParams).toEqual({
        email: httpRequest.body.email,
        password: httpRequest.body.password,
      });
    });

    it('should return 500 if Authentication throws', async () => {
      const { sut, authenticationSpy } = makeSut();
      jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(throwError);
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  it('should return 201 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(
      created({ accessToken: authenticationSpy.token }),
    );
  });
});
