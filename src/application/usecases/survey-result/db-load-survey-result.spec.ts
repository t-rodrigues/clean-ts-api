import { LoadSurveyResultRepositorySpy } from '@/application/test/mocks';
import {
  mockLoadSurveyResultParams,
  mockSurveyResult,
  throwError,
} from '@/domain/test/mocks';

import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy);
  return {
    sut,
    loadSurveyResultRepositorySpy,
  };
};

describe('DbLoadSurveyResult UseCase', () => {
  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositorySpy,
      'loadBySurveyId',
    );

    await sut.load(mockLoadSurveyResultParams());

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      mockLoadSurveyResultParams(),
    );
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockRejectedValueOnce(throwError);

    await expect(sut.load(mockLoadSurveyResultParams())).rejects.toThrow();
  });

  it('should return survey result on success', async () => {
    const { sut } = makeSut();

    const surveyResult = await sut.load(mockLoadSurveyResultParams());

    expect(surveyResult).toEqual(mockSurveyResult());
  });
});
