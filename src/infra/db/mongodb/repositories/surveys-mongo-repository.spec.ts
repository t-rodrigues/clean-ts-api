import { Collection } from 'mongodb';

import { MongoHelper } from '@infra/db/mongodb';
import { SurveysMongoRepository } from './surveys-mongo-repository';

const makeSut = (): SurveysMongoRepository => {
  return new SurveysMongoRepository();
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
      await sut.add(makeFakeSurveyData());

      const survey = await surveyCollection.findOne({
        question: 'any_question',
      });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      await surveyCollection.insertOne(makeFakeSurveyData());

      const sut = makeSut();
      const surveys = await sut.loadAll();

      expect(surveys).toBeInstanceOf(Array);
    });
  });
});
