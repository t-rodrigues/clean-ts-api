import request from 'supertest';
import { Collection } from 'mongodb';

import app from '@main/config/app';
import { MongoHelper } from '@infra/db/mongodb';

let surveyCollection: Collection;

describe('LoginRoutes', () => {
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

  describe('POST /surveys', () => {
    it('should return 204 on add surveys sucess', async () => {
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
        .expect(204);
    });
  });
});
