import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@/application/contracts';
import { AddAccount, AddAccountParams } from '@/domain/usecases';
import { Account } from '@/domain/entities';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountParams): Promise<Account> {
    const findAccount = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );

    if (findAccount) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword }),
    );

    return account;
  }
}
