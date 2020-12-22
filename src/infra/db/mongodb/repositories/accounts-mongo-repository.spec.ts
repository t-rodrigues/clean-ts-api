import { MongoHelper } from '@/infra/db';
import { AccountsMongoRepository } from './accounts-mongo-repository';

describe('AccountsMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should return an account on success', async () => {
    const sut = new AccountsMongoRepository();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
  });
});
