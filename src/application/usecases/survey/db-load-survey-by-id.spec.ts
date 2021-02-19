import { LoadSurveyByIdRepositorySpy } from '@/application/test/mocks';
import { mockSurvey, throwError } from '@/domain/test/mocks';
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

describe('DbLoadSurveyById UseCase', () => {
  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const loadById = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');
    await sut.loadById('any_id');

    expect(loadById).toHaveBeenCalledWith('any_id');
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockRejectedValueOnce(throwError);

    await expect(sut.loadById('any_id')).rejects.toThrow();
  });

  it('should return a Survey on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.loadById('any_id');

    expect(httpResponse).toEqual(mockSurvey());
  });
});
