import { MongoHelper } from '@infra/db/mongodb';
import { Collection } from 'mongodb';
import { AccountsMongoRepository } from './accounts-mongo-repository';

const makeSut = (): AccountsMongoRepository => {
  return new AccountsMongoRepository();
};

const makefakeAccountData = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  accessToken: 'any_token',
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

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add(makefakeAccountData());

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(makefakeAccountData());

      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeFalsy();
    });
  });

  describe('loadByToken()', () => {
    it('should return an account on loadByToken success without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(makefakeAccountData());

      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });

    it('should return an account on loadByToken success with role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role',
      });

      const account = await sut.loadByToken('any_token', 'any_role');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });

    it('should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any_token');

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    it('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection.insertOne(makefakeAccountData());
      const fakeAccount = result.ops[0];

      await sut.updateAccessToken(fakeAccount._id, 'updated_token');
      const account = await accountCollection.findOne({ _id: fakeAccount._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('updated_token');
    });
  });
});
