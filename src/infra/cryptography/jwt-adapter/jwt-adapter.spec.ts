import { JWTAdapter } from './jwt-adapter';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },

  async verify(): Promise<string> {
    return 'any_value';
  },
}));

const makeSut = (): JWTAdapter => {
  return new JWTAdapter('secret');
};

describe('JWTAdapter', () => {
  describe('encrypt()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');

      await sut.encrypt('any_id');
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    it('should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.encrypt('any_id');
      expect(accessToken).toBe('any_token');
    });

    it('should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementation(() => {
        throw new Error();
      });

      await expect(sut.encrypt('any_id')).rejects.toThrow();
    });
  });

  describe('decrypt()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');

      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    it('should return a value on verify success', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify');

      const value = await sut.decrypt('any_token');
      expect(value).toBe('any_value');
    });

    it('should throw if verify throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error();
      });

      await expect(sut.decrypt('any_token')).rejects.toThrow();
    });
  });
});
