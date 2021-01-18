import { JWTAdapter } from './jwt-adapter';

import jwt from 'jsonwebtoken';

describe('JWTAdapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JWTAdapter('secret');
    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });
});
