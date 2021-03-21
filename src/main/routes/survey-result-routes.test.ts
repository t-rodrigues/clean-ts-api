import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';

import app from '@/main/config/app';
import env from '@/main/config/env';
import { MongoHelper } from '@/infra/db/mongodb';
import { Survey } from '@/domain/entities';

const makeAccessToken = async (): Promise<string> => {
  const res = await accountsCollection.insertOne({
    name: 'Thiago',
    email: 'thiagor_@live.com',
    password: '123',
  });
  const id = res.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);

  await accountsCollection.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        accessToken,
      },
    },
  );

  return accessToken;
};

const makeSurvey = async (): Promise<Survey> => {
  const survey = await surveysCollection.insertOne({
    question: 'Question 1',
    answers: [
      {
        image: 'image',
        answer: 'Answer 1',
      },
      {
        answer: 'Answer 2',
      },
    ],
    date: new Date(),
  });

  return survey && MongoHelper.map(survey.ops[0]);
};

let surveysCollection: Collection;
let accountsCollection: Collection;

describe('SurveysRoutes', () => {
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
  });

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403);
    });

    it('should return 200 on save survey result with valid data', async () => {
      const accessToken = await makeAccessToken();
      const survey = await makeSurvey();

      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'Answer 1' })
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    it('should return 403 on load survey result without accessToken', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403);
    });

    it('should return 200 on load survey result with valid data', async () => {
      const accessToken = await makeAccessToken();
      const survey = await makeSurvey();

      await request(app)
        .get(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
