import { HttpRequest } from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';

import {
  mockSaveSurveyResult,
  mockSaveSurveyResultParams,
  throwError,
} from '@/domain/test/mocks';
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

const makeFakeRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
});

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 17, 8));

describe('SaveSurveyResultController', () => {
  describe('LoadSurveyById', () => {
    it('should call LoadSurveyById with correct values', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut();
      const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, 'loadById');
      await sut.handle(makeFakeRequest());

      expect(loadByIdSpy).toHaveBeenCalledWith(
        makeFakeRequest().params.surveyId,
      );
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut();
      jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(
        forbidden(new InvalidParamError('surveyId')),
      );
    });

    it('should return 500 if LoadSurveyById throws', async () => {
      const { sut, loadSurveyByIdSpy } = makeSut();
      jest
        .spyOn(loadSurveyByIdSpy, 'loadById')
        .mockImplementationOnce(throwError);

      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });

    it('should return 403 if an invalid answer is provided', async () => {
      const { sut } = makeSut();
      const httpResponse = await sut.handle({
        params: {
          surveyId: 'any_survey_id',
        },
        body: {
          answer: 'invalid_answer',
        },
      });

      expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
    });
  });

  describe('SaveSurveyResult', () => {
    it('should call SaveSurveyResult with correct values', async () => {
      const { sut, saveSurveyResultSpy } = makeSut();
      const saveSpy = jest.spyOn(saveSurveyResultSpy, 'save');
      await sut.handle(makeFakeRequest());

      expect(saveSpy).toHaveBeenCalledWith({
        ...mockSaveSurveyResultParams(),
        date: new Date(),
      });
    });

    it('should return 500 if SaveSurveyResult throws', async () => {
      const { sut, saveSurveyResultSpy } = makeSut();
      jest
        .spyOn(saveSurveyResultSpy, 'save')
        .mockImplementationOnce(throwError);

      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok(mockSaveSurveyResult()));
  });
});
