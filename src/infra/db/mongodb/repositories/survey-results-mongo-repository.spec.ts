import { Collection, ObjectId } from 'mongodb';
import { DbSurvey } from '@/application/dtos';
import { MongoHelper } from '@/infra/db/mongodb';

import { mockAddSurveyParams } from '@/domain/test/mocks';
import { SurveyResultsMongoRepository } from './survey-results-mongo-repository';

const makeSut = (): SurveyResultsMongoRepository => {
  return new SurveyResultsMongoRepository();
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
      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId,
      });

      expect(surveyResult).toBeTruthy();
    });

    it('should update a survey result if its not new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId,
        })
        .toArray();

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    it('should load survey result', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
    });

    it('should load survey result 2', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      const accountId3 = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId3),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId2);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
    });

    it('should load survey result 3', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const accountId2 = await mockAccountId();
      const accountId3 = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId3);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
    });

    it('should loadBySurveyId returns null when surveyId is invalid', async () => {
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(
        'invalid_survey_id',
        accountId,
      );

      expect(surveyResult).toBeNull();
    });

    it('should loadBySurveyId return survey result when answers were not registered', async () => {
      const accountId = await mockAccountId();
      const survey = await mockSurvey();
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(0);
      expect(surveyResult.answers[0].percent).toBe(0);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBeFalsy();
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBeFalsy();
    });
  });
});
