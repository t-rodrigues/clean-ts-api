import { LoadAccountByEmailRepository } from '@/application/contracts';
import { Authentication, AuthenticationDTO } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async auth({ email, password }: AuthenticationDTO): Promise<string> {
    await this.loadAccountByEmailRepository.load(email);
    return null;
  }
}
