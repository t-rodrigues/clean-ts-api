import faker from 'faker';

import { throwError } from '@/domain/test/mocks';
import { HttpRequest } from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
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

const mockRequest = (): HttpRequest => ({
  accountId: faker.random.uuid(),
  params: {
    surveyId: faker.random.uuid(),
  },
});

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 17, 8));

describe('LoadSurveyResultController', () => {
  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(loadSurveyResultSpy.surveyId).toBe(httpRequest.params.surveyId);
    expect(loadSurveyResultSpy.accountId).toBe(httpRequest.accountId);
  });

  it('should return 403 if LoadSurveyResult returns null', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    loadSurveyResultSpy.surveyResult = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResult));
  });
});
