import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { LogControllerDecorator } from './log-controller-decorator';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          any: 'any_response',
        },
      };
      return httpResponse;
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub,
  };
};

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid_mail@mail.com',
        password: '123123',
        passwordConfirmation: '123123',
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid_mail@mail.com',
        password: '123123',
        passwordConfirmation: '123123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        any: 'any_response',
      },
    });
  });
});
