import faker from 'faker';

import {
  AddAccount,
  AddAccountParams,
  Authentication,
  AuthenticationParams,
  LoadAccountByToken,
} from '@/domain/usecases';
import { Account } from '@/domain/entities';

import { mockAccount } from '@/domain/test/mocks';

export class AddAccountSpy implements AddAccount {
  account = mockAccount();
  accountData: AddAccountParams;

  async add(data: AddAccountParams): Promise<Account> {
    this.accountData = data;

    return this.account;
  }
}

export class AuthenticationSpy implements Authentication {
  token = faker.random.uuid();
  authParams: AuthenticationParams;

  async auth(data: AuthenticationParams): Promise<string> {
    this.authParams = data;

    return this.token;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  account = mockAccount();
  accessToken: string;
  role: string;

  async load(accessToken: string, role?: string): Promise<Account | null> {
    this.accessToken = accessToken;
    this.role = role;

    return this.account;
  }
}
