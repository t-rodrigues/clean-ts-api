import { Survey, SurveyResult } from '@/domain/entities';
import {
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultDTO,
} from '@/domain/usecases';
import { HttpRequest } from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError } from '@/presentation/helpers';

import { SaveSurveyResultController } from './save-survey-result-controller';

type SutTypes = {
  sut: SaveSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
  );

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
};

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<Survey | null> {
      return makeFakeSurvey();
    }
  }

  return new LoadSurveyByIdStub();
};

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultDTO): Promise<SurveyResult> {
      return makeFakeSurveyResult();
    }
  }

  return new SaveSurveyResultStub();
};

const makeFakeRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_valid_answer',
  },
});

const makeFakeSurvey = (): Survey => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_valid_answer',
    },
  ],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResult => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date(),
});

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 17, 8));

describe('SaveSurveyResultController', () => {
  describe('LoadSurveyById', () => {
    it('should call LoadSurveyById with correct values', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
      await sut.handle(makeFakeRequest());

      expect(loadByIdSpy).toHaveBeenCalledWith(
        makeFakeRequest().params.surveyId,
      );
    });

    it('should return 403 if LoadSurveyById returns null', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(null);
      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(
        forbidden(new InvalidParamError('surveyId')),
      );
    });

    it('should return 500 if LoadSurveyById throws', async () => {
      const { sut, loadSurveyByIdStub } = makeSut();
      jest
        .spyOn(loadSurveyByIdStub, 'loadById')
        .mockReturnValueOnce(Promise.reject(new Error()));

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
      const { sut, saveSurveyResultStub } = makeSut();
      const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');
      await sut.handle(makeFakeRequest());

      expect(saveSpy).toHaveBeenCalledWith({
        accountId: 'any_account_id',
        surveyId: 'any_survey_id',
        date: new Date(),
        answer: 'any_valid_answer',
      });
    });

    it('should return 500 if SaveSurveyResult throws', async () => {
      const { sut, saveSurveyResultStub } = makeSut();
      jest
        .spyOn(saveSurveyResultStub, 'save')
        .mockReturnValueOnce(Promise.reject(new Error()));

      const httpResponse = await sut.handle(makeFakeRequest());

      expect(httpResponse).toEqual(serverError(new Error()));
    });
  });
});
