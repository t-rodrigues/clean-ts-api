import request from 'supertest';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

import app from '@main/config/app';
import { MongoHelper } from '@infra/db/mongodb';

let accountCollection: Collection;

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    it('should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Thiago',
          email: 'thiagor_@live.com',
          password: '123123',
          passwordConfirmation: '123123',
        })
        .expect(201);
    });
  });

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('123123', 12);

      await accountCollection.insertOne({
        name: 'Thiago',
        email: 'thiagor_@live.com',
        password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'thiagor_@live.com',
          password: '123123',
        })
        .expect(200);
    });

    it('should return 401 on login fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'thiagor_@live.com',
          password: '123123',
        })
        .expect(401);
    });
  });
});
