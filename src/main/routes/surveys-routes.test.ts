import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';

import app from '@main/config/app';
import { MongoHelper } from '@infra/db/mongodb';
import env from '@main/config/env';

let surveysCollection: Collection;
let accountsCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountsCollection.insertOne({
    name: 'Thiago',
    email: 'thiagor_@live.com',
    password: '123',
    role: 'admin',
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

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              image: 'image',
              answer: 'Answer 1',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(403);
    });

    it('should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'image',
              answer: 'Answer 1',
            },
            {
              answer: 'Answer 2',
            },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403);
    });

    it('should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await surveysCollection.insertOne({
        question: 'Question',
        answers: [
          {
            image: 'image',
            answer: 'Answer 1',
          },
          {
            answer: 'Answer 2',
          },
        ],
      });

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
