import jwt from 'jsonwebtoken';

import { Decrypter, Encrypter } from '@/application/contracts';

export class JWTAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(payload: string): Promise<string> {
    const accessToken = jwt.sign({ id: payload }, this.secret);
    return accessToken;
  }

  async decrypt(payload: string): Promise<string> {
    const value: any = jwt.verify(payload, this.secret);
    return value;
  }
}
