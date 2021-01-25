import { Decrypter } from '@application/contracts/cryptography/decrypter';
import { Account } from '@domain/entities';
import { LoadAccountByToken } from '@domain/usecases';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(accessToken: string, role?: string): Promise<Account | null> {
    await this.decrypter.decrypt(accessToken);
    return null;
  }
}
