import {
  DecrypterSpy,
  LoadAccountByTokenRepositorySpy,
} from '@/application/test/mocks';
import { mockAccount, throwError } from '@/domain/test/mocks';
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

describe('DbLoadAccountByTokenUseCase', () => {
  describe('Decrypter', () => {
    it('should call Decrypter with correct values', async () => {
      const { sut, decrypterSpy } = makeSut();
      const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt');
      await sut.load('any_token', 'any_role');

      expect(decryptSpy).toHaveBeenCalledWith('any_token');
    });

    it('should return null if Decrypter returns null', async () => {
      const { sut, decrypterSpy } = makeSut();
      jest.spyOn(decrypterSpy, 'decrypt').mockResolvedValueOnce(null);
      const account = await sut.load('any_token', 'any_role');

      expect(account).toBeNull();
    });

    it('should throw if Decripter throws', async () => {
      const { sut, decrypterSpy } = makeSut();
      jest.spyOn(decrypterSpy, 'decrypt').mockRejectedValueOnce(throwError);

      await expect(sut.load('any_token', 'any_role')).rejects.toThrow();
    });
  });

  describe('LoadAccountByTokenRepository', () => {
    it('should call LoadAccountByTokenRepository with correct values', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut();
      const loadByTokenSpy = jest.spyOn(
        loadAccountByTokenRepositorySpy,
        'loadByToken',
      );
      await sut.load('any_token', 'any_role');

      expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role');
    });

    it('should throw if LoadAccountByTokenRepository throws', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
        .mockRejectedValueOnce(throwError);

      await expect(sut.load('any_token', 'any_role')).rejects.toThrow();
    });

    it('should return null if LoadAccountByTokenRepository returns null', async () => {
      const { sut, loadAccountByTokenRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
        .mockReturnValueOnce(null);
      const reponse = await sut.load('any_token', 'any_role');

      expect(reponse).toBeNull();
    });
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.load('any_token', 'any_role');

    expect(account).toEqual(mockAccount());
  });
});
