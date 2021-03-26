import faker from 'faker';

import {
  DecrypterSpy,
  LoadAccountByTokenRepositorySpy,
} from '@/application/test/mocks';
import { throwError } from '@/domain/test/mocks';

import { DbLoadAccountByToken } from './db-load-account-by-token';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterSpy: DecrypterSpy;
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
  );

  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
  };
};

let token: string;
let role: string;

describe('DbLoadAccountByTokenUseCase', () => {
  beforeEach(() => {
    token = faker.random.uuid();
    role = faker.random.word();
  });

  describe('Decrypter', () => {
    it('should call Decrypter with correct values', async () => {
      const { sut, decrypterSpy } = makeSut();
      await sut.load(token, role);

      expect(decrypterSpy.ciphertext).toBe(token);
    });

    it('should return null if Decrypter returns null', async () => {
      const { sut, decrypterSpy } = makeSut();
      decrypterSpy.plaintext = null;
      const account = await sut.load(token, role);

      expect(account).toBeNull();
    });

    it('should throw if Decripter throws', async () => {
      const { sut, decrypterSpy } = makeSut();
      jest.spyOn(decrypterSpy, 'decrypt').mockRejectedValueOnce(throwError);

      await expect(sut.load(token, role)).rejects.toThrow();
    });
  });

  describe('LoadAccountByTokenRepository', () => {
    it('should call LoadAccountByTokenRepository with correct values', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut();
      await sut.load(token, role);

      expect(loadAccountByTokenRepositorySpy.token).toBe(token);
      expect(loadAccountByTokenRepositorySpy.role).toBe(role);
    });

    it('should throw if LoadAccountByTokenRepository throws', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
        .mockRejectedValueOnce(throwError);

      await expect(sut.load(token, role)).rejects.toThrow();
    });

    it('should return null if LoadAccountByTokenRepository returns null', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut();
      loadAccountByTokenRepositorySpy.account = null;
      const account = await sut.load(token, role);

      expect(account).toBeNull();
    });
  });

  it('should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const account = await sut.load(token, role);

    expect(account).toEqual(loadAccountByTokenRepositorySpy.account);
  });
});
