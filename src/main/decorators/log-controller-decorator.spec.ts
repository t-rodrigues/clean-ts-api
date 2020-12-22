import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/contracts';
import { LogControllerDecorator } from './log-controller-decorator';

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            any: 'any',
          },
        };
        return httpResponse;
      }
    }
    const controllerStub = new ControllerStub();

    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const sut = new LogControllerDecorator(controllerStub);

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
});
