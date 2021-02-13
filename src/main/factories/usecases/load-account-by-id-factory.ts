import { DbLoadAccountByToken } from '@application/usecases';
import { JWTAdapter } from '@infra/cryptography';
import { AccountsMongoRepository } from '@infra/db/mongodb';

import env from '@main/config/env';

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
  const accountsMongoRepository = new AccountsMongoRepository();
  const jwt = new JWTAdapter(env.jwtSecret);

  return new DbLoadAccountByToken(jwt, accountsMongoRepository);
};
