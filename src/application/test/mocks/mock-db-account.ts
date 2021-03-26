import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/application/contracts';
import { Account } from '@/domain/entities';

import { mockAccount } from '@/domain/test/mocks';
import { AddAccountParams } from '@/domain/usecases';

export class AddAccountRepositorySpy implements AddAccountRepository {
  account = mockAccount();
  addAccountParams: AddAccountParams;

  async add(accountData: AddAccountParams): Promise<Account> {
    this.addAccountParams = accountData;

    return this.account;
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository {
  public account = mockAccount();
  public email: string;

  async loadByEmail(email: string): Promise<Account> {
    this.email = email;

    return this.account;
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository {
  account = mockAccount();
  token: string;
  role: string;

  async loadByToken(token: string, role?: string): Promise<Account | null> {
    this.token = token;
    this.role = role;

    return this.account;
  }
}

export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository {
  id: string;
  token: string;

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
  }
}
