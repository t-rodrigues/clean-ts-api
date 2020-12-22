import { AddAccountRepository } from '@/application/contracts';
import { DbAccount, DbAddAccountDTO } from '@/application/dtos';
import { MongoHelper } from '@/infra/db/mongodb';

export class AccountsMongoRepository implements AddAccountRepository {
  async add(accountData: DbAddAccountDTO): Promise<DbAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = result.ops[0];

    return MongoHelper.map(account);
  }
}