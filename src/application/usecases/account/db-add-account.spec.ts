import { LoadAccountByEmailRepository } from '@/application/contracts';
import { Account } from '@/domain/entities';

import { AddAccountRepositorySpy, HasherSpy } from '@/application/test/mocks';
import {
  mockAddAccountParams,
  mockAccount,
  throwError,
} from '@/domain/test/mocks';
import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const loadAccountByEmailRepositorySpy = mockLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
  );

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
  };
};

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<Account> {
      return null;
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

describe('DbAddAccountUseCase', () => {
  describe('hasher', () => {
    it('should call Hasher with correct password', async () => {
      const { sut, hasherSpy } = makeSut();
      const hashSpy = jest.spyOn(hasherSpy, 'hash');

      await sut.add(mockAddAccountParams());

      expect(hashSpy).toHaveBeenCalledWith(mockAddAccountParams().password);
    });

    it('should throw if Hasher throws', async () => {
      const { sut, hasherSpy } = makeSut();
      jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);

      await expect(sut.add(mockAddAccountParams())).rejects.toThrow();
    });
  });

  describe('AddAccountRepository', () => {
    it('should call AddAccountRepository with correct values', async () => {
      const { sut, addAccountRepositorySpy } = makeSut();
      const addRepositorySpy = jest.spyOn(addAccountRepositorySpy, 'add');
      const accountData = mockAddAccountParams();

      await sut.add(accountData);

      expect(addRepositorySpy).toHaveBeenCalledWith({
        ...accountData,
        password: 'hashed_password',
      });
    });

    it('should throw if AddAccountRepository throws', async () => {
      const { sut, addAccountRepositorySpy } = makeSut();
      jest
        .spyOn(addAccountRepositorySpy, 'add')
        .mockImplementationOnce(throwError);

      await expect(sut.add(mockAddAccountParams())).rejects.toThrow();
    });

    it('should return an account on success', async () => {
      const { sut } = makeSut();

      const account = await sut.add(mockAddAccountParams());

      expect(account).toEqual(mockAccount());
    });
  });

  describe('LoadAccountByEmailRepository', () => {
    it('should return null if LoadAccountByEmailRepository returns an account', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
        .mockReturnValueOnce(Promise.resolve(mockAccount()));

      const account = await sut.add(mockAddAccountParams());

      expect(account).toBeNull();
    });

    it('should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      const loadSpy = jest.spyOn(
        loadAccountByEmailRepositorySpy,
        'loadByEmail',
      );

      await sut.add(mockAddAccountParams());

      expect(loadSpy).toHaveBeenCalledWith(mockAddAccountParams().email);
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
        .mockImplementationOnce(throwError);

      await expect(sut.add(mockAddAccountParams())).rejects.toThrow();
    });
  });
});
