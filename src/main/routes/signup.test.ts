import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb';

describe('SignUpRoute', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  it('should return an account on success', async () => {
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
