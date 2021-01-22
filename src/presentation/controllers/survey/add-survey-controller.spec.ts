import { AddSurvey, AddSurveyDTO } from '@domain/usecases/survey';
import { HttpRequest, Validation } from '@presentation/contracts';
import { badRequest, noContent, serverError } from '@presentation/helpers';

import { AddSurveyController } from './add-survey-controller';

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addSurveyStub = makeAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(surveyData: AddSurveyDTO): Promise<void> {
      return null;
    }
  }

  return new AddSurveyStub();
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
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
    ],
  },
});

describe('AddSurveyController', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut();
    jest
      .spyOn(addSurveyStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
