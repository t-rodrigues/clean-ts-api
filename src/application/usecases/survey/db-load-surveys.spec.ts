import faker from 'faker';
import { LoadSurveysRepositorySpy } from '@/application/test/mocks';
import { throwError } from '@/domain/test/mocks';

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
    const accountId = faker.random.uuid();
    await sut.load(accountId);

    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockRejectedValueOnce(throwError);

    await expect(sut.load(faker.random.uuid())).rejects.toThrow();
  });

  it('should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load(faker.random.uuid());

    expect(surveys).toEqual(loadSurveysRepositorySpy.surveys);
  });
});
