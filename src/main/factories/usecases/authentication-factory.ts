import { DbAuthentication } from '@/application/usecases';
import { BCryptAdapter, JWTAdapter } from '@/infra/cryptography';
import { AccountsMongoRepository } from '@/infra/db/mongodb';

import env from '@/main/config/env';

export const makeDbAuthentication = (): DbAuthentication => {
  const accountsRepository = new AccountsMongoRepository();
  const salt = 12;
  const bcrypt = new BCryptAdapter(salt);
  const jwt = new JWTAdapter(env.jwtSecret);

  return new DbAuthentication(
    accountsRepository,
    bcrypt,
    jwt,
    accountsRepository,
  );
};
