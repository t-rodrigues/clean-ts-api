import faker from 'faker';
import { Collection } from 'mongodb';

import { MongoHelper } from '@/infra/db/mongodb';
import { mockAddAccountParams } from '@/domain/test/mocks';

import { AccountsMongoRepository } from './accounts-mongo-repository';

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
      const addAccountParams = mockAddAccountParams();
      const account = await sut.add(addAccountParams);

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.email).toBe(addAccountParams.email);
    });

    it('should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());

      expect(account).toBeFalsy();
    });
  });

  describe('loadByToken()', () => {
    let name = faker.name.findName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let accessToken = faker.random.uuid();

    beforeEach(() => {
      name = faker.name.findName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.random.uuid();
    });

    it('should return an account on loadByToken success without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.email).toBe(email);
    });

    it('should return an account on loadByToken success with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken, 'admin');

      expect(account).toBeTruthy();
      expect(account).toHaveProperty('id');
      expect(account.email).toBe(email);
    });

    it('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken, 'admin');

      expect(account).toBeFalsy();
    });

    it('should return an account on loadByToken with user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken);

      expect(account).toBeTruthy();
      expect(account.id).toHaveProperty('id');
      expect(account.email).toBe(email);
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
      expect(fakeAccount.accessToken).toBeFalsy();

      const accessToken = faker.random.uuid();
      await sut.updateAccessToken(fakeAccount._id, accessToken);
      const account = await accountCollection.findOne({ _id: fakeAccount._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe(accessToken);
    });
  });
});
