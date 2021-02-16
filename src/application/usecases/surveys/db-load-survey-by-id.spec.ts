import { LoadSurveyByIdRepository } from '@/application/contracts';
import { Survey } from '@/domain/entities';

import { DbLoadSurveyById } from './db-load-survey-by-id';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const makeFakeSurvey = (): Survey => ({
  id: 'any_id',
  question: 'Question 1',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<Survey> {
      return Promise.resolve(makeFakeSurvey());
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return {
    sut,
    loadSurveyByIdRepositoryStub,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

describe('DbLoadSurveyById UseCase', () => {
  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut();
    const loadById = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById('any_id');

    expect(loadById).toHaveBeenCalledWith('any_id');
  });

  it('should return a Survey on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.loadById('any_id');

    expect(httpResponse).toEqual(makeFakeSurvey());
  });
});
