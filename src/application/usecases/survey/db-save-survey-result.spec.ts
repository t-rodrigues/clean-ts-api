import { SaveSurveyResultRepository } from '@/application/contracts';
import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultDTO } from '@/domain/usecases';

import { DbSaveSurveyResult } from './db-save-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub);

  return {
    sut,
    saveSurveyResultRepositoryStub,
  };
};

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(saveSurveyResult: SaveSurveyResultDTO): Promise<SurveyResult> {
      return makeFakeSaveSurveyResult();
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

const makeFakeSaveSurveyResultDTO = (): Omit<SurveyResult, 'id'> => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_asnwer',
  date: new Date(),
});

const makeFakeSaveSurveyResult = (): SurveyResult =>
  Object.assign({}, makeFakeSaveSurveyResultDTO(), { id: 'any_id' });

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 14, 8));

describe('DbSaveSurveyResult Usecase', () => {
  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');
    await sut.save(makeFakeSaveSurveyResultDTO());

    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResultDTO());
  });
});
