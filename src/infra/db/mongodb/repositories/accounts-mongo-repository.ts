import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@application/contracts';
import { DbAccount, DbAddAccountDTO } from '@application/dtos';
import { MongoHelper } from '@infra/db/mongodb';

export class AccountsMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    LoadAccountByTokenRepository,
    UpdateAccessTokenRepository {
  async add(accountData: DbAddAccountDTO): Promise<DbAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = result.ops[0];

    return MongoHelper.map(account);
  }

  async loadByEmail(email: string): Promise<DbAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.map(account);
  }

  async loadByToken(token: string, role?: string): Promise<DbAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      role,
    });

    return account && MongoHelper.map(account);
  }

  async updateAccessToken(userId: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: userId },
      { $set: { accessToken: token } },
    );
  }
}
