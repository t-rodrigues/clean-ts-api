import { AddSurveyRepositorySpy } from '@/application/test/mocks';
import { throwError, mockAddSurveyParams } from '@/domain/test/mocks';
import { DbAddSurvey } from './db-add-survey';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositorySpy: AddSurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);

  return {
    sut,
    addSurveyRepositorySpy,
  };
};

jest.useFakeTimers('modern').setSystemTime(new Date(2021, 1, 14, 8));

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);

    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData);
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest.spyOn(addSurveyRepositorySpy, 'add').mockRejectedValueOnce(throwError);

    await expect(sut.add(mockAddSurveyParams())).rejects.toThrow();
  });
});
