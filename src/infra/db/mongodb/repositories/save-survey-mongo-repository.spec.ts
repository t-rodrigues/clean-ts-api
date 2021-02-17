import { Collection } from 'mongodb';
import { DbAccount, DbSurvey } from '@/application/dtos';
import { MongoHelper } from '@/infra/db/mongodb';

import { SaveSurveyResultMongoRepository } from './save-survey-mongo-repository';

const makeSut = (): SaveSurveyResultMongoRepository => {
  return new SaveSurveyResultMongoRepository();
};

const makeFakeSurveyData = () => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
    {
      answer: 'other_answer',
    },
  ],
  date: new Date(),
});

const makeSurvey = async (): Promise<DbSurvey> => {
  const survey = await surveysCollection.insertOne(makeFakeSurveyData());
  return survey && MongoHelper.map(survey.ops[0]);
};

const makeAccount = async (): Promise<DbAccount> => {
  const account = await accountsCollection.insertOne({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    accessToken: 'any_token',
  });

  return account && MongoHelper.map(account.ops[0]);
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
      const survey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult).toHaveProperty('id');
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    it('should update a survey result if its not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const res = await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
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
