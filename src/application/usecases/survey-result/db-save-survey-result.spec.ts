import { SaveSurveyResultRepositorySpy } from '@/application/test/mocks';
import {
  mockSaveSurveyResult,
  mockSaveSurveyResultParams,
  throwError,
} from '@/domain/test/mocks';

import { DbSaveSurveyResult } from './db-save-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy);

  return {
    sut,
    saveSurveyResultRepositorySpy,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 14, 8));

describe('DbSaveSurveyResult Usecase', () => {
  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositorySpy, 'save');
    await sut.save(mockSaveSurveyResultParams());

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams());
  });

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockImplementationOnce(throwError);

    await expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow();
  });

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut();
    const saveResult = await sut.save(mockSaveSurveyResultParams());

    expect(saveResult).toEqual(mockSaveSurveyResult());
  });
});
