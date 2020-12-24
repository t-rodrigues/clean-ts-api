import { LoadAccountByEmailRepository } from '@/application/contracts';
import { Account } from '@/domain/entities';
import { DbAuthentication } from './db-authentication';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<Account> {
      return {
        id: 'valid_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      };
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

describe('DbAuthenticationUseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' });

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
