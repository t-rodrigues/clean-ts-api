import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy,
} from '@/application/test/mocks';
import { mockAuthenticationParams, throwError } from '@/domain/test/mocks';
import { DbAuthentication } from './db-authentication';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  );

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe('DbAuthenticationUseCase', () => {
  describe('LoadAccountByEmailRepository', () => {
    it('should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadAccountByEmailRepositorySpy } = makeSut();
      const authenticationParams = mockAuthenticationParams();
      await sut.auth(authenticationParams);

      expect(loadAccountByEmailRepositorySpy.email).toBe(
        authenticationParams.email,
      );
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
      loadAccountByEmailRepositorySpy.account = null;
      const accessToken = await sut.auth(mockAuthenticationParams());

      expect(accessToken).toBe(null);
    });
  });

  describe('HashComparer', () => {
    it('should call HashComparer with correct values', async () => {
      const { sut, hashComparerSpy } = makeSut();
      const authenticationParams = mockAuthenticationParams();
      await sut.auth(authenticationParams);

      expect(hashComparerSpy.plaintext).toBe(authenticationParams.password);
    });

    it('should throw if HashComparer throws', async () => {
      const { sut, hashComparerSpy } = makeSut();
      jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });

    it('should return null if HashComparer returns false', async () => {
      const { sut, hashComparerSpy } = makeSut();
      hashComparerSpy.isValid = false;
      const accessToken = await sut.auth(mockAuthenticationParams());

      expect(accessToken).toBe(null);
    });
  });

  describe('Encrypter', () => {
    it('should call Encrypter with correct id', async () => {
      const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();
      await sut.auth(mockAuthenticationParams());

      expect(encrypterSpy.plaintext).toBe(
        loadAccountByEmailRepositorySpy.account.id,
      );
    });

    it('should throw if Encrypter throws', async () => {
      const { sut, encrypterSpy } = makeSut();
      jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });
  });

  describe('UpdateAccessTokenRepository', () => {
    it('should call UpdateAccessTokenRepository with correct values', async () => {
      const {
        sut,
        updateAccessTokenRepositorySpy,
        loadAccountByEmailRepositorySpy,
        encrypterSpy,
      } = makeSut();
      const authenticationParams = mockAuthenticationParams();
      await sut.auth(authenticationParams);

      expect(updateAccessTokenRepositorySpy.id).toBe(
        loadAccountByEmailRepositorySpy.account.id,
      );
      expect(updateAccessTokenRepositorySpy.token).toBe(
        encrypterSpy.ciphertext,
      );
    });

    it('should throw if UpdateAccessTokenRepository throws', async () => {
      const { sut, updateAccessTokenRepositorySpy } = makeSut();
      jest
        .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
        .mockRejectedValueOnce(throwError);

      await expect(sut.auth(mockAuthenticationParams())).rejects.toThrow();
    });
  });

  it('should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut();
    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe(encrypterSpy.ciphertext);
  });
});
