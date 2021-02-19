import bcrypt from 'bcrypt';

import { throwError } from '@/domain/test/mocks';
import { BCryptAdapter } from '@/infra/cryptography';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hashed';
  },

  async compare(): Promise<boolean> {
    return true;
  },
}));

const salt = 12;
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt);
};

describe('BCryptAdapter', () => {
  describe('hash()', () => {
    it('should call hash with correct values', async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    it('should throw if hash throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(throwError);

      await expect(sut.hash('any_value')).rejects.toThrow();
    });

    it('should return a valid hash on hash success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');

      expect(hash).toBe('hashed');
    });
  });

  describe('compare()', () => {
    it('should call compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'any_hash');

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    it('should return true when compare succeeds', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBe(true);
    });

    it('should return false when compare fails', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBe(false);
    });

    it('should throw if compare throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(throwError);

      await expect(sut.compare('any_value', 'any_hash')).rejects.toThrow();
    });
  });
});
