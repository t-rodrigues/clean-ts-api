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
  async add(account: AddAccountParams): Promise<Account> {
    return mockAccount();
  }
}

export class AuthenticationSpy implements Authentication {
  async auth({ email, password }: AuthenticationParams): Promise<string> {
    return 'token';
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  async load(accessToken: string, role?: string): Promise<Account | null> {
    return mockAccount();
  }
}
