import { Encrypter } from '@/application/contracts';

import jwt from 'jsonwebtoken';

export class JWTAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(payload: string): Promise<string> {
    const accessToken = await jwt.sign({ id: payload }, this.secret);
    return accessToken;
  }
}
