import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/application/contracts';
import { AddAccountParams } from '@/domain/usecases';
import { Account } from '@/domain/entities';

import { mockAccount } from '@/domain/test/mocks';

export class AddAccountRepositorySpy implements AddAccountRepository {
  async add(accountData: AddAccountParams): Promise<Account> {
    return mockAccount();
  }
}

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository {
  async loadByEmail(email: string): Promise<Account> {
    return mockAccount();
  }
}

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository {
  async loadByToken(token: string): Promise<Account | null> {
    return mockAccount();
  }
}

export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository {
  async updateAccessToken(userId: string, token: string): Promise<void> {}
}
