import {
  Decrypter,
  LoadAccountByTokenRepository,
} from '@/application/contracts';
import { Account } from '@/domain/entities';
import { LoadAccountByToken } from '@/domain/usecases';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<Account | null> {
    const token = await this.decrypter.decrypt(accessToken);

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role,
      );
      if (account) {
        return account;
      }
    }

    return null;
  }
}
