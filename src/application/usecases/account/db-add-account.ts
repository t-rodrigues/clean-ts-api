import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@/application/contracts';
import { Account } from '@/domain/entities';

import { AddAccount, AddAccountParams } from '@/domain/usecases';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add({ name, email, password }: AddAccountParams): Promise<Account> {
    const findAccount = await this.loadAccountByEmailRepository.loadByEmail(
      email,
    );

    if (findAccount) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, { name, email, password: hashedPassword }),
    );

    return account;
  }
}
