import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb';

import { SurveysMongoRepository } from './surveys-mongo-repository';
import { mockAddSurveyParams } from '@/domain/test/mocks';

const makeSut = (): SurveysMongoRepository => {
  return new SurveysMongoRepository();
};

let surveyCollection: Collection;

describe('SurveysMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());

      const count = await surveyCollection.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const addSurvey = [mockAddSurveyParams(), mockAddSurveyParams()];
      await surveyCollection.insertMany(addSurvey);

      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toHaveProperty('id');
      expect(surveys[0].question).toBe(addSurvey[0].question);
      expect(surveys[1].id).toHaveProperty('id');
      expect(surveys[1].question).toBe(addSurvey[1].question);
    });

    it('should load empty list', async () => {
      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const response = await surveyCollection.insertOne(mockAddSurveyParams());
      const sut = makeSut();
      const survey = await sut.loadById(response.ops[0]._id);

      expect(survey).toBeTruthy();
      expect(survey).toHaveProperty('id');
    });
  });
});
