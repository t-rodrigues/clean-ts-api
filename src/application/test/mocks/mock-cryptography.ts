import faker from 'faker';

import {
  Hasher,
  Decrypter,
  HashComparer,
  Encrypter,
} from '@/application/contracts';

export class HasherSpy implements Hasher {
  digest = faker.random.uuid();
  payload: string;

  async hash(payload: string): Promise<string> {
    this.payload = payload;

    return this.digest;
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string;
  digest: string;
  isValid = true;

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;

    return this.isValid;
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.random.uuid();
  plaintext: string;

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext;

    return this.ciphertext;
  }
}

export class DecrypterSpy implements Decrypter {
  ciphertext: string;
  plaintext = faker.internet.password();

  async decrypt(ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext;

    return this.plaintext;
  }
}
