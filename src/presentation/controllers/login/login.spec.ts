import { HttpRequest } from '@/presentation/contracts';
import { MissingParamError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers';
import { EmailValidator } from '@/validation/contracts';
import { LoginController } from './login';

type SutTypes = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: '123123',
  },
});

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: '123123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    const emailValidatorSpy = jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false);

    await sut.handle(httpRequest);

    expect(emailValidatorSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
});
