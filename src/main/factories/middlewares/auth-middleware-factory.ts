import { Middleware } from '@presentation/contracts';
import { AuthMiddleware } from '@presentation/middlewares';
import { makeLoadAccountByToken } from '../usecases';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeLoadAccountByToken(), role);
};
