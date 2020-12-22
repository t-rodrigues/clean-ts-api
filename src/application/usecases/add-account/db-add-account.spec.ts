import { Encrypter, AddAccountRepository } from '@/application/contracts';
import { Account } from '@/domain/entities';
import { AddAccountDTO } from '@/domain/usecases';
import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(payload: string): Promise<string> {
      return 'hashed_password';
    }
  }

  return new EncrypterStub();
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
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.add(makeFakeAccountData());

    expect(encryptSpy).toHaveBeenCalledWith(makeFakeAccountData().password);
  });

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
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
