import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from '@/application/contracts';
import { DbAccount, DbAddAccountDTO } from '@/application/dtos';
import { MongoHelper } from '@/infra/db/mongodb';

export class AccountsMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository {
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
}
