import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy,
} from '@/application/test/mocks';
import { mockSaveSurveyResultParams, throwError } from '@/domain/test/mocks';

import { DbSaveSurveyResult } from './db-save-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
  );

  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 14, 8));

describe('DbSaveSurveyResult Usecase', () => {
  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    const saveSurveyResultParams = mockSaveSurveyResultParams();
    await sut.save(saveSurveyResultParams);

    expect(saveSurveyResultRepositorySpy.saveSurveyResultParams).toEqual(
      saveSurveyResultParams,
    );
  });

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockRejectedValueOnce(throwError);

    await expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow();
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const saveSurveyResultParams = mockSaveSurveyResultParams();
    await sut.save(saveSurveyResultParams);

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(
      saveSurveyResultParams.surveyId,
    );
    expect(loadSurveyResultRepositorySpy.accountId).toBe(
      saveSurveyResultParams.accountId,
    );
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockRejectedValueOnce(throwError);

    await expect(sut.save(mockSaveSurveyResultParams())).rejects.toThrow();
  });

  it('should return SurveyResult on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const saveResult = await sut.save(mockSaveSurveyResultParams());

    expect(saveResult).toEqual(loadSurveyResultRepositorySpy.surveyResult);
  });
});
