import faker from 'faker';

import { LoadSurveyByIdRepositorySpy } from '@/application/test/mocks';
import { throwError } from '@/domain/test/mocks';
import { DbLoadSurveyById } from './db-load-survey-by-id';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyByIdRepositorySpy,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

let surveyId: string;

describe('DbLoadSurveyById UseCase', () => {
  beforeEach(() => {
    surveyId = faker.random.uuid();
  });

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadById(surveyId);

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockRejectedValueOnce(throwError);

    await expect(sut.loadById(surveyId)).rejects.toThrow();
  });

  it('should return a Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const survey = await sut.loadById(surveyId);

    expect(survey).toEqual(loadSurveyByIdRepositorySpy.survey);
  });
});
