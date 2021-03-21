import { HttpRequest } from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers';
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

  it('should return 403 if LoadSurveyResult returns null', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockReturnValueOnce(null);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });
});
