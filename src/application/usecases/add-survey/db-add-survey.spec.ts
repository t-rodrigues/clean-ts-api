import { AddSurveyRepository } from '@application/contracts';
import { AddSurveyDTO } from '@domain/usecases';

import { DbAddSurvey } from './db-add-survey';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepository implements AddSurveyRepository {
    async add(): Promise<void> {
      return null;
    }
  }

  return new AddSurveyRepository();
};

const makeFakeAddSurvey = (): AddSurveyDTO => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'kkkkkk',
    },
  ],
  date: new Date(Date.now()),
});

jest.spyOn(Date, 'now').mockImplementation(() => {
  return new Date(2021, 2, 12, 10).getTime();
});

describe('DbAddSurvey Usecase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    await sut.add(makeFakeAddSurvey());

    expect(addSpy).toHaveBeenCalledWith(makeFakeAddSurvey());
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(sut.add(makeFakeAddSurvey())).rejects.toThrow();
  });
});
