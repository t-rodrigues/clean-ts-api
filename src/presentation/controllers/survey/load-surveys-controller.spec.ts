import faker from 'faker';
import { HttpRequest } from '@/presentation/contracts';
import { noContent, ok, serverError } from '@/presentation/helpers';
import { LoadSurveysSpy } from '@/presentation/test/mocks';

import { LoadSurveysController } from './load-surveys-controller';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysSpy: LoadSurveysSpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy();
  const sut = new LoadSurveysController(loadSurveysSpy);

  return {
    sut,
    loadSurveysSpy,
  };
};

const mockRequest = (): HttpRequest => ({
  accountId: faker.random.uuid(),
});

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

describe('LoadSurveysController', () => {
  it('should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(httpRequest.accountId).toBe(loadSurveysSpy.accountId);
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveys));
  });

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockReturnValueOnce(Promise.resolve([]));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(noContent());
  });

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest
      .spyOn(loadSurveysSpy, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
