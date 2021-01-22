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

  it('should add a survey on success', async () => {
    const sut = makeSut();
    await sut.add(makeFakeSurveyData());

    const survey = await surveyCollection.findOne({ question: 'any_question' });

    expect(survey).toBeTruthy();
  });
});
