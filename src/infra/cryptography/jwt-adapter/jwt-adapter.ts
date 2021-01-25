import { Decrypter, Encrypter } from '@application/contracts';

import jwt from 'jsonwebtoken';

export class JWTAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(payload: string): Promise<string> {
    const accessToken = jwt.sign({ id: payload }, this.secret);
    return accessToken;
  }

  async decrypt(payload: string): Promise<string> {
    jwt.verify(payload, this.secret);
    return null;
  }
}
