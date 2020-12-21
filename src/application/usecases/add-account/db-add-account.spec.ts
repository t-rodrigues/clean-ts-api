import { Encrypter } from '@/application/contracts/encrypter';
import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(payload: string): Promise<string> {
      return 'hashed_password';
    }
  }

  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};

describe('DbAddAccountUseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_password',
      password: 'valid_password',
    };

    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });
});
