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

      const survey = await surveyCollection.findOne({
        question: 'any_question',
      });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      await surveyCollection.insertOne(mockAddSurveyParams());

      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys).toBeInstanceOf(Array);
      expect(surveys[0].id).toHaveProperty('id');
    });

    it('should load empty list', async () => {
      await surveyCollection.insertOne(mockAddSurveyParams());

      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys).toBeInstanceOf(Array);
    });
  });

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams());
      const { _id: id } = res.ops[0];
      const sut = makeSut();
      const survey = await sut.loadById(id);

      expect(survey).toBeTruthy();
      expect(survey).toHaveProperty('id');
    });
  });
});
