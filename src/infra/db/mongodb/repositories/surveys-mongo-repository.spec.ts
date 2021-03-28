import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb';

import { SurveysMongoRepository } from './surveys-mongo-repository';
import { mockAddSurveyParams } from '@/domain/test/mocks';

const makeSut = (): SurveysMongoRepository => {
  return new SurveysMongoRepository();
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

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());

      const count = await surveysCollection.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const accountId = await mockAccountId();
      const addSurveys = [mockAddSurveyParams(), mockAddSurveyParams()];
      const result = await surveysCollection.insertMany(addSurveys);
      const survey = result.ops[0];
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toHaveProperty('id');
      expect(surveys[0].question).toBe(addSurveys[0].question);
      expect(surveys[0].didAnswer).toBeTruthy();
      expect(surveys[1].id).toHaveProperty('id');
      expect(surveys[1].question).toBe(addSurveys[1].question);
      expect(surveys[1].didAnswer).toBeFalsy();
    });

    it('should load empty list', async () => {
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const response = await surveysCollection.insertOne(mockAddSurveyParams());
      const sut = makeSut();
      const survey = await sut.loadById(response.ops[0]._id);

      expect(survey).toBeTruthy();
      expect(survey).toHaveProperty('id');
    });
  });
});
