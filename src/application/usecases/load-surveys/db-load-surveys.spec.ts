import { LoadSurveysRepository } from '@/application/contracts';
import { Survey } from '@/domain/entities';

import { DbLoadSurveys } from './db-load-surveys';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeFakeSurveys = (): Survey[] => {
  return [
    {
      id: '1',
      question: 'Question 1',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: '2',
      question: 'Question 2',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
    {
      id: '3',
      question: 'Question 3',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer',
        },
      ],
      date: new Date(),
    },
  ];
};

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<Survey[]> {
      return Promise.resolve(makeFakeSurveys());
    }
  }
  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

describe('DbLoadSurvyes', () => {
  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('should return a list of Surveys on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.load();

    expect(httpResponse).toEqual(makeFakeSurveys());
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    await expect(sut.load()).rejects.toThrow();
  });
});
