import faker from 'faker';

import { Account } from '@/domain/entities';
import { AddAccount, AuthenticationParams } from '@/domain/usecases';

export const mockAccount = (): Account => ({
  id: faker.random.uuid(),
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(12),
});

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
