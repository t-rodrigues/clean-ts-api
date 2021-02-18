import {
  Hasher,
  Decrypter,
  HashComparer,
  Encrypter,
} from '@/application/contracts';

export class HasherSpy implements Hasher {
  async hash(payload: string): Promise<string> {
    return 'hashed_password';
  }
}

export class HashComparerSpy implements HashComparer {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return true;
  }
}

export class EncrypterSpy implements Encrypter {
  async encrypt(payload: string): Promise<string> {
    return 'any_token';
  }
}

export class DecrypterSpy implements Decrypter {
  async decrypt(payload: string): Promise<string> {
    return 'any_value';
  }
}
