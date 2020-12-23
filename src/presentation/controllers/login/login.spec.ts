// import { HttpRequest } from '@/presentation/contracts';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { LoginController } from './login';

const makeSut = (): LoginController => {
  return new LoginController();
};

// const makeRequest = (): HttpRequest => ({
//   body: {
//     email: 'any_email@mail.com',
//     password: '123123',
//   },
// });

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        password: '123123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
