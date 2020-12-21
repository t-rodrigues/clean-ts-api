import { hash } from 'bcrypt';
import { Encrypter } from '@/application/contracts';

export class BCryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  async encrypt(payload: string): Promise<string> {
    const hashed = await hash(payload, this.salt);
    return hashed;
  }
}
