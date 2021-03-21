import { HttpRequest } from '@/presentation/contracts';
import { LoadSurveyResultSpy } from '@/presentation/test/mocks';

import { LoadSurveyResultController } from './load-survey-result-controller';

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(loadSurveyResultSpy);

  return {
    sut,
    loadSurveyResultSpy,
  };
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

describe('LoadSurveyResultController', () => {
  it('should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const loadSpy = jest.spyOn(loadSurveyResultSpy, 'load');

    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith(makeFakeRequest().params.surveyId);
  });
});
