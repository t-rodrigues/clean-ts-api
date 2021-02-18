import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb';

import { AccountsMongoRepository } from './accounts-mongo-repository';
import { mockAddAccountParams } from '@/domain/test/mocks';

const makeSut = (): AccountsMongoRepository => {
  return new AccountsMongoRepository();
};

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
      const account = await sut.add(mockAddAccountParams());

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(mockAddAccountParams());
      const account = await sut.loadByEmail(mockAddAccountParams().email);

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(mockAddAccountParams().email);

      expect(account).toBeFalsy();
    });
  });

  describe('loadByToken()', () => {
    it('should return an account on loadByToken success without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token',
        }),
      );
      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });

    it('should return an account on loadByToken success with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token',
          role: 'admin',
        }),
      );
      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
    });

    it('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token',
        }),
      );
      const account = await sut.loadByToken('any_token', 'admin');

      expect(account).toBeFalsy();
    });

    it('should return an account on loadByToken with user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne(
        Object.assign({}, mockAddAccountParams(), {
          accessToken: 'any_token',
          role: 'admin',
        }),
      );
      const account = await sut.loadByToken('any_token');

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
      const result = await accountCollection.insertOne(mockAddAccountParams());
      const fakeAccount = result.ops[0];
      await sut.updateAccessToken(fakeAccount._id, 'updated_token');
      const account = await accountCollection.findOne({ _id: fakeAccount._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('updated_token');
    });
  });
});
