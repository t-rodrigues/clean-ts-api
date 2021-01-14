import { hash } from 'bcrypt';
import { Hasher } from '@/application/contracts';

export class BCryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(payload: string): Promise<string> {
    const hashed = await hash(payload, this.salt);
    return hashed;
  }
}
