import { MongoHelper } from '@/infra/db/mongodb';
import { Collection } from 'mongodb';
import { AccountsMongoRepository } from './accounts-mongo-repository';

const makeSut = (): AccountsMongoRepository => {
  return new AccountsMongoRepository();
};

const makefakeAccountData = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

let accountCollection: Collection;

describe('AccountsMongoRepository', () => {
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

  it('should return an account on add success', async () => {
    const sut = makeSut();
    const account = await sut.add(makefakeAccountData());

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
  });

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSut();
    await accountCollection.insertOne(makefakeAccountData());

    const account = await sut.loadByEmail('any_email@mail.com');

    expect(account).toBeTruthy();
    expect(account).toHaveProperty('id');
  });
});
