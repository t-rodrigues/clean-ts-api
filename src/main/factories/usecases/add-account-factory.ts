import { DbAddAccount } from '@/application/usecases';
import { BCryptAdapter } from '@/infra/cryptography';
import { AccountsMongoRepository } from '@/infra/db/mongodb';

export const makeDbAddAccount = (): DbAddAccount => {
  const accountsRepository = new AccountsMongoRepository();
  const salt = 12;
  const bcrypt = new BCryptAdapter(salt);
  return new DbAddAccount(bcrypt, accountsRepository, accountsRepository);
};
