import { AccessDeniedError } from '@presentation/errors';
import { forbidden } from '@presentation/helpers';

import { AuthMiddleware } from './auth-middleware';

const makeSut = (): AuthMiddleware => {
  return new AuthMiddleware();
};

describe('AuthMiddleware', () => {
  it('should return 403 if no x-acess-token exists in headers', async () => {
    const sut = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
