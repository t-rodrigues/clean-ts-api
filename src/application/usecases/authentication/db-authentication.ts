import {
  HashComparer,
  LoadAccountByEmailRepository,
} from '@/application/contracts';
import { Authentication, AuthenticationDTO } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  async auth({ email, password }: AuthenticationDTO): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (account) {
      await this.hashComparer.compare(password, account.password);
    }

    return null;
  }
}
