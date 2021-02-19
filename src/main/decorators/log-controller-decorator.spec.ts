import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { serverError } from '@/presentation/helpers';

import { LogErrorRepositorySpy } from '@/application/test/mocks';
import { LogControllerDecorator } from './log-controller-decorator';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepositorySpy;
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return makeFakeResponse();
    }
  }
  return new ControllerStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'valid_mail@mail.com',
    password: '123123',
    passwordConfirmation: '123123',
  },
});

const makeFakeResponse = (): HttpResponse => ({
  statusCode: 200,
  body: {
    response: 'any_response',
  },
});

const makeFakeServerError = (): HttpResponse => {
  const error = new Error('any_error');
  error.stack = 'any_stack';
  return serverError(error);
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(makeFakeResponse());
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValue(makeFakeServerError());
    await sut.handle(makeFakeRequest());

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
