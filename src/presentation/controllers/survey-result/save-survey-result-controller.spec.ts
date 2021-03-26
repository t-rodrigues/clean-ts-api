import faker from 'faker';

import { HttpRequest } from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';

import { throwError } from '@/domain/test/mocks';
import {
  LoadSurveyByIdSpy,
  SaveSurveyResultSpy,
} from '@/presentation/test/mocks';
import { SaveSurveyResultController } from './save-survey-result-controller';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  saveSurveyResultSpy: SaveSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
  );

  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
  };
};

const mockRequest = (answer: string = null): HttpRequest => ({
  accountId: faker.random.uuid(),
  params: {
    surveyId: faker.random.uuid(),
  },
  body: {
    answer,
  },
});

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 17, 8));

describe('SaveSurveyResultController', () => {
  describe('LoadSurveyById', () => {
    it('should call LoadSurveyById with correct values', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut();
      const httpRequest = mockRequest();
      await sut.handle(httpRequest);

      expect(loadSurveyByIdSpy.surveyId).toBe(httpRequest.params.surveyId);
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut();
      loadSurveyByIdSpy.survey = null;
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(
        forbidden(new InvalidParamError('surveyId')),
      );
    });

    it('should return 500 if LoadSurveyById throws', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut();
      jest
        .spyOn(loadSurveyByIdSpy, 'loadById')
        .mockImplementationOnce(throwError);

      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle(mockRequest());

      expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
    });
  });

  describe('SaveSurveyResult', () => {
    it('should call SaveSurveyResult with correct values', async () => {
      const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
      const httpRequest = mockRequest(
        loadSurveyByIdSpy.survey.answers[0].answer,
      );
      await sut.handle(httpRequest);

      expect(saveSurveyResultSpy.saveSurveyResult).toEqual({
        surveyId: httpRequest.params.surveyId,
        accountId: httpRequest.accountId,
        date: new Date(),
        answer: httpRequest.body.answer,
      });
    });

    it('should return 500 if SaveSurveyResult throws', async () => {
      const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
      jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(throwError);

      const httpResponse = await sut.handle(
        mockRequest(loadSurveyByIdSpy.survey.answers[0].answer),
      );

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  it('should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest(loadSurveyByIdSpy.survey.answers[0].answer);
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResult));
  });
});
