import { hash, compare } from 'bcrypt';
import { HashComparer, Hasher } from '@/application/contracts';

export class BCryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(payload: string): Promise<string> {
    const hashed = await hash(payload, this.salt);
    return hashed;
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
