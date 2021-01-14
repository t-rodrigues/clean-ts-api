import {
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
} from '@/application/contracts';
import { Authentication, AuthenticationDTO } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async auth({ email, password }: AuthenticationDTO): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(email);

    if (account) {
      await this.hashComparer.compare(password, account.password);
      await this.tokenGenerator.generate(account.id);
    }

    return null;
  }
}
