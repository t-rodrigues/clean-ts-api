import { AddAccountRepository, Encrypter } from '@/application/contracts';
import { AddAccount, AddAccountDTO } from '@/domain/usecases';
import { Account } from '@/domain/entities';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(accountData: AddAccountDTO): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword }),
    );

    return account;
  }
}
