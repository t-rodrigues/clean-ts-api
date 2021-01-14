import { Hasher, AddAccountRepository } from '@/application/contracts';
import { Account } from '@/domain/entities';
import { AddAccountDTO } from '@/domain/usecases';
import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount;
  HasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (): SutTypes => {
  const HasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub);

  return {
    sut,
    HasherStub,
    addAccountRepositoryStub,
  };
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(payload: string): Promise<string> {
      return 'hashed_password';
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountDTO): Promise<Account> {
      return {
        id: 'valid_id',
        name: 'any_name',
        email: 'any_valid_email',
        password: 'hashed_password',
      };
    }
  }
  return new AddAccountRepositoryStub();
};

const makeFakeAccountData = (): AddAccountDTO => ({
  name: 'valid_name',
  email: 'valid_password',
  password: 'valid_password',
});

const makeFakeAccount = (): Account => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any_valid_email',
  password: 'hashed_password',
});

describe('DbAddAccountUseCase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, HasherStub } = makeSut();
    const hashSpy = jest.spyOn(HasherStub, 'hash');

    await sut.add(makeFakeAccountData());

    expect(hashSpy).toHaveBeenCalledWith(makeFakeAccountData().password);
  });

  it('should throw if Hasher throws', async () => {
    const { sut, HasherStub } = makeSut();
    jest.spyOn(HasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error('');
    });

    await expect(sut.add(makeFakeAccountData())).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = makeFakeAccountData();

    await sut.add(accountData);

    expect(addRepositorySpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashed_password',
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error('');
    });

    await expect(sut.add(makeFakeAccountData())).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(makeFakeAccountData());

    expect(account).toEqual(makeFakeAccount());
  });
});
