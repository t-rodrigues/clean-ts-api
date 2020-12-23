import { SignUpController } from './signup';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '@/presentation/errors';
import { badRequest, created, serverError } from '@/presentation/helpers';
import { HttpRequest, Validation } from '@/presentation/contracts';
import { EmailValidator } from '@/validation/contracts';
import { AddAccount, AddAccountDTO } from '@/domain/usecases';
import { Account } from '@/domain/entities';

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validationStub,
  );
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
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
  body: {
    name: 'any_name',
    email: 'valid_email',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountDTO): Promise<Account> {
      return makeFakeAccount();
    }
  }

  return new AddAccountStub();
};

const makeFakeAccount = (): Account => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'valid_email',
  password: 'hashed_password',
});

describe('SignUpController', () => {
  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should call EmailValidor with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError(null);
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = makeFakeRequest();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'valid_email',
      password: 'any_password',
    });
  });

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, addAccountStub } = makeSut();
    const httpRequest = makeFakeRequest();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new ServerError(null);
    });

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError(null)));
  });

  it('should return 201 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(created(makeFakeAccount()));
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
