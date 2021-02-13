import { Survey } from '@domain/entities';
import { LoadSurveys } from '@domain/usecases';
import { LoadSurveysController } from './load-surveys-controller';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
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
      date: new Date(Date.now()),
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
      date: new Date(Date.now()),
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
      date: new Date(Date.now()),
    },
  ];
};

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<Survey[]> {
      return makeFakeSurveys();
    }
  }
  return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return {
    sut,
    loadSurveysStub,
  };
};

describe('LoadSurveysController', () => {
  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });
});
