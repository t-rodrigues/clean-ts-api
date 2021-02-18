import { Collection } from 'mongodb';
import { DbSurvey } from '@/application/dtos';
import { MongoHelper } from '@/infra/db/mongodb';

import { mockAddSurveyParams } from '@/domain/test/mocks';
import { SaveSurveyResultMongoRepository } from './survey-results-mongo-repository';

const makeSut = (): SaveSurveyResultMongoRepository => {
  return new SaveSurveyResultMongoRepository();
};

const mockSurvey = async (): Promise<DbSurvey> => {
  const survey = await surveysCollection.insertOne(mockAddSurveyParams());
  return survey && MongoHelper.map(survey.ops[0]);
};

const mockAccountId = async (): Promise<string> => {
  const account = await accountsCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token',
  });

  return account && account.ops[0]._id;
};

let surveysCollection: Collection;
let accountsCollection: Collection;
let surveyResultCollection: Collection;

describe('SurveysMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys');
    await surveysCollection.deleteMany({});

    accountsCollection = await MongoHelper.getCollection('accounts');
    await accountsCollection.deleteMany({});

    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
  });

  describe('save()', () => {
    it('should add a survey result if its new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult).toHaveProperty('id');
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    it('should update a survey result if its not new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const res = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult).toHaveProperty('id');
      expect(surveyResult.answer).toBe(survey.answers[1].answer);
      expect(surveyResult.id).toEqual(res.ops[0]._id);
    });
  });
});
