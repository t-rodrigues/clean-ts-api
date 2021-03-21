import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy,
} from '@/application/test/mocks';
import {
  mockSurveyResult,
  mockSaveSurveyResultParams,
  throwError,
} from '@/domain/test/mocks';

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
    const saveSpy = jest.spyOn(saveSurveyResultRepositorySpy, 'save');
    await sut.save(mockSaveSurveyResultParams());

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams());
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
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositorySpy,
      'loadBySurveyId',
    );
    await sut.save(mockSaveSurveyResultParams());

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      mockSaveSurveyResultParams().surveyId,
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
    const { sut } = makeSut();
    const saveResult = await sut.save(mockSaveSurveyResultParams());

    expect(saveResult).toEqual(mockSurveyResult());
  });
});
