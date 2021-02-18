import { throwError } from '@/domain/test/mocks';
import { HttpRequest } from '@/presentation/contracts';
import { badRequest, noContent, serverError } from '@/presentation/helpers';

import { AddSurveySpy, ValidationSpy } from '@/presentation/test/mocks';
import { AddSurveyController } from './add-survey-controller';

type SutTypes = {
  sut: AddSurveyController;
  validationSpy: ValidationSpy;
  addSurveySpy: AddSurveySpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addSurveySpy = new AddSurveySpy();
  const sut = new AddSurveyController(validationSpy, addSurveySpy);

  return {
    sut,
    validationSpy,
    addSurveySpy,
  };
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
    date: new Date(),
  },
});

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

describe('AddSurveyController', () => {
  describe('Validation', () => {
    it('should call Validation with correct values', async () => {
      const { sut, validationSpy } = makeSut();
      const validateSpy = jest.spyOn(validationSpy, 'validate');
      const httpRequest = makeFakeRequest();
      await sut.handle(httpRequest);

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 400 if Validation fails', async () => {
      const { sut, validationSpy } = makeSut();
      jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new Error());
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(badRequest(new Error()));
    });
  });

  describe('AddSurvey', () => {
    it('should call AddSurvey with correct values', async () => {
      const { sut, addSurveySpy } = makeSut();
      const addSpy = jest.spyOn(addSurveySpy, 'add');
      const httpRequest = makeFakeRequest();
      await sut.handle(httpRequest);

      expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 500 if AddSurvey throws', async () => {
      const { sut, addSurveySpy } = makeSut();
      jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError);
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(noContent());
  });
});
