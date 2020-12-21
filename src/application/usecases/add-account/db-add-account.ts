import { Encrypter } from '@/application/contracts/encrypter';
import { AddAccount, AddAccountDTO } from '@/domain/usecases';
import { Account } from '@/domain/entities';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(accountData: AddAccountDTO): Promise<Account> {
    await this.encrypter.encrypt(accountData.password);
    return null;
  }
}
