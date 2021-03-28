import faker from 'faker';

import { LoadSurveyResultRepositorySpy } from '@/application/test/mocks';
import { throwError } from '@/domain/test/mocks';

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

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 17, 8));

let surveyId: string;
let accountId: string;

describe('DbLoadSurveyResult UseCase', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid();
    accountId = faker.random.uuid();
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();

    await sut.load(surveyId, accountId);

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId);
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockRejectedValueOnce(throwError);

    await expect(sut.load(surveyId, accountId)).rejects.toThrow();
  });

  it('should return survey result on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();

    const surveyResult = await sut.load(surveyId, accountId);

    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResult);
  });
});
