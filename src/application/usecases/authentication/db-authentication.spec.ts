import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy,
} from '@/application/test/mocks';
import {
  mockAccount,
  mockAuthenticationParams,
  throwError,
} from '@/domain/test/mocks';
import { DbAuthentication } from './db-authentication';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositorySpy();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub,
  );

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthenticationUseCase', () => {
  describe('LoadAccountByEmailRepository', () => {
    it('should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      const loadSpy = jest.spyOn(
        loadAccountByEmailRepositorySpy,
        'loadByEmail',
      );
      await sut.auth(mockAuthenticationParams());

      expect(loadSpy).toHaveBeenCalledWith(mockAuthenticationParams().email);
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
        .mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });

    it('should return null if LoadAccountByEmailRepository returns null', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      jest
        .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
        .mockResolvedValueOnce(null);
      const accessToken = await sut.auth(mockAuthenticationParams());

      expect(accessToken).toBe(null);
    });
  });

  describe('HashComparer', () => {
    it('should call HashComparer with correct values', async () => {
      const { sut, hashComparerSpy } = makeSut();
      const compareSpy = jest.spyOn(hashComparerSpy, 'compare');
      await sut.auth(mockAuthenticationParams());

      expect(compareSpy).toHaveBeenCalledWith(
        'any_password',
        'hashed_password',
      );
    });

    it('should throw if HashComparer throws', async () => {
      const { sut, hashComparerSpy } = makeSut();
      jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });

    it('should return null if HashComparer returns false', async () => {
      const { sut, hashComparerSpy } = makeSut();
      jest.spyOn(hashComparerSpy, 'compare').mockResolvedValueOnce(false);
      const accessToken = await sut.auth(mockAuthenticationParams());

      expect(accessToken).toBe(null);
    });
  });

  describe('Encrypter', () => {
    it('should call Encrypter with correct id', async () => {
      const { sut, encrypterSpy } = makeSut();
      const encryptSpy = jest.spyOn(encrypterSpy, 'encrypt');
      await sut.auth(mockAuthenticationParams());

      expect(encryptSpy).toHaveBeenCalledWith(mockAccount().id);
    });

    it('should throw if Encrypter throws', async () => {
      const { sut, encrypterSpy } = makeSut();
      jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });
  });

  describe('UpdateAccessTokenRepository', () => {
    it('should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut();
      const updateSpy = jest.spyOn(
        updateAccessTokenRepositoryStub,
        'updateAccessToken',
      );
      await sut.auth(mockAuthenticationParams());

      expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
    });

    it('should throw if UpdateAccessTokenRepository throws', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut();
      jest
        .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        .mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });
  });

  it('should return a token on success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe('any_token');
  });
});
