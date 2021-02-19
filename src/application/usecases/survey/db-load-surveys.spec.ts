import { LoadSurveysRepositorySpy } from '@/application/test/mocks';
import { mockSurveys, throwError } from '@/domain/test/mocks';

import { DbLoadSurveys } from './db-load-surveys';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);

  return {
    sut,
    loadSurveysRepositorySpy,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

describe('DbLoadSurvyes', () => {
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, 'loadAll');
    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockRejectedValueOnce(throwError);

    await expect(sut.load()).rejects.toThrow();
  });

  it('should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.load();

    expect(httpResponse).toEqual(mockSurveys());
  });
});
