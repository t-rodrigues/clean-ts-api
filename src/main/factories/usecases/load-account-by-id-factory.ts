import { DbLoadAccountByToken } from '@application/usecases/load-account-by-token';
import { JWTAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountsMongoRepository } from '@infra/db/mongodb';

import env from '@main/config/env';

export const makeLoadAccountByToken = (): DbLoadAccountByToken => {
  const accountsMongoRepository = new AccountsMongoRepository();
  const jwt = new JWTAdapter(env.jwtSecret);

  return new DbLoadAccountByToken(jwt, accountsMongoRepository);
};
