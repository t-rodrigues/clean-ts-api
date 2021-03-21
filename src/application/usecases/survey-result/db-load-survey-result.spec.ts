import { LoadSurveyResultRepositorySpy } from '@/application/test/mocks';
import { mockLoadSurveyResultParams } from '@/domain/test/mocks';

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
});
