import {
  AddAccountRepositorySpy,
  HasherSpy,
  LoadAccountByEmailRepositorySpy,
} from '@/application/test/mocks';
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
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.account = null;

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

describe('DbAddAccountUseCase', () => {
  describe('hasher', () => {
    it('should call Hasher with correct plaintext', async () => {
      const { sut, hasherSpy } = makeSut();
      const addAccountParams = mockAddAccountParams();
      await sut.add(addAccountParams);

      expect(hasherSpy.payload).toBe(addAccountParams.password);
    });

    it('should throw if Hasher throws', async () => {
      const { sut, hasherSpy } = makeSut();
      jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(throwError);

      await expect(sut.add(mockAddAccountParams())).rejects.toThrow();
    });
  });

  describe('AddAccountRepository', () => {
    it('should call AddAccountRepository with correct values', async () => {
      const { sut, addAccountRepositorySpy, hasherSpy } = makeSut();
      const accountData = mockAddAccountParams();
      await sut.add(accountData);

      expect(addAccountRepositorySpy.addAccountParams).toEqual({
        name: accountData.name,
        email: accountData.email,
        password: hasherSpy.digest,
      });
    });

    it('should throw if AddAccountRepository throws', async () => {
      const { sut, addAccountRepositorySpy } = makeSut();
      jest
        .spyOn(addAccountRepositorySpy, 'add')
        .mockRejectedValueOnce(throwError);

      await expect(sut.add(mockAddAccountParams())).rejects.toThrow();
    });

    it('should return an account on success', async () => {
      const { sut, addAccountRepositorySpy } = makeSut();
      const account = await sut.add(mockAddAccountParams());

      expect(account).toEqual(addAccountRepositorySpy.account);
    });
  });

  describe('LoadAccountByEmailRepository', () => {
    it('should return null if LoadAccountByEmailRepository returns an account', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      loadAccountByEmailRepositorySpy.account = mockAccount();
      const account = await sut.add(mockAddAccountParams());

      expect(account).toBeNull();
    });

    it('should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      const addAccountParams = mockAddAccountParams();

      await sut.add(addAccountParams);

      expect(loadAccountByEmailRepositorySpy.email).toBe(
        addAccountParams.email,
      );
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
        .mockRejectedValueOnce(throwError);

      await expect(sut.add(mockAddAccountParams())).rejects.toThrow();
    });
  });
});
