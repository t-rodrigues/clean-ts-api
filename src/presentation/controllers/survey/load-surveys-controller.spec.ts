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

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 12, 8));

describe('LoadSurveysController', () => {
  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysSpy, 'load');
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(ok(loadSurveysSpy.surveys));
  });

  it('should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockReturnValueOnce(Promise.resolve([]));

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest
      .spyOn(loadSurveysSpy, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
